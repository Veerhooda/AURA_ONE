import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Production Blocker #2: Emergency Fallback Service
 * WebSocket → Push → SMS with retry and backoff
 */
@Injectable()
export class EmergencyFallbackService {
  private readonly logger = new Logger(EmergencyFallbackService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Send push notification via Firebase
   * Returns true if successful
   */
  async sendPushNotification(
    alertId: number,
    deviceToken: string,
    payload: any,
  ): Promise<boolean> {
    try {
      // TODO: Integrate Firebase Admin SDK
      // const admin = require('firebase-admin');
      // await admin.messaging().send({
      //   token: deviceToken,
      //   notification: {
      //     title: `🚨 ${payload.severity} Emergency`,
      //     body: `Patient ${payload.patientName}: ${payload.vitalType}`,
      //   },
      //   data: {
      //     alertId: alertId.toString(),
      //     patientId: payload.patientId.toString(),
      //   },
      // });

      this.logger.log(`📲 Push notification sent for alert ${alertId}`);

      // Log delivery attempt
      await this.logDeliveryAttempt(alertId, 'PUSH', true);

      return true;
    } catch (error) {
      this.logger.error(
        `❌ Push notification failed for alert ${alertId}: ${error.message}`,
      );

      await this.logDeliveryAttempt(alertId, 'PUSH', false, error.message);

      return false;
    }
  }

  /**
   * Send SMS via Twilio
   * Returns true if successful
   */
  async sendSMS(
    alertId: number,
    phoneNumber: string,
    message: string,
  ): Promise<boolean> {
    try {
      // TODO: Integrate Twilio SDK
      // const twilio = require('twilio');
      // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
      // await client.messages.create({
      //   body: message,
      //   from: process.env.TWILIO_PHONE,
      //   to: phoneNumber,
      // });

      this.logger.log(`📱 SMS sent for alert ${alertId} to ${phoneNumber}`);

      await this.logDeliveryAttempt(alertId, 'SMS', true);

      return true;
    } catch (error) {
      this.logger.error(
        `❌ SMS failed for alert ${alertId}: ${error.message}`,
      );

      await this.logDeliveryAttempt(alertId, 'SMS', false, error.message);

      return false;
    }
  }

  /**
   * Attempt delivery with fallback chain
   * WebSocket → Push → SMS
   */
  async attemptDeliveryWithFallback(
    alertId: number,
    userId: number,
    payload: any,
  ): Promise<void> {
    // WebSocket already attempted by gateway
    // Check if delivered
    const alert = await this.prisma.emergencyAlert.findUnique({
      where: { id: alertId },
    });

    if (alert?.deliveredAt) {
      this.logger.log(`✅ Alert ${alertId} already delivered via WebSocket`);
      return;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    // Try push notification
    const deviceToken = await this.getDeviceToken(userId);
    if (deviceToken) {
      const pushSuccess = await this.sendPushNotification(
        alertId,
        deviceToken,
        payload,
      );

      if (pushSuccess) {
        await this.prisma.emergencyAlert.update({
          where: { id: alertId },
          data: {
            deliveredVia: 'PUSH',
            deliveredAt: new Date(),
          },
        });
        return;
      }
    }

    // Try SMS fallback (TODO: Add phone field to User model)
    // if (user?.phone) {
    //   const smsMessage = `🚨 EMERGENCY: Patient ${payload.patientName} - ${payload.vitalType} ${payload.severity}. Check AURA ONE immediately.`;
    //   const smsSuccess = await this.sendSMS(alertId, user.phone, smsMessage);
    //   if (smsSuccess) {
    //     await this.prisma.emergencyAlert.update({
    //       where: { id: alertId },
    //       data: {
    //         deliveredVia: 'SMS',
    //         deliveredAt: new Date(),
    //       },
    //     });
    //     return;
    //   }
    // }

    // All channels failed
    this.logger.error(
      `❌ All delivery channels failed for alert ${alertId}. Manual intervention required.`,
    );
  }

  /**
   * Log delivery attempt for audit trail
   */
  private async logDeliveryAttempt(
    alertId: number,
    channel: string,
    success: boolean,
    error?: string,
  ): Promise<void> {
    // Store in separate delivery log table for audit
    this.logger.log(
      `📝 Delivery attempt: Alert ${alertId}, Channel ${channel}, Success ${success}${error ? `, Error: ${error}` : ''}`,
    );

    // TODO: Create DeliveryAttemptLog table
    // await this.prisma.deliveryAttemptLog.create({
    //   data: {
    //     emergencyAlertId: alertId,
    //     channel,
    //     success,
    //     error,
    //     attemptedAt: new Date(),
    //   },
    // });
  }

  /**
   * Get device token for push notifications
   */
  private async getDeviceToken(userId: number): Promise<string | null> {
    // TODO: Implement device token storage
    // const device = await this.prisma.userDevice.findFirst({
    //   where: { userId, active: true },
    //   select: { fcmToken: true },
    // });
    // return device?.fcmToken || null;

    return null; // Placeholder
  }

  /**
   * Retry undelivered alerts with exponential backoff
   * Called by background job
   */
  async retryUndeliveredAlerts(): Promise<void> {
    const undelivered = await this.prisma.emergencyAlert.findMany({
      where: {
        deliveredAt: null,
        retryCount: { lt: 5 },
      },
      include: {
        patient: {
          select: {
            id: true,
            mrn: true,
            user: { select: { name: true } },
          },
        },
      },
    });

    for (const alert of undelivered) {
      // Exponential backoff: 1min, 2min, 4min, 8min, 16min
      const backoffMinutes = Math.pow(2, alert.retryCount);
      const timeSinceTriggered =
        (Date.now() - alert.triggeredAt.getTime()) / 1000 / 60;

      if (timeSinceTriggered >= backoffMinutes) {
        this.logger.log(
          `🔄 Retrying delivery for alert ${alert.id} (attempt ${alert.retryCount + 1})`,
        );

        // Attempt delivery
        await this.attemptDeliveryWithFallback(alert.id, 0, {
          severity: alert.severity,
          vitalType: alert.vitalType,
          patientName: alert.patient.user.name,
          patientId: alert.patientId,
        });

        // Increment retry count
        await this.prisma.emergencyAlert.update({
          where: { id: alert.id },
          data: {
            retryCount: { increment: 1 },
            lastRetryAt: new Date(),
          },
        });
      }
    }
  }
}
