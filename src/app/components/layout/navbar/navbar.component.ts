import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() addAppendix = new EventEmitter();
  @Output() preview = new EventEmitter();
  @Output() toggleSidenav = new EventEmitter();

  @Input() guidelineType: string;

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  navigateToFileManagement() {
    this._router.navigate(['/']);
  }

  addAppendixHandler(): void {
    this.addAppendix.emit();
  }

  previewHandler(): void {
    this.preview.emit();
  }

  toggleSidenavHandler(): void {
    this.toggleSidenav.emit();
  }
}
