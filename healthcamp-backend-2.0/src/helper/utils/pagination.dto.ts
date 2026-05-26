import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class PaginationDto {

    @Type(() => Number)
    @IsNumber()
    page: number=1;

    @Type(() => Number)
    @IsNumber()
    pageSize: number=10;
}