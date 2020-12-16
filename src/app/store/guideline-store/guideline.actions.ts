import { createAction, props } from '@ngrx/store';

import { Guideline } from '../../models/dto/guideline';
import { GuidelineActionTypes } from './guideline.types';
import { GuidelineType } from '../../models/dto/guideline-type';
import { GuidelineVersion } from '../../models/dto/guideline-version';
import { GuidelineListData } from '../../models/business/guideline-list-data';

export const create = createAction(
  GuidelineActionTypes.CREATE,
  props<{ guideline: Guideline }>()
);

export const createSucceeded = createAction(
  GuidelineActionTypes.CREATE_SUCCESS,
  props<{ guideline: Guideline }>()
);

export const createFailed = createAction(
  GuidelineActionTypes.CREATE_FAILURE,
  props<{ errors: string | string[] }>()
);

export const load = createAction(
  GuidelineActionTypes.LOAD,
  props<{ id: number }>()
);

export const loadSucceeded = createAction(
  GuidelineActionTypes.LOAD_SUCCESS,
  props<{ guideline: Guideline }>()
);

export const loadFailed = createAction(
  GuidelineActionTypes.LOAD_FAILURE,
  props<{ errors: string | string[] }>()
);

export const loadAll = createAction(
  GuidelineActionTypes.LOAD_ALL
);

export const loadAllSucceeded = createAction(
  GuidelineActionTypes.LOAD_ALL_SUCCESS,
  props<{ entities: Guideline[] }>()
);

export const loadAllFailed = createAction(
  GuidelineActionTypes.LOAD_ALL_FAILURE,
  props<{ errors: string | string[] }>()
);

export const loadAllGuidelineVersions = createAction(
  GuidelineActionTypes.LOAD_ALL_GUIDELINE_VERSIONS,
  props<{ guidelineTypes: GuidelineType[] }>()
);

export const loadGuidelineListDataSucceeded = createAction(
  GuidelineActionTypes.LOAD_ALL_GUIDELINE_DATA_SUCCESS,
  props<{ guidelineListData: GuidelineListData[] }>()
);

export const deleteGuidelineVersion = createAction(
  GuidelineActionTypes.DELETE_GUIDELINE_VERSION,
  props<{ guidelineVersionId: number }>()
);

export const deleteGuidelineVersionSucceeded = createAction(
  GuidelineActionTypes.DELETE_GUIDELINE_VERSION_SUCCESS
);

export const deleteGuidelineVersionFailed = createAction(
  GuidelineActionTypes.DELETE_GUIDELINE_VERSION_FAILURE,
  props<{ errors: string | string[] }>()
);

export const retriveAppVersion = createAction(
  GuidelineActionTypes.RETRIVE_APP_VERSION,
  props<{ data: string }>()
);

