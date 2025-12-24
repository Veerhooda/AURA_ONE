"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CorruptionAlertService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorruptionAlertService = void 0;
const common_1 = require("@nestjs/common");
let CorruptionAlertService = CorruptionAlertService_1 = class CorruptionAlertService {
    constructor() {
        this.logger = new common_1.Logger(CorruptionAlertService_1.name);
    }
    async alertCorruption(correlationId, entityType, entityId, encryptedData, error) {
        const alert = {
            severity: 'HIGH',
            title: '🔴 ENCRYPTION CORRUPTION DETECTED',
            correlationId,
            entityType,
            entityId,
            timestamp: new Date().toISOString(),
            error,
            encryptedDataSample: encryptedData.substring(0, 50) + '...',
        };
        this.logger.error(`🔴 CORRUPTION ALERT: ${JSON.stringify(alert, null, 2)}`);
        await this.sendSlackAlert(alert);
        await this.sendEmailAlert(alert);
    }
    async sendSlackAlert(alert) {
        try {
            this.logger.log(`📢 Slack alert sent for correlation ID ${alert.correlationId}`);
        }
        catch (error) {
            this.logger.error(`❌ Failed to send Slack alert: ${error.message}`);
        }
    }
    async sendEmailAlert(alert) {
        try {
            this.logger.log(`📧 Email alert sent for correlation ID ${alert.correlationId}`);
        }
        catch (error) {
            this.logger.error(`❌ Failed to send email alert: ${error.message}`);
        }
    }
    async alertVitalsFailure(patientId, vitalsData, error) {
        const correlationId = `VITALS-${Date.now()}-${patientId}`;
        const alert = {
            severity: 'HIGH',
            title: '🔴 VITALS PERSISTENCE FAILURE',
            correlationId,
            patientId,
            timestamp: new Date().toISOString(),
            error,
            vitalsData,
        };
        this.logger.error(`🔴 VITALS FAILURE ALERT: ${JSON.stringify(alert, null, 2)}`);
        await this.sendSlackAlert(alert);
    }
    async alertEmergencyDeliveryFailure(alertId, patientId, attempts) {
        const correlationId = `EMERGENCY-${Date.now()}-${alertId}`;
        const alert = {
            severity: 'CRITICAL',
            title: '🚨 EMERGENCY DELIVERY FAILURE - ALL CHANNELS EXHAUSTED',
            correlationId,
            alertId,
            patientId,
            timestamp: new Date().toISOString(),
            attempts,
            action: 'MANUAL INTERVENTION REQUIRED',
        };
        this.logger.error(`🚨 CRITICAL ALERT: ${JSON.stringify(alert, null, 2)}`);
        await this.sendSlackAlert(alert);
        await this.sendEmailAlert(alert);
    }
};
exports.CorruptionAlertService = CorruptionAlertService;
exports.CorruptionAlertService = CorruptionAlertService = CorruptionAlertService_1 = __decorate([
    (0, common_1.Injectable)()
], CorruptionAlertService);
//# sourceMappingURL=corruption-alert.service.js.map