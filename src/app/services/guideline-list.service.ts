import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResourceBaseService } from './resource-base.service';
import { HttpClient } from '@angular/common/http';
import { BASE_GUIDELINE_URL } from '../constants';
import { APIResponse } from '../models/http/api-response';
import { GuidelineListData } from '../models/business/guideline-list-data';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/guideline-store/guideline.reducer';
import { retriveAppVersion } from '../store/guideline-store/guideline.actions';

@Injectable({
  providedIn: 'root'
})
export class GuidelineListService extends ResourceBaseService<GuidelineListData> {

  constructor(httpClient: HttpClient, private store: Store<State>) {
    super(httpClient, BASE_GUIDELINE_URL);
  }
  // Custom API's for specific entity API's that don't fit ResourceBaseService class
  loadGuidelineTypes(): Observable<APIResponse> {
    return this.httpClient
      .get<APIResponse>(`${this.basePath}/list`);
  }
}
