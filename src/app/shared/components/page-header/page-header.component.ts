import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  @Input('page-title') pageTitle: string;
  @Input('show-button') showButton: boolean = true;
  @Input('button-class') buttonClass: string;
  @Input('button-text') buttonText: string;
  @Input('button-link') buttonLink: string;

  constructor() { }

  ngOnInit() {
    // Apenas um comentário para satisfazer a regra de lint 'no-empty-lifecycle-method'.
  }

}
