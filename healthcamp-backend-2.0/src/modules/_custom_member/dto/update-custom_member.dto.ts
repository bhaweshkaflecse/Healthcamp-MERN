import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomMemberDto } from './create-custom_member.dto';

export class UpdateCustomMemberDto extends PartialType(CreateCustomMemberDto) {}
