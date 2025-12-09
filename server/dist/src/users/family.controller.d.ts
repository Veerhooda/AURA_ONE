import { PrismaService } from '../prisma/prisma.service';
export declare class FamilyController {
    private prisma;
    constructor(prisma: PrismaService);
    getMyPatients(req: any): Promise<{
        relation: string;
        patientId: number;
        name: string;
        ward: string;
        lastVitals: {
            id: number;
            patientId: number;
            timestamp: Date;
            type: string;
            value: number;
            unit: string;
        };
        activeAlerts: number;
    }[]>;
}
