import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGuideline from './guideline.reducer';

const getGuidelineState = createFeatureSelector<fromGuideline.State>(
  fromGuideline.guidelineFeatureKey
);

export const selectGuidelines = createSelector(
  getGuidelineState,
  state => state.entities
);

export const selectGuidelineIsLoading = createSelector(
  getGuidelineState,
  state => state.isLoading
);

export const selectGuidelineErrors = createSelector(
  getGuidelineState,
  state => state.errors
);

export const selectGuidelineVersions = createSelector(
  getGuidelineState,
  state => state.guidelineVersions
);

export const selectGuidelineTypes = createSelector(
  getGuidelineState,
  state => state.guidelineTypes
);

export const selectGuidelineListData = createSelector(
  getGuidelineState,
  state => state.guidelineListData
);

export const selectAppVersion = createSelector(
  getGuidelineState,
  state => state.appVersion
);

export const selectActiveGuideline = createSelector(
  getGuidelineState,
  state => state.guideline
);

export const { selectAll } = fromGuideline.adapter.getSelectors();

export const selectAllGuidelines = selectAll;

export const selectFeature = (state: fromGuideline.State) => state.entities;

export const selectGuidelineComponentViewModel = createSelector(
  selectGuidelines,
  selectGuidelineIsLoading,
  selectGuidelineErrors,
  (guideline, isLoading, errors) => ({
    guideline,
    isLoading,
    errors
  })
);
