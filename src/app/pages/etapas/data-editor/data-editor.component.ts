import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-data-editor',
  templateUrl: './data-editor.component.html',
  styleUrls: ['./data-editor.component.scss']
})

export class DataEditorComponent extends DefaultEditor implements OnInit {
  @Input() placeholder: string = 'Choose a Date/Time';

  @Input() min: Date; // Defaults to now(rounded down to the nearest 15 minute mark)

  @Input() max: Date; // Defaults to 1 month after the min

  stringValue;
  inputModel: Date;

  constructor(private datePipe: DatePipe) {
      super();
  }

  ngOnInit() {
      if (!this.min) {
          this.min = new Date();
          this.min.setMinutes(Math.floor(this.min.getMinutes() / 15) * 15);
      }

      if (!this.max) {
          this.max = new Date(this.min);
          this.max.setFullYear(this.min.getFullYear() + 1);
      }

      if (this.cell.newValue) {
          let cellValue = new Date(this.cell.newValue);
          if (cellValue.getTime() >= this.min.getTime() && cellValue.getTime() <= this.max.getTime()) {
              this.inputModel = cellValue;
              this.cell.newValue = this.inputModel.toISOString();
          }
      }

      if (!this.inputModel) {
          this.inputModel = this.min;
          this.cell.newValue = this.inputModel.toISOString();
      }
  }

    onChange() {
        if (this.inputModel) {
            // Use o DatePipe para formatar a data para dd/MM/yyyy
            this.cell.newValue = this.datePipe.transform(this.inputModel, 'dd/MM/yyyy');
        }
    }
}

@Component({
    template: `{{value | date:'dd/MM/yyyy'}} `, // Formatar para dd/MM/yyyy
})

export class DataEditorRenderComponent implements ViewCell {
    @Input() value: string;
    @Input() rowData: any;
  
    constructor() { }
  
  
}
