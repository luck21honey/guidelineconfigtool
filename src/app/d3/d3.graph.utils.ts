import { GraphNode } from './models/graph';
import { Node, NodeMap } from '../models/dto/node';

export const mapToGraphNodes = (nodeMap: NodeMap): GraphNode[] => {
  return nodeMap.rootNodes.map((rootNodeId: number) => {
    const rootNode: Node = nodeMap.nodes.filter(
      (node) => node.id === rootNodeId
    )[0];
    const rootGraphNode = mapToGraphNodesRecursive(rootNode, nodeMap);
    return rootGraphNode;
  });
};

const mapToGraphNodesRecursive = (node: Node, nodeMap: NodeMap): GraphNode => {
  const graphNode = new GraphNode(node);
  if (node.outgoingNodes && node.outgoingNodes.length > 0) {
    const childIds = node.outgoingNodes.map(outgoingNode => outgoingNode.childNodeId);
    nodeMap.nodes
      .filter((nodeChild) => childIds.indexOf(nodeChild.id) > -1)
      .map((filteredNode) => {
        const recurseChild = mapToGraphNodesRecursive(filteredNode, nodeMap);
        graphNode.children.push(recurseChild);
        graphNode.x = 50;
        graphNode.y = 70;
        graphNode.width = 212;
        graphNode.height = 67;
        recurseChild.x = 50;
        recurseChild.y = 70;
        recurseChild.width = 212;
        recurseChild.height = 85;
        recurseChild.parent = graphNode;
        recurseChild.isStep = node.outgoingNodes.find(outgoingNode => outgoingNode.childNodeId === filteredNode.id).step;
        return recurseChild;
      });
  }
  return graphNode;
};

export const clearTree = () => {
  const el: Element = document.querySelector('.main_svg_block');
  if (el) {
    el.remove();
    document.querySelector('.main_block').remove();
  }
};

