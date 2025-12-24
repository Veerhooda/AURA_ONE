export declare class VitalsValidationService {
    private readonly VITALS_RANGES;
    validate(vitalsData: any): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    };
    getRanges(): {
        hr: {
            min: number;
            max: number;
            unit: string;
        };
        spo2: {
            min: number;
            max: number;
            unit: string;
        };
        systolic: {
            min: number;
            max: number;
            unit: string;
        };
        diastolic: {
            min: number;
            max: number;
            unit: string;
        };
        temp: {
            min: number;
            max: number;
            unit: string;
        };
        respiratoryRate: {
            min: number;
            max: number;
            unit: string;
        };
    };
}
