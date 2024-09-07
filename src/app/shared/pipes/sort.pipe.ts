import { Injectable, Pipe, PipeTransform } from '@angular/core';

export type SortOrder = 'asc' | 'desc';

@Injectable()
@Pipe({
  name: 'sort',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform(value: any[], sortOrder: SortOrder | string = 'asc', sortKey?: string, triggerRefresh?: number): any {
    sortOrder = sortOrder && (sortOrder.toLowerCase() as any);

    if (!value || (sortOrder !== 'asc' && sortOrder !== 'desc')) return value;

    let numberArray = [];
    let stringArray = [];
    let boolArray = [];

    if (!sortKey) {
      numberArray = value.filter(item => typeof item === 'number').sort();
      stringArray = value.filter(item => typeof item === 'string').sort();
    } else {
      numberArray = value.filter(item => typeof item[sortKey] === 'number').sort((a, b) => a[sortKey] - b[sortKey]);
      stringArray = value
        .filter(item => typeof item[sortKey] === 'string')
        .sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return -1;
          else if (a[sortKey] > b[sortKey]) return 1;
          else return 0;
        });

      if(typeof value[0][sortKey]){
        boolArray = value
          .sort((a, b) => {
            return a[sortKey] - b[sortKey];
          });
      }
    }
    // console.log(numberArray, "n")
    // console.log(stringArray, "s")
    // console.log(boolArray, "b")
    const sorted = numberArray.concat(stringArray).concat(boolArray);
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }
}