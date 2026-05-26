import { PartialType } from '@nestjs/mapped-types';
import { CreateInqueryDto } from './create-call_centre.dto';

export class UpdateCallCentreDto extends PartialType(CreateInqueryDto) {}
