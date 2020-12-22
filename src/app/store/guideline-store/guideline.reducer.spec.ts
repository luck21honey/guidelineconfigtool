import { reducer, State } from './guideline.reducer';
import * as GuidelineActions from './guideline.actions';
import { createGuidelineA, createGuidelineB } from '../../test-utils/dto-factory';


describe('GuidelineReducer', () => {
  let state: State;
  const initialState: State = {
    ids: [],
    entities: {},
    guideline: null,
    isLoading: false,
    errors: [],
    guidelineListData: [],
    guidelineTypes: [],
    guidelineVersions: []
  };

  beforeEach(() => {
    // Tear down
    state = reducer(undefined, {} as any);
  });

  it('should have initial state', () => {
    expect(state).toEqual(initialState);
  });

  it('should handle create', () => {
    // given
    const guideline = createGuidelineA();
    state = reducer(state, GuidelineActions.createSucceeded({ guideline }));

    // expect
    expect(state.ids.length).toEqual(1);
    expect(state.guideline).toEqual(guideline);
  });

  it('should load', () => {
    // given
    const guidelineA = createGuidelineA();
    const guidelineB = createGuidelineB();
    state = reducer(state, GuidelineActions.createSucceeded({ guideline: guidelineA }));
    state = reducer(state, GuidelineActions.createSucceeded({ guideline: guidelineB }));
    state = reducer(state, GuidelineActions.loadSucceeded({ guideline: guidelineA }));

    // expect
    expect(state.guideline).toEqual(guidelineA);
  });
});
