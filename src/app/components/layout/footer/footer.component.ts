import { Input } from '@angular/core';
import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/guideline-store/guideline.reducer';
import { selectAppVersion } from '../../../store/guideline-store/guideline.selectors';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  guidelinesData$: Observable<string>;
  bgClass: string;
  footerText = 'footer';

  constructor(private router: Router, private store: Store<State>) {
    // subscribe to router navigation
    this.router.events.subscribe((event) => {
      // filter `NavigationEnd` events
      if (event instanceof NavigationEnd) {
        // get current route without leading slash `/`
        const eventUrl = /(?<=\/).+/.exec(event.urlAfterRedirects);
        const currentRoute = (eventUrl || []).join('');
        // set bgClass property with the value of the current route
        if (currentRoute === '') {
          this.bgClass = 'home-page-footer';
        } else {
          this.bgClass = 'footer';
        }
      }
    });
  }

  ngOnInit(): void {
    this.guidelinesData$ = this.store.select(selectAppVersion);
    if(localStorage.getItem("appVersion")){
      this.footerText = localStorage.getItem("appVersion");
    }
  }
}
