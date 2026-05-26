import { ApiProperty } from "@nestjs/swagger";
import { IsEmail} from "class-validator";

export class generateOtpDTO {
    @IsEmail()
    @ApiProperty()
    email: string
}
