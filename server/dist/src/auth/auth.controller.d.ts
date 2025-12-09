import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(signInDto: Record<string, any>): Promise<{
        access_token: string;
    }>;
    register(createUserDto: Prisma.UserCreateInput): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
