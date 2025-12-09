"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
let AiService = class AiService {
    async processImage(imageBuffer) {
        return {
            objects: [
                { label: 'medication_bottle', confidence: 0.95, bounding_box: [10, 10, 200, 200] },
                { label: 'text_label', confidence: 0.99, text: "Metformin 500mg" }
            ],
            summary: "I see a medication bottle labeled Metformin 500mg."
        };
    }
    async processVoice(text) {
        const lower = text.toLowerCase();
        if (lower.includes('nurse')) {
            return { intent: 'CALL_NURSE', action: { type: 'create_task', priority: 'high' }, response: "Calling the nurse now." };
        }
        if (lower.includes('medicine') || lower.includes('pill')) {
            return { intent: 'CHECK_SCHEDULE', action: { type: 'query_db' }, response: "Your next medication is at 2 PM." };
        }
        return { intent: 'GENERAL_QUERY', response: "I'm not sure, but I can ask the doctor." };
    }
    async detectPain(imageBuffer) {
        return {
            pain_level: Math.floor(Math.random() * 3) + 1,
            emotion: 'neutral',
            confidence: 0.85
        };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map