import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], args?: any ): any[] {
    if(!items) return [];
    if(!args.terms) return items;
   console.log("args");
   console.log(args);
    let terms = args.terms.toLowerCase();
    console.log('terms',terms);
    console.log('property',args.property);
    return items.filter( it => {
      console.log(it);
      if(it[args.property]!=null)
      {
        return it[args.property].toLowerCase().includes(terms); // only filter country name
      }
      
    });
  }
}
