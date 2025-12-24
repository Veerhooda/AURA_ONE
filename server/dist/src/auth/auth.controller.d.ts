import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
        patient: any;
        doctorId: any;
        isProfileComplete: boolean;
    }>;
    register(body: any): Promise<any>;
    refresh(body: {
        refresh_token: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getProfile(req: any): Promise<any>;
}
