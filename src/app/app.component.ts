import { Component, OnInit, HostListener } from '@angular/core';

//import { AuthService } from './auth/auth.service';
import { environment } from 'src/environments/environment';
import { GCT_API_LOCAL_STORAGE_KEY, GCT_TENANT_LOCAL_STORAGE_KEY } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  isAppConfigured = !environment.production;
  
  // constructor(private _authService: AuthService){
  //   if (environment.production) {
  //     this._authService.doAuth();
  //   }
  // }

  ngOnInit(): void { }

  @HostListener('window:message', ['$event'])
  onMessageRecieved(event: any) {
    if(event.data.event_id === "context_message"){
      if(event.data.api_url && event.data.X_Navify_Tenant){
        localStorage.setItem(GCT_API_LOCAL_STORAGE_KEY, event.data.api_url);
        localStorage.setItem(GCT_TENANT_LOCAL_STORAGE_KEY, event.data.X_Navify_Tenant);
        this.isAppConfigured = true;
      }
    }
  }

}
