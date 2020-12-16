import { Injectable } from '@angular/core';
import { ResourceBaseService } from './resource-base.service';
import { Guideline } from '../models/dto/guideline';
import { HttpClient } from '@angular/common/http';
import { BASE_GUIDELINE_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class GuidelineService extends ResourceBaseService<Guideline> {

  constructor(httpClient: HttpClient) {
    super(httpClient, BASE_GUIDELINE_URL);
  }

  // Custom API's for specific entity API's that don't fit ResourceBaseService class
}
