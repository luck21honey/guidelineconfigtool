import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';

import { NodeEffects } from './node.effects';
import { NodeService } from 'src/app/services/node.service';
import { createNodeB, createNodeC, createNodeA } from 'src/app/test-utils/dto-factory';
import { NodeRelationship, Node } from 'src/app/models/dto/node';
import {
  createRelationship,
  createRelationshipSucceeded,
  create,
  createSucceeded,
  update,
  updateSucceeded,
  removeRelationship,
  removeRelationshipSucceeded
} from './node.actions';

describe('NodeEffects', () => {
  let actions$: Observable<any>;

  let effects$: NodeEffects;
  let nodeService: jasmine.SpyObj<NodeService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NodeEffects,
        provideMockActions(() => actions$),
        {
          provide: NodeService,
          useValue: {
            createRelationship: jasmine.createSpy(),
            loadByGuidelineId: jasmine.createSpy(),
            update: jasmine.createSpy(),
            create: jasmine.createSpy(),
            delete: jasmine.createSpy(),
            deleteRelationship: jasmine.createSpy(),
          }
        }
      ]
    });

    effects$ = TestBed.inject(NodeEffects);
    nodeService = TestBed.get(NodeService);
  });

  describe('createRelationship', () => {
    it('should create a relationship successfully', () => {
      const parentNode: Node = createNodeB();
      const childNode: Node = createNodeC();
      const relationshipPayload: NodeRelationship = { parentNode, childNode };

      parentNode.outgoingNodes.push(childNode.id);
      const expectedRelationshipPayload = { parentNode, childNode };
      const expectedNodes = [parentNode, childNode];

      const action = createRelationship({ ...relationshipPayload });
      const outcome = createRelationshipSucceeded({ nodes: expectedNodes });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: expectedRelationshipPayload });
      nodeService.createRelationship.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects$.createRelationship$).toBeObservable(expected);
    });

    it('should delete node relationship successfully', () => {
      const parentNode: Node = createNodeA();
      const childNode: Node = createNodeB();
      const relationship: NodeRelationship = { parentNode, childNode };

      const action = removeRelationship({ ...relationship });
      const outcome = removeRelationshipSucceeded({ ...relationship });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: relationship });
      nodeService.deleteRelationship.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects$.deleteRelationship$).toBeObservable(expected);
    });

  });

  describe('creating and editing nodes', () => {
    it('should create node successfully', () => {
      const node: Node = createNodeA();
      const action = create({ node });
      const outcome = createSucceeded({ node });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: node });
      nodeService.create.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects$.createNode$).toBeObservable(expected);
    });

    it('should update node successfully', () => {
      const node: Node = createNodeA();
      const updatedNode: Node = createNodeA();
      updatedNode.content = 'Updated';

      const action = update({ id: node.id, changes: updatedNode });
      const outcome = updateSucceeded({ id: node.id, changes: updatedNode });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: updatedNode });
      nodeService.update.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects$.updateNode$).toBeObservable(expected);
    });
  });
});
