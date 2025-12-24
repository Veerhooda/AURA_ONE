import { DoctorService } from './doctor.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
export declare class DoctorController {
    private readonly doctorService;
    constructor(doctorService: DoctorService);
    getDoctor(id: number): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        userId: number | null;
        specialty: string;
    }>;
    updateDoctor(id: number, updateDto: UpdateDoctorDto): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        userId: number | null;
        specialty: string;
    }>;
}
