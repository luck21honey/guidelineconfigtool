import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { GuidelineService } from '../../services/guideline.service';
import { GuidelineListService } from '../../services/guideline-list.service';
import { GuidelineVersionService } from '../../services/guideline-version.service';
import * as GuidelineActions from './guideline.actions';
import * as NodeActions from '../node-store/node.actions';
import * as TableItemActions from '../table-item-store/table-item.actions';
import { Guideline } from '../../models/dto/guideline';
import { GuidelineListData } from '../../models/business/guideline-list-data';
import {
  GuidelineCreatePayload,
  GuidelineLoadPayload,
  GuidelineVersionDeletePayload,
  GuidelineLoadSucceededPayload,
} from './guideline.types';
import { NodeMap } from 'src/app/models/dto/node';
import { APIResponse } from 'src/app/models/http';


@Injectable()
export class GuidelineEffects {
  constructor(
    private guidelineService: GuidelineService,
    private guidelineListService: GuidelineListService,
    private guidelineVersionService: GuidelineVersionService,
    private actions$: Actions) { }

  createGuideline$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidelineActions.create),
      switchMap((payload: GuidelineCreatePayload) =>
        this.guidelineService.create(payload.guideline)
          .pipe(
            map((guideline: Guideline) => GuidelineActions.loadAll()),
            catchError((errors: any) => of(GuidelineActions.createFailed({ errors })))
          )
      )
    )
  );

  loadGuideline$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidelineActions.load),
      switchMap((payload: GuidelineLoadPayload) =>
        this.guidelineService.getById(payload.id)
          .pipe(
            map((guideline: Guideline) => GuidelineActions.loadSucceeded({ guideline })),
            catchError((errors: any) => of(GuidelineActions.loadFailed({ errors })))
          )
      )
    )
  );

  loadGuidelineSucceeded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidelineActions.loadSucceeded),
      mergeMap((payload: GuidelineLoadSucceededPayload) => {
        return [
          NodeActions.loadNodeMapSucceeded({ nodeMap: payload.guideline.nodeMap }),
          TableItemActions.loadSucceeded({ tableItems: payload.guideline.tableItems })
        ];
      })
    )
  );

  loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidelineActions.loadAll),
      switchMap(() =>
        this.guidelineListService.loadGuidelineTypes()
          .pipe(
            mergeMap((res: APIResponse) => {
              const version = res.version.replace('(@git.commit.id.abbrev@)', '');
              localStorage.setItem("appVersion", version);
              const guidelineListData = res.object as GuidelineListData[];
              return [
                GuidelineActions.loadGuidelineListDataSucceeded({ guidelineListData }),
                GuidelineActions.retriveAppVersion({data: version})
              ];
            }),
            catchError((errors: any) => of(GuidelineActions.loadFailed({ errors })))
          )
      )
    )
  );


  deleteGuidelineVersion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidelineActions.deleteGuidelineVersion),
      switchMap((payload: GuidelineVersionDeletePayload) =>
        this.guidelineVersionService.delete(payload.guidelineVersionId)
          .pipe(
            map(() => {
              GuidelineActions.deleteGuidelineVersionSucceeded();
              return GuidelineActions.loadAll();
            }),
            catchError((errors: any) => of(GuidelineActions.deleteGuidelineVersionFailed({ errors })))
          )
      )
    )
  );
}
