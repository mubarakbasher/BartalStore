import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Notifications service — scaffolded per PRD §10.3 + §7.1.7.
 *
 * Phase 1 behaviour: SMS and FCM calls are no-ops that log the intent and
 * persist to `sms_logs` so the UX-level flows can be tested without external
 * credentials. Real Africa's Talking + Firebase Admin SDK calls land in
 * implementation pass — see plan §"Phase 2 — Backend API" in tasks.md.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async sendSms(phone: string, message: string): Promise<void> {
    const enabled = Boolean(this.config.get<string>('sms.apiKey'));
    if (!enabled) {
      this.logger.warn(`[SMS:STUB] → ${phone}: ${message.slice(0, 80)}…`);
    }
    await this.prisma.smsLog.create({
      data: {
        phone,
        message,
        status: enabled ? 'PENDING' : 'STUBBED',
        provider: 'africas_talking',
      },
    });
  }

  async sendPush(_fcmToken: string, _title: string, _body: string): Promise<void> {
    this.logger.warn('[FCM:STUB] push notifications not yet wired up');
  }
}
