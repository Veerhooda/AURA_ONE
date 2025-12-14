import { Controller, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('history/:userId/:otherUserId')
  getChatHistory(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('otherUserId', ParseIntPipe) otherUserId: number,
  ) {
    return this.chatService.getHistory(userId, otherUserId);
  }
}
