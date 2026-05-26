
import { IsEnum } from "class-validator";
import { enrollStatus } from "src/helper/types/index.type";

export class CreateEnrollmentDto {
    @IsEnum(enrollStatus)
    status: enrollStatus;
}
