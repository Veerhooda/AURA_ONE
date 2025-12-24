import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateConversation(patientId: number, doctorId: number) {
    let conversation = await this.prisma.conversation.findUnique({
      where: {
        patientId_doctorId: {
          patientId,
          doctorId,
        },
      },
      include: {
        patient: { include: { user: true } },
        doctor: true,
      }
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          patientId,
          doctorId,
        },
        include: {
          patient: { include: { user: true } },
          doctor: true,
        }
      });
    }

    return conversation;
  }

  async sendMessage(
    senderId: number, 
    conversationId: number, 
    content: string, 
    type: string = 'TEXT',
    attachmentUrl?: string,
    linkedVitalsId?: number
  ) {
    // Determine senderType from user role
    const user = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: { role: true }
    });

    if (!user) {
      throw new Error(`User with id ${senderId} not found`);
    }

    // Map role to senderType (PATIENT, DOCTOR, NURSE, etc.)
    const senderType = user.role; // Role enum matches senderType enum

    const message = await this.prisma.message.create({
      data: {
        senderId,
        senderType,
        conversationId,
        content,
        type,
        linkedVitalsId,
        sequence: 0, // TODO: Implement proper sequencing
      }
    });

    // Update conversation last message time
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
      }
    });

    return message;
  }

  async getMessages(conversationId: number) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getConversationMessages(conversationId: number, limit = 50) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getDoctorInbox(doctorId: number) {
    return this.prisma.conversation.findMany({
      where: { doctorId },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        patient: {
          include: {
            user: { select: { name: true, email: true } }
          }
        },
        doctor: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get the latest message for preview
          select: {
            id: true,
            content: true,
            type: true,
            createdAt: true,
            senderType: true
          }
        },
        _count: {
          select: { messages: true }
        }
      }
    });
  }

  async getPatientConversations(patientId: number) {
    return this.prisma.conversation.findMany({
      where: { patientId },
      include: {
        doctor: true,
        patient: { include: { user: true } },
      },
      orderBy: { lastMessageAt: 'desc' }
    });
  }

  private _previewContent(content: string, type: string): string {
    if (type === 'TEXT') {
      return content.substring(0, 50);
    }
    return `[${type}]`;
  }
}
