import { PrismaService } from '../prisma/prisma.service';
import { Doctor } from '@prisma/client';
export declare class DoctorService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDoctorById(id: number): Promise<Doctor>;
    updateDoctor(id: number, data: {
        name?: string;
        specialty?: string;
        email?: string;
    }): Promise<Doctor>;
}
