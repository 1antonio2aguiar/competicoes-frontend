import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-server-error-messages',
  templateUrl: './server-error-messages.component.html',
  styleUrls: ['./server-error-messages.component.css']
})

export class ServerErrorMessagesComponent {

  // tslint:disable-next-line:no-input-rename
  @Input('server-error-messages') serverErrorMessages: string[] = null;

  constructor() { }

}
