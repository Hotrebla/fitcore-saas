export const REDIS_LUA_OVERBOOKING_SCRIPT = `-- ============================================================================
-- REDIS LUA SCRIPT: ATOMIC BOUTIQUE CLASS & SPOT RESERVATION
-- Complejidad Temporal: O(1)
-- Garantía: Atomicidad absoluta en un único hilo de ejecución de Redis.
-- Evita cualquier Race Condition entre 50+ peticiones concurrentes en el mismo milisegundo.
-- ============================================================================

-- KEYS[1] = fitcore:class:{tenant_id}:{class_id}:meta        (Hash: total_spots, booked_spots)
-- KEYS[2] = fitcore:class:{tenant_id}:{class_id}:spots       (Hash: spot_num -> user_id)
-- KEYS[3] = fitcore:class:{tenant_id}:{class_id}:user_locks  (Set: user_ids con reserva activa)
-- KEYS[4] = fitcore:class:{tenant_id}:{class_id}:waitlist    (List / Sorted Set FIFO)

-- ARGV[1] = user_id (UUID del socio)
-- ARGV[2] = spot_number (Número de bicicleta o reformer solicitado, ej: 14)
-- ARGV[3] = timestamp (Unix timestamp)

local metaKey      = KEYS[1]
local spotsKey     = KEYS[2]
local userLocksKey = KEYS[3]
local waitlistKey  = KEYS[4]

local userId     = ARGV[1]
local spotNumber = ARGV[2]
local timestamp  = ARGV[3]

-- 1. Verificar si el usuario ya tiene una reserva activa en esta misma clase (Anti-Double Booking)
if redis.call('SISMEMBER', userLocksKey, userId) == 1 then
    return cjson.encode({
        status = 'ERROR_ALREADY_BOOKED',
        message = 'El usuario ya cuenta con un cupo reservado en esta clase.'
    })
end

-- 2. Obtener capacidad y cupos ocupados actuales
local totalSpots  = tonumber(redis.call('HGET', metaKey, 'total_spots') or 0)
local bookedSpots = tonumber(redis.call('HGET', metaKey, 'booked_spots') or 0)

-- 3. Si la clase ya está 100% llena, colocar automáticamente en Lista de Espera FIFO
if bookedSpots >= totalSpots then
    redis.call('RPUSH', waitlistKey, userId)
    local waitlistPos = redis.call('LLEN', waitlistKey)
    return cjson.encode({
        status = 'CLASS_FULL_WAITLISTED',
        waitlist_position = waitlistPos,
        message = 'Clase llena. Usuario posicionado en lista de espera #' .. waitlistPos
    })
end

-- 4. Si el usuario solicitó un spot específico (ej. Bicicleta #14), verificar que esté libre
if spotNumber and spotNumber ~= '0' and spotNumber ~= '' then
    local currentOwner = redis.call('HGET', spotsKey, spotNumber)
    if currentOwner then
        return cjson.encode({
            status = 'ERROR_SPOT_OCCUPIED',
            occupied_by = currentOwner,
            message = 'El asiento #' .. spotNumber .. ' ya fue ocupado en este instante.'
        })
    end
    -- Asignar el spot específico
    redis.call('HSET', spotsKey, spotNumber, userId)
end

-- 5. Incrementar atómicamente el contador de cupos reservados y bloquear al usuario
redis.call('HINCRBY', metaKey, 'booked_spots', 1)
redis.call('SADD', userLocksKey, userId)

return cjson.encode({
    status = 'SUCCESS_RESERVED',
    spot_number = spotNumber,
    new_booked_count = bookedSpots + 1,
    remaining_spots = totalSpots - (bookedSpots + 1),
    timestamp = timestamp
})
`;

export const CONCURRENCY_EXPLANATION = {
  problem: '50 usuarios intentan reservar simultáneamente el ÚNICO cupo disponible (Spot #12) en una clase de Spinning a las 07:00:00.000 AM.',
  traditionalFail: 'En una arquitectura tradicional con transacciones SQL (SELECT -> UPDATE), se produce una condición de carrera (Race Condition). Los 50 hilos leen "booked_spots = 23, total = 24", los 50 intentan ejecutar el UPDATE y se generan sobre-reservas (Overbooking de 49 personas) o bloqueos muertos (Deadlocks) en PostgreSQL.',
  redisSolution: 'Redis ejecuta operaciones en un Single-Thread Event Loop en memoria RAM con latencia de sub-microsegundos. Al encapsular la verificación y la asignación dentro de un Script Lua, la ejecución es 100% ATÓMICA e ININTERRUMPIBLE.',
  executionFlow: [
    {
      step: 1,
      name: 'Llegada de 50 peticiones concurrentes',
      desc: 'El API Gateway recibe 50 requests HTTP en un lapso de 12 milisegundos y los despacha al microservicio de Reservas.'
    },
    {
      step: 2,
      name: 'Ejecución del Script Lua en Redis',
      desc: 'Redis encola las 50 evaluaciones. La primera petición (Petición #1) ejecuta el script en 0.4ms: booked_spots pasa de 23 a 24 y el Spot #12 queda asignado al Usuario #1.'
    },
    {
      step: 3,
      name: 'Rechazo inmediato de las 49 peticiones restantes',
      desc: 'Las peticiones #2 a #50 se evalúan secuencialmente en el mismo ciclo. Al detectar booked_spots >= total_spots (24 >= 24), el script descarta la sobre-reserva y las encola atómicamente en la lista de espera FIFO (LPUSH/RPUSH).'
    },
    {
      step: 4,
      name: 'Persistencia asíncrona y Event Bus',
      desc: 'PostgreSQL persiste la reserva ganadora sin contención de locks, y el evento "booking.confirmed" activa el envío de confirmación con código QR por WhatsApp.'
    },
    {
      step: 5,
      name: 'Promoción automática si alguien cancela',
      desc: 'Si el Usuario #1 cancela 2 horas antes, un worker de Redis hace LPOP a la lista de espera, asigna el cupo al Usuario #2 y le envía un mensaje por WhatsApp con 15 minutos para confirmar su asistencia.'
    }
  ]
};
