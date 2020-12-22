import { NodeMap, Node } from '../models/dto/node';

export const createNodeMap1 = (nodes: Node[]): NodeMap => {
  return {
    rootNodes: [1],
    nodes
  };
};

export const createNodeMap2 = (nodes: Node[]): NodeMap => {
  return {
    rootNodes: [1, 2, 3],
    nodes
  };
};

