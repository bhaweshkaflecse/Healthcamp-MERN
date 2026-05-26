import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString, ValidateIf } from "class-validator";
import { documentType } from "src/helper/types/index.type";
// import { IsContact } from "src/decorators/isContact.decorator";

export class CreateKycDto {
    @IsString()
    @ApiProperty({ required: false })
    @IsOptional()
    organization?: string;

    @IsString()
    @ApiProperty({ required: false })
    @IsOptional()
    province: string;

    @IsString()
    @ApiProperty({ required: false })
    @IsOptional()
    city: string;

    @IsString()
    @ApiProperty({ required: false })
    @IsOptional()
    streetAddress?: string;

    @IsString()
    @ApiProperty({ required: false })
    @IsOptional()
    district?: string;


    @ValidateIf((o) => o.documentType !== '' && o.documentType !== undefined)
    @IsEnum(documentType)
    @ApiProperty({ required: false })
    @IsOptional()
    documentType: documentType;

    // @ApiProperty({required:false, type: 'string', format: 'binary' })
    @ApiProperty({
        required:false,
        type: 'array',
        items: {
            type: 'string',
            format: 'binary',
        },
    })
    @IsOptional()
    @IsArray()
    documents:any[];
}
