import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Guideline } from '../../models/dto/guideline';
import { GuidelineType } from '../../models/dto/guideline-type';
import { GuidelineVersion } from '../../models/dto/guideline-version';
import * as GuidelineActions from './guideline.actions';
import { GuidelineListData } from '../../models/business/guideline-list-data';

export interface State extends EntityState<Guideline> {
  guideline: Guideline;
  guidelineTypes: GuidelineType[];
  guidelineVersions: GuidelineVersion[];
  guidelineListData: GuidelineListData[];
  appVersion: string;
  isLoading: boolean;
  errors: string | string[];
}

export const adapter: EntityAdapter<Guideline> = createEntityAdapter<Guideline>();
const initialState: State = {
  ...adapter.getInitialState(),
  guideline: null,
  guidelineTypes: [],
  guidelineVersions: [],
  guidelineListData: [],
  appVersion: null,
  isLoading: false,
  errors: []
};

export const guidelineFeatureKey = 'guideline';

const guidelineReducer = createReducer(
  initialState,
  on(
    GuidelineActions.createSucceeded,
    (state, { guideline }) => {
      state = { ...state, guideline };
      return adapter.addOne(guideline, state);
    }
  ),
  on(
    GuidelineActions.createFailed,
    GuidelineActions.loadFailed,
    GuidelineActions.loadAllFailed,
    GuidelineActions.deleteGuidelineVersionFailed,
    (state, { errors }) => ({ ...state, errors, isLoading: false })
  ),
  on(
    GuidelineActions.load,
    GuidelineActions.loadAll,
    (state) => ({ ...state, isLoading: true })
  ),
  on(
    GuidelineActions.loadSucceeded,
    (state, { guideline }) => ({ ...state, isLoading: false, guideline })
  ),
  on(
    GuidelineActions.loadAllSucceeded,
    (state, { entities }) => {
      state = { ...state, isLoading: false };
      return adapter.setAll(entities, state);
    }
  ),
  on(
    GuidelineActions.loadGuidelineListDataSucceeded,
    (state, { guidelineListData }) => (
      {
        ...state,
        isLoading: false,
        guidelineListData
      }
    )
  ),
  on(
    GuidelineActions.retriveAppVersion,
    (state, { data }) => ({ ...state, isLoading: false, appVersion: data })
  ),
);

export const reducer = (state: State | undefined, action: Action) => guidelineReducer(state, action);
