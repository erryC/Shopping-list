import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable()
@Pipe({
  name: 'uppercase',
  standalone: true,
})
export class UppercasePipe implements PipeTransform {
  transform(value: string): any {
    if (!value) return value;

    return value.toUpperCase();
  }
}