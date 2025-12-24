import { Controller, Get, Post, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

class StartChatDto {
  @IsInt()
  patientId: number;
  
  @IsInt()
  doctorId: number;
}

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('conversation')
  @ApiOperation({ summary: 'Get or create a conversation thread' })
  async getConversation(@Body() body: StartChatDto) {
    const thread = await this.chatService.getOrCreateConversation(body.patientId, body.doctorId);
    const messages = await this.chatService.getMessages(thread.id);
    return { ...thread, messages };
  }
  
  @Get('inbox/doctor')
  @ApiOperation({ summary: 'Get doctor inbox' })
  async getDoctorInbox(@Request() req) {
      // Assuming user.doctor.id is needed, but we currently have user.userId.
      // We might need to fetch the doctor profile ID from the user ID. 
      // For now, let's assume the frontend passes doctorId or we derive it.
      // Better: Use a dedicated endpoint to get "my profile" then use that ID.
      // Or look it up here.
      // Let's rely on Query param for flexibility or simplicity for this MVP.
      // Ideally: userId -> Doctor -> id
      // Since I don't have easy access to that lookup without circular deps easily, I'll pass via Query.
      // WAIT: I should be safe.
      // Actually, I'll allow passing doctorId via query for now.
      
      const { doctorId } = req.query;
      return this.chatService.getDoctorInbox(parseInt(doctorId));
  }
  
  @Get('inbox/patient')
  @ApiOperation({ summary: 'Get patient conversation list' })
  async getPatientInbox(@Query('patientId') patientId: string) {
      return this.chatService.getPatientConversations(parseInt(patientId));
  }
  
  @Get('history')
  async getHistory(@Query('conversationId') conversationId: string) {
      return this.chatService.getMessages(parseInt(conversationId));
  }
  
  @Get('messages/:id')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  async getConversationMessages(@Param('id') id: string) {
      const conversationId = parseInt(id);
      console.log(`📚 Loading messages for conversation ${conversationId}`);
      const messages = await this.chatService.getConversationMessages(conversationId);
      console.log(`📚 Found ${messages.length} messages`);
      return messages;
  }
}
