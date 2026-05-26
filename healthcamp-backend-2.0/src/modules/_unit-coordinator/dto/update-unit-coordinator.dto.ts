import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitCoordinatorDto } from './create-unit-coordinator.dto';

export class UpdateUnitCoordinatorDto extends PartialType(CreateUnitCoordinatorDto) {}
