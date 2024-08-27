import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cep'
})
export class CepPipe implements PipeTransform {

  transform(value: string): string {

      if(value != null){
        var temp = value.split("");
        var tempMask = "";
        for (let i = 0; i < temp.length; i++) {
          if(i == 1){//ADD .
            tempMask += temp[i]+'.';
          } else if(i == 4){//ADD -
            tempMask += temp[i]+'-';
          } else{
            tempMask += temp[i];
          }

        }
        return tempMask;
      }

      return '';
  }
}
