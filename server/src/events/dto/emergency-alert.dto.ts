import { IsInt, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * C9: Emergency Alert DTO with validation
 */
export class EmergencyAlertDto {
  @IsInt()
  patientId: number;

  @IsEnum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
  severity: string;

  @IsEnum(['HR', 'SPO2', 'BP', 'TEMP', 'FALL', 'MEDICATION'])
  vitalType: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
