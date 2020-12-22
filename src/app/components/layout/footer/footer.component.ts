import { Component, OnInit } from '@angular/core';
import { GCT_APP_VERSION } from 'src/app/constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  footerText: string;

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem(GCT_APP_VERSION)) {
      this.footerText = localStorage.getItem(GCT_APP_VERSION);
    }
  }
}
