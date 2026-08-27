export interface MicroserviceSpec {
  name: string;
  domain: string;
  protocol: 'REST / GraphQL' | 'gRPC (High Throughput)' | 'MQTT / WebSockets' | 'Kafka Event Consumer';
  description: string;
  responsibilities: string[];
  kafkaEventsEmitted: string[];
  keyEndpoints: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    description: string;
    dto: string;
  }[];
}

export const MICROSERVICES_SPEC: MicroserviceSpec[] = [
  {
    name: 'Identity & Multi-Tenant Service',
    domain: 'Core / IAM',
    protocol: 'REST / GraphQL',
    description: 'Gestión central de tenants, sucursales, roles (RBAC), autenticación JWT y semillas TOTP para QR de acceso.',
    responsibilities: [
      'Aislamiento de inquilinos con RLS y subdominios personalizados',
      'Autenticación multifactor y generación de semillas TOTP',
      'Gestión de perfiles de socios, entrenadores y staff administrativo'
    ],
    kafkaEventsEmitted: ['tenant.created', 'user.registered', 'user.status_changed'],
    keyEndpoints: [
      { method: 'POST', path: '/api/v1/auth/login', description: 'Autenticación universal con detección automática de Tenant', dto: 'LoginDto' },
      { method: 'POST', path: '/api/v1/tenants', description: 'Aprovisionamiento de nueva franquicia o gimnasio', dto: 'CreateTenantDto' },
      { method: 'GET', path: '/api/v1/users/me/access-token-qr', description: 'Generación del TOTP token para QR dinámico (15s)', dto: 'None' }
    ]
  },
  {
    name: 'Booking & Concurrency Engine',
    domain: 'Scheduling / Boutique',
    protocol: 'gRPC (High Throughput)',
    description: 'Motor de reservas de alta concurrencia protegido con Redis Redlock y scripts Lua para evitar Overbooking de cupos.',
    responsibilities: [
      'Reserva visual de bicicletas (Spinning) y reformers (Pilates)',
      'Control de concurrencia atómica sub-milisegundo (<5ms)',
      'Gestión automática de listas de espera FIFO y penalizaciones No-Show'
    ],
    kafkaEventsEmitted: ['booking.confirmed', 'booking.waitlisted', 'booking.cancelled', 'waitlist.promoted'],
    keyEndpoints: [
      { method: 'POST', path: '/api/v1/classes/:id/reserve-spot', description: 'Reserva atómica de asiento con bloqueo distribuido Redis', dto: 'ReserveSpotDto' },
      { method: 'DELETE', path: '/api/v1/classes/:id/cancel', description: 'Cancelación de reserva y promoción inmediata de lista de espera', dto: 'CancelBookingDto' },
      { method: 'GET', path: '/api/v1/classes/:id/spot-map', description: 'Mapa de asientos en tiempo real con estados visuales', dto: 'None' }
    ]
  },
  {
    name: 'Access Control & IoT Edge Engine',
    domain: 'Hardware / Security',
    protocol: 'MQTT / WebSockets',
    description: 'Validador de torniquetes, molinetes y biometría con latencia <150ms y soporte de caché offline.',
    responsibilities: [
      'Validación de QR dinámico TOTP contra semilla criptográfica',
      'Reglas de negocio instantáneas: membresía al día, anti-passback, sin deudas',
      'Sincronización bidireccional de listas blancas hacia hardware ZKTeco/Dahua'
    ],
    kafkaEventsEmitted: ['access.granted', 'access.denied', 'access.anti_passback_alert'],
    keyEndpoints: [
      { method: 'POST', path: '/api/v1/iot/validate-access', description: 'Validación en milisegundos desde torniquete físico', dto: 'ValidateAccessDto' },
      { method: 'POST', path: '/api/v1/iot/sync-offline-cache', description: 'Descarga del padrón de socios autorizados para modo sin internet', dto: 'SyncCacheDto' },
      { method: 'GET', path: '/api/v1/iot/gate-status', description: 'Telemetría y estado operativo de torniquetes en tiempo real', dto: 'None' }
    ]
  },
  {
    name: 'Fiscal Billing & SUNAT Hub',
    domain: 'Finance / Local Payments',
    protocol: 'REST / GraphQL',
    description: 'Motor tributario para emisión de Boletas y Facturas electrónicas SUNAT (UBL 2.1) y pagos Culqi, Niubiz y Yape.',
    responsibilities: [
      'Firma digital de XML UBL 2.1 con certificado digital X.509',
      'Conexión directa SOAP con SUNAT / PSE / OSE para recepción de CDR',
      'Cobros recurrentes automáticos con tokenización de tarjetas (Culqi/Niubiz)',
      'Generación de QR dinámico de pago Yape/Plin en caja de recepción'
    ],
    kafkaEventsEmitted: ['payment.succeeded', 'invoice.sunat_accepted', 'invoice.sunat_rejected', 'payment.failed'],
    keyEndpoints: [
      { method: 'POST', path: '/api/v1/payments/culqi/charge', description: 'Cargo con token de tarjeta Culqi y autoemisión de Boleta SUNAT', dto: 'CulqiChargeDto' },
      { method: 'POST', path: '/api/v1/payments/yape-qr/generate', description: 'Generación de QR dinámico Yape para recepción', dto: 'CreateYapeQrDto' },
      { method: 'POST', path: '/api/v1/invoices/sunat/emit', description: 'Generación y firma de XML UBL 2.1 para SUNAT', dto: 'EmitInvoiceDto' },
      { method: 'POST', path: '/api/v1/webhooks/culqi', description: 'Webhook idempotente de confirmación de cobros', dto: 'WebhookPayloadDto' }
    ]
  },
  {
    name: 'Training & Bioimpedance Service',
    domain: 'Workout / Health',
    protocol: 'REST / GraphQL',
    description: 'Biblioteca interactiva de ejercicios, pizarras de WODs para CrossFit, PRs y sincronización con básculas InBody.',
    responsibilities: [
      'Gestión de rutinas de sobrecarga progresiva',
      'Integración con básculas InBody / Tanita vía Bluetooth y APIs',
      'Leaderboard comunitario y pizarras WOD en televisores del box'
    ],
    kafkaEventsEmitted: ['workout.completed', 'pr.broken', 'body_composition.recorded'],
    keyEndpoints: [
      { method: 'GET', path: '/api/v1/exercises', description: 'Catálogo de ejercicios con filtro muscular y modelos 3D', dto: 'ExerciseFilterDto' },
      { method: 'POST', path: '/api/v1/body-composition', description: 'Registro de bioimpedancia y cálculo de grasa/músculo', dto: 'RecordBodyCompDto' },
      { method: 'GET', path: '/api/v1/wods/today', description: 'WOD del día y leaderboard en tiempo real', dto: 'None' }
    ]
  },
  {
    name: 'WhatsApp Bot & CRM Automation',
    domain: 'Marketing / Notifications',
    protocol: 'REST / GraphQL',
    description: 'Automatizaciones nativas con WhatsApp Cloud API para cobranza preventiva, bienvenida y reactivación.',
    responsibilities: [
      'Envío automático de credencial digital interactiva con link al QR',
      'Recordatorio automático 3 días antes del vencimiento con botón de pago directo',
      'Disparador inteligente para socios inactivos por más de 14 días'
    ],
    kafkaEventsEmitted: ['whatsapp.message_sent', 'lead.converted_to_member'],
    keyEndpoints: [
      { method: 'POST', path: '/api/v1/crm/whatsapp/send-template', description: 'Envío de plantilla aprobada de WhatsApp Cloud API', dto: 'SendWhatsappDto' },
      { method: 'POST', path: '/api/v1/webhooks/whatsapp', description: 'Recepción de respuestas de clientes al bot de WhatsApp', dto: 'WhatsAppWebhookDto' }
    ]
  }
];

