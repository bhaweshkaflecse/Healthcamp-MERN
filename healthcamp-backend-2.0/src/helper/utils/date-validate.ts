import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { parse, isAfter, isValid } from 'date-fns';

@ValidatorConstraint({ async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return false;

    const parsedDate = parse(value, 'yyyy-MM-dd', new Date()); // Adjust format as needed
    return isValid(parsedDate) && isAfter(parsedDate, new Date());
  }

  defaultMessage() {
    return 'Booking date must be a valid future date in YYYY-MM-DD format.';
  }
}

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFutureDateConstraint,
    });
  };
}
