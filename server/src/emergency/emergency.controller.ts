import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditService } from '../audit/audit.service';

/**
 * Finding #14 & #16: Emergency Alert Controller
 * Handles emergency acknowledgment with server confirmation
 */
@Controller('emergency')
@UseGuards(JwtAuthGuard)
export class EmergencyController {
  constructor(
    private emergencyService: EmergencyService,
    private auditService: AuditService,
  ) {}

  /**
   * Finding #16: Acknowledge emergency with server confirmation
   * Returns success/failure for client to wait before dismissing UI
   */
  @Post('acknowledge')
  async acknowledgeEmergency(
    @Body() body: { alertId: number; userId: number },
  ) {
    const { alertId, userId } = body;

    const success = await this.emergencyService.acknowledgeEmergency(
      alertId,
      userId,
    );

    if (success) {
      // Audit log the acknowledgment
      await this.auditService.log(
        userId,
        'DOCTOR', // TODO: Get from JWT
        'ACKNOWLEDGE_EMERGENCY',
        'EMERGENCY_ALERT',
        alertId,
        { alertId, acknowledgedAt: new Date() },
      );

      return { success: true, message: 'Emergency acknowledged' };
    } else {
      return { success: false, message: 'Failed to acknowledge emergency' };
    }
  }

  /**
   * Get unacknowledged alerts for a patient
   */
  @Get('unacknowledged/:patientId')
  async getUnacknowledgedAlerts(@Param('patientId') patientId: string) {
    return this.emergencyService.getUnacknowledgedAlerts(parseInt(patientId));
  }

  /**
   * Get all unacknowledged alerts (for dashboard)
   */
  @Get('unacknowledged')
  async getAllUnacknowledgedAlerts() {
    return this.emergencyService.getUnacknowledgedAlerts();
  }
}
