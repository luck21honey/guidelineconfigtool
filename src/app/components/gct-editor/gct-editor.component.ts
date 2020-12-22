import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NodeMap } from 'src/app/models/dto/node';
import { selectNodeMap } from 'src/app/store/node-store/node.selectors';
import { selectActiveGuideline } from 'src/app/store/guideline-store/guideline.selectors';
import { State } from 'src/app/store/node-store/node.reducer';
import { Guideline } from 'src/app/models/dto/guideline';
import { load } from 'src/app/store/guideline-store/guideline.actions';


@Component({
  selector: 'app-gct-editor',
  templateUrl: './gct-editor.component.html',
  styleUrls: ['./gct-editor.component.scss']
})
export class GCTEditorComponent implements OnInit {
  guidelineType = '';
  guidelineId: number;
  isOpen = true;
  isPreviewMode = false;
  nodeMap$: Observable<NodeMap>;

  constructor(private _router: Router, private route: ActivatedRoute, private store: Store<State>) { }

  ngOnInit(): void {
    this.handleWindowEvent();
    this.route.params.subscribe(params => {
      this.guidelineType = params.guidelineType;
      this.guidelineId = parseInt(params.id, 10);
    }).unsubscribe();
    // Only load guideline if its not the active guideline or we don't have one loaded yet
    let activeGuideline: Guideline;
    this.store.select(selectActiveGuideline).subscribe(guideline => activeGuideline = guideline).unsubscribe();

    if (!activeGuideline || activeGuideline.id !== this.guidelineId) {
      this.store.dispatch(load({ id: this.guidelineId }));
    }

    this.nodeMap$ = this.store.select(selectNodeMap);
  }

  handleWindowEvent(): void {
    window.addEventListener('popstate', (event) => {
      window.parent.postMessage(
        {
          event_id: 'current_route_message',
          route: '/'
        },
        '*' // or "www.parentpage.com"
      );
    });

    window.parent.postMessage(
      {
        event_id: 'current_route_message',
        route: this._router.url
      },
      '*' // or "www.parentpage.com"
    );
  }

  addAppendixHandler(): void {
    console.log('Parent received event to add appendix');
  }

  previewHandler(): void {
    this.isPreviewMode = !this.isPreviewMode;

    if (this.isPreviewMode) {
      this.isOpen = false;
    }
  }

  toggleSidenavHandler(): void {
    this.isOpen = !this.isOpen;
  }
}
