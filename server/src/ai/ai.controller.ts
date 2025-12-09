import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('vision/describe')
  @UseInterceptors(FileInterceptor('image'))
  async describeImage(@UploadedFile() file: any) {
    // In real app, file would be Multer file
    return this.aiService.processImage(file ? file.buffer : null);
  }

  @Post('vision/pain')
  @UseInterceptors(FileInterceptor('image'))
  async detectPain(@UploadedFile() file: any) {
      return this.aiService.detectPain(file ? file.buffer : null);
  }

  @Post('voice/command')
  async processVoice(@Body('text') text: string) {
      return this.aiService.processVoice(text);
  }
}
