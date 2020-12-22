import * as d3 from './d3.graph.utils';
import { createNodeMap1, createNodeMap2 } from '../test-utils/d3-factory';
import { createNodeA, createNodeB, createNodeC } from '../test-utils/dto-factory';
import { GraphNode } from './models/graph';

describe('D3 Service', () => {
  it('should create root with two children', () => {
    // given
    const nodes = [createNodeA(), createNodeB(), createNodeC()];
    const nodeMap = createNodeMap1(nodes);

    const expected = new GraphNode(createNodeA());
    expected.children.push(new GraphNode(createNodeB()), new GraphNode(createNodeC()));

    // act
    const actual: GraphNode[] = d3.mapToGraphNodes(nodeMap);

    // assert
    expect(actual).toEqual([expected]);

  });

  it('should create two roots with children', () => {
    // given
    const nodes = [createNodeA(), createNodeB(), createNodeC()];
    const nodeMap = createNodeMap2(nodes);

    const expected = new GraphNode(createNodeA());
    const expected2 = new GraphNode(createNodeB());
    const leafNode = new GraphNode(createNodeC());
    expected.children.push(expected2, leafNode);

    // act
    const actual: GraphNode[] = d3.mapToGraphNodes(nodeMap);

    // assert
    expect(actual).toEqual([expected, expected2]);

  });
});
