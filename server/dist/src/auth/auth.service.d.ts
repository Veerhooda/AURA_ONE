import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private prisma;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
        patient: any;
        isProfileComplete: boolean;
    }>;
    register(data: any): Promise<any>;
}
