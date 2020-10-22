import {isDate, ValidationArguments, ValidatorConstraintInterface} from 'class-validator';

export abstract class DateDurationValidator implements ValidatorConstraintInterface {

    public async validate<E>(value: any) {
        let dateStarted = String(Object.values(value)[0]);
        let dateClosed = String(Object.values(value)[1]);

        let dateStartedIsCorrect = Number.isInteger(Date.parse(dateStarted));
        let dateStartedIsClosed = Number.isInteger(Date.parse(dateClosed));

        return Object.keys(value).length == 2 &&
            Object.keys(value).indexOf('started') != -1 &&
            Object.keys(value).indexOf('closed') != -1 &&
            dateStartedIsCorrect &&
            dateStartedIsClosed;
    }

    public defaultMessage(args: ValidationArguments) {
        return `${args.property}: incorrect started or closed date`;
    }
}