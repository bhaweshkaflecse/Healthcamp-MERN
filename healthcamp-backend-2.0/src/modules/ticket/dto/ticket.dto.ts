import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateTicketDto {
    // @ApiProperty({ example: 'Issue with login' })
    @IsString()
    title: string;

    // @ApiProperty({ example: 'User cannot login due to incorrect password reset' })
    @IsString()
    description: string;

    // @ApiProperty({ example: true })
    @IsBoolean()
    @IsOptional()
    isOpen?: boolean;
}

export class UpdateTicketDto {
    @ApiProperty({ example: 'Updated Issue with login' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'User still facing login issue' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    isOpen?: boolean;
}

export class AddTicketImageDto {
    @ApiProperty({ example: 'https://example.com/image.jpg' })
    @IsString()
    url: string;

    @ApiProperty({ example: '1b8e2d5e-6d3a-4d89-bb8f-9fd3b5d1c6f4' })
    @IsUUID()
    ticketId: string;
}
