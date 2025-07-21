import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
    readonly DELIMITER = '/';

    parse(value: string): NgbDateStruct | null {
        if (value) {
            const parts = value.split(this.DELIMITER);
            if (parts.length === 3) {
                return {
                    day: parseInt(parts[0], 10),
                    month: parseInt(parts[1], 10),
                    year: parseInt(parts[2], 10),
                };
            }
        }
        return null;
    }

    format(date: NgbDateStruct | null): string {
        return date
            ? `${this.padNumber(date.day)}${this.DELIMITER}${this.padNumber(date.month)}${this.DELIMITER}${date.year}`
            : '';
    }

    padNumber(number: number): string {
        return number < 10 ? `0${number}` : `${number}`;
    }
}