import { reducer, State } from './node.reducer';
import * as NodeActions from './node.actions';
import { createNodeA, createNodeB, UPDATED_CONTENT, createNodeC } from '../../test-utils/dto-factory';


describe('NodeReducer', () => {
  let state: State;
  const initialState: State = {
    ids: [],
    entities: {},
    activeNode: null,
    isLoading: false,
    errors: [],
    rootNodes: []
  };

  beforeEach(() => {
    // Tear down
    state = reducer(undefined, {} as any);
  });

  it('should have initial state', () => {
    expect(state).toEqual(initialState);
  });

  it('should handle create', () => {
    const node = createNodeA();
    expect(reducer(state, NodeActions.createSucceeded({ node })).ids.length).toEqual(1);
  });

  it('should handle remove', () => {
    // given
    const nodeA = createNodeA();
    const nodeB = createNodeB();
    state = reducer(state, NodeActions.createSucceeded({ node: nodeA }));
    state = reducer(state, NodeActions.createSucceeded({ node: nodeB }));

    // expect
    expect(reducer(state, NodeActions.removeSucceeded({ id: nodeA.id })).ids.length).toEqual(1);
  });

  it('should handle update', () => {
    // given
    const node = createNodeA();
    state = reducer(state, NodeActions.createSucceeded({ node }));
    const updatedNode = {
      ...node,
      content: UPDATED_CONTENT
    };
    state = reducer(state, NodeActions.updateSucceeded({ id: updatedNode.id, changes: updatedNode }));
    expect(state.entities[node.id].content).toEqual(UPDATED_CONTENT);
  });

  it('should handle relationship create', () => {
    // given
    const nodeA = createNodeA();
    const nodeB = createNodeB();
    const nodeC = createNodeC();

    state = reducer(state, NodeActions.createSucceeded({ node: nodeA }));
    state = reducer(state, NodeActions.createSucceeded({ node: nodeB }));
    state = reducer(state, NodeActions.createSucceeded({ node: nodeC }));
    state = reducer(state, NodeActions.createRelationshipSucceeded({ nodes: [nodeA, nodeB ]}));
    state = reducer(state, NodeActions.createRelationshipSucceeded({ nodes: [nodeA, nodeC ]}));

    expect(state.entities[nodeA.id].outgoingNodes.length).toEqual(2);
  });
});
