import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SyllabusDto {
  @IsNumber()
  week: number;

  @IsString()
  topic: string;

  @IsString()
  content: string;
}

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  credits?: number;

  @IsString()
  @IsOptional()
  schedule?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  maxStudents?: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  resources?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyllabusDto)
  syllabus: SyllabusDto[];

  @IsString()
  teacherId: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  studentIds?: string[];
}
