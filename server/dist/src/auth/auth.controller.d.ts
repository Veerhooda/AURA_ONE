import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(signInDto: Record<string, any>): Promise<{
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
    register(createUserDto: any): Promise<any>;
}
