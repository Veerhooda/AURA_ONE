"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class StartChatDto {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], StartChatDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], StartChatDto.prototype, "doctorId", void 0);
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getConversation(body) {
        const thread = await this.chatService.getOrCreateConversation(body.patientId, body.doctorId);
        const messages = await this.chatService.getMessages(thread.id);
        return Object.assign(Object.assign({}, thread), { messages });
    }
    async getDoctorInbox(req) {
        const { doctorId } = req.query;
        return this.chatService.getDoctorInbox(parseInt(doctorId));
    }
    async getPatientInbox(patientId) {
        return this.chatService.getPatientConversations(parseInt(patientId));
    }
    async getHistory(conversationId) {
        return this.chatService.getMessages(parseInt(conversationId));
    }
    async getConversationMessages(id) {
        const conversationId = parseInt(id);
        console.log(`📚 Loading messages for conversation ${conversationId}`);
        const messages = await this.chatService.getConversationMessages(conversationId);
        console.log(`📚 Found ${messages.length} messages`);
        return messages;
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('conversation'),
    (0, swagger_1.ApiOperation)({ summary: 'Get or create a conversation thread' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StartChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Get)('inbox/doctor'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor inbox' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getDoctorInbox", null);
__decorate([
    (0, common_1.Get)('inbox/patient'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient conversation list' }),
    __param(0, (0, common_1.Query)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getPatientInbox", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Query)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('messages/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages for a conversation' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversationMessages", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('chat'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map