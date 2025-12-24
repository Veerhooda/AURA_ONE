import { Controller, Post, Get, Body, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'; // Ensure AuthGuard is imported if from passport, or check where it comes from.
// Actually AuthGuard usually from @nestjs/passport as used elsewhere.
// But earlier view showed it imported from @nestjs/passport. Let's make sure.

/**
 * Finding #2: Token Refresh Endpoint
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user); // Now returns access_token + user object
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  /**
   * Refresh access token using refresh token
   * Returns new access token or 401 if refresh token invalid/expired
   */
  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    try {
      const result = await this.authService.refreshAccessToken(body.refresh_token);
      return result;
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }
}