export const NESTJS_CODE_SAMPLES = {
  controller: `// ============================================================================
// NestJS Controller: Booking & Concurrency Controller
// Ubicación: src/modules/booking/presentation/controllers/class-booking.controller.ts
// ============================================================================

import { 
  Controller, 
  Post, 
  Param, 
  Body, 
  UseGuards, 
  Req, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TenantRlsGuard } from '@/common/guards/tenant-rls.guard';
import { ReserveSpotUseCase } from '../../application/use-cases/reserve-spot.use-case';
import { ReserveSpotDto } from '../dtos/reserve-spot.dto';
import { BookingResponseDto } from '../dtos/booking-response.dto';

@ApiTags('Boutique Class Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantRlsGuard)
@Controller('api/v1/classes')
export class ClassBookingController {
  constructor(private readonly reserveSpotUseCase: ReserveSpotUseCase) {}

  @Post(':classId/reserve-spot')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Reserva atómica de asiento boutique (Spinning/Pilates) con prevención de Overbooking' 
  })
  @ApiResponse({ status: 200, description: 'Reserva confirmada exitosamente', type: BookingResponseDto })
  @ApiResponse({ status: 409, description: 'Cupo o spot ya ocupado por otro usuario' })
  async reserveSpot(
    @Param('classId') classId: string,
    @Body() dto: ReserveSpotDto,
    @Req() req: any,
  ): Promise<BookingResponseDto> {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    return await this.reserveSpotUseCase.execute({
      tenantId,
      classId,
      userId,
      spotNumber: dto.spotNumber,
    });
  }
}`,

  useCase: `// ============================================================================
// NestJS Application Use-Case: ReserveSpotUseCase (Clean Architecture)
// Ubicación: src/modules/booking/application/use-cases/reserve-spot.use-case.ts
// ============================================================================

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { RedisConcurrencyService } from '@/infrastructure/redis/redis-concurrency.service';
import { ClassRepository } from '../../domain/repositories/class.repository';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { EventBusService } from '@/infrastructure/messaging/event-bus.service';
import { BookingConfirmedEvent } from '../../domain/events/booking-confirmed.event';

export interface ReserveSpotCommand {
  tenantId: string;
  classId: string;
  userId: string;
  spotNumber: number;
}

@Injectable()
export class ReserveSpotUseCase {
  constructor(
    private readonly redisLock: RedisConcurrencyService,
    private readonly classRepo: ClassRepository,
    private readonly bookingRepo: BookingRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: ReserveSpotCommand) {
    const { tenantId, classId, userId, spotNumber } = command;

    // 1. Ejecutar script Lua atómico en Redis para reservar el cupo y spot en <2ms
    const luaResult = await this.redisLock.atomicSpotReservation({
      tenantId,
      classId,
      userId,
      spotNumber,
      ttlSeconds: 300, // Bloqueo de 5 min mientras se confirma la transacción
    });

    if (luaResult.status === 'SPOT_TAKEN') {
      throw new ConflictException(\`El asiento #\${spotNumber} fue reservado en este instante por otro socio.\`);
    }

    if (luaResult.status === 'CLASS_FULL') {
      // Registrar automáticamente en lista de espera FIFO
      const waitlistPos = await this.bookingRepo.addToWaitlist(tenantId, classId, userId);
      return {
        status: 'WAITLISTED',
        message: 'Clase llena. Has sido colocado en la lista de espera.',
        waitlistPosition: waitlistPos,
      };
    }

    try {
      // 2. Persistir en base de datos relacional PostgreSQL con RLS
      const booking = await this.bookingRepo.createConfirmedBooking({
        tenantId,
        classId,
        userId,
        spotNumber,
      });

      // 3. Emitir evento de dominio a Kafka/RabbitMQ para WhatsApp y notificaciones Push
      await this.eventBus.publish(new BookingConfirmedEvent({
        bookingId: booking.id,
        tenantId,
        userId,
        classId,
        spotNumber,
      }));

      return {
        status: 'CONFIRMED',
        bookingId: booking.id,
        spotNumber,
        message: \`¡Reserva confirmada para la bicicleta/reformer #\${spotNumber}!\`,
      };
    } catch (error) {
      // Rollback en Redis si falló la persistencia en base de datos
      await this.redisLock.releaseSpotReservation(tenantId, classId, spotNumber);
      throw error;
    }
  }
}`
};
