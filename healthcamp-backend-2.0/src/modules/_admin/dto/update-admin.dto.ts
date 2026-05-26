import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { deptType } from "src/helper/types/index.type";


export class UpdateAdminDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    name?: string;

    @IsNumber()
    // @Validate(PhoneNumberValidator)
    @ApiProperty()
    @IsOptional()
    contact?: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    address?: string;

    @IsEnum(deptType)
    @IsOptional()
    @ApiProperty()
    department?: deptType;
}
