import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get('path')
  async findPath(@Query('from') from: string, @Query('to') to: string) {
    const fromId = parseInt(from);
    const toId = parseInt(to);
    
    if (isNaN(fromId) || isNaN(toId)) {
        throw new BadRequestException('Invalid start or end node ID');
    }
    
    return this.navigationService.findPath(fromId, toId);
  }

  @Get('map')
  async getMap() {
    return this.navigationService.getMap();
  }

  // Admin endpoints to build the map
  @Post('node')
  async createNode(@Body() data: any) {
    return this.navigationService.createNode(data);
  }

  @Post('edge')
  async createEdge(@Body() data: any) {
    return this.navigationService.createEdge(data);
  }
}
