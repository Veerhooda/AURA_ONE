import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { FamilyController } from './family.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FamilyController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
