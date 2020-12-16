import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gct-file-management',
  templateUrl: './gct-file-management.component.html',
  styleUrls: ['./gct-file-management.component.scss']
})
export class GCTFileManagementComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void { 
    window.parent.postMessage(
      {
          event_id: 'current_route_message',
          route: this._router.url
      }, 
      "*" //or "www.parentpage.com"
    ); 
  }

  public navigateToGCTEditor(): void  {
    this._router.navigate([{outlets: {GCTElement: 'editor'}}]);
  }


}
