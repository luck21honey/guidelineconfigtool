import { style } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { State } from 'src/app/store/node-store/node.reducer';
import { Node, NodeMap } from '../../models/dto/node';
import * as d3 from 'd3';
import * as Utils from 'src/app/d3/d3.graph.utils';
import { GraphNode } from 'src/app/d3/models/graph';
import { createNodeMap1 } from 'src/app/test-utils/d3-factory';
import { DELETE_GUIDELINE_CONFIRMATION, confirmationDialogConfig } from 'src/app/constants';
import { AlertType } from 'src/app/models/enums/alert-type';
import { ConfirmationDialogComponent, DialogData } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  createNodeA,
  createNodeB,
  createNodeC,
  createNodeD,
} from 'src/app/test-utils/dto-factory';
import {
  create,
  createRelationship,
  remove
} from 'src/app/store/node-store/node.actions';

let pressedBlock = '';
let showFreeFormIcon = true;
let sourceNodeContext: Node;
let destNodeContext: Node;

const testData: NodeMap = createNodeMap1([
  createNodeA(),
  createNodeB(),
  createNodeC(),
  createNodeD(),
]);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit, OnChanges {
  @Input() guidelineId: number;
  @Input() nodeMap: NodeMap;
  showEditor = false;
  currentNode: Node;
  gNode: GraphNode;
  top = 0;
  left = 0;

  @ViewChild('svg') svgRef: ElementRef<SVGElement>;

  constructor(public renderer: Renderer2, private store: Store<State>, public dialog: MatDialog) {}

  ngAfterViewInit(): void {
    if (this.nodeMap && this.nodeMap.rootNodes.length !== 0) {
      this.renderTree();
    }
    // this.renderTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.nodeMap.previousValue &&
      changes.nodeMap.previousValue.nodes !== changes.nodeMap.currentValue.nodes
    ) {
      Utils.clearTree();
      this.renderTree();
    }
    const sidenavEl = document.querySelector('mat-sidenav-content');
    if (sidenavEl) {
      sidenavEl.scrollLeft = this.left;
      sidenavEl.scrollTop = this.top;
    }
  }

  renderTree(): void {
    const rootGraphNodes: GraphNode[] = Utils.mapToGraphNodes(this.nodeMap);
    // const rootGraphNodes: GraphNode[] = Utils.mapToGraphNodes(testData);
    const clonedNodeMap = cloneDeep(this.nodeMap);

    const rootNode = this.createVirtualRoot(
      this.createVirtualNode(),
      this.createAddParentNode(),
      rootGraphNodes
    );

    this.createGraphNode(
      this.svgRef,
      rootGraphNodes,
      rootNode,
      clonedNodeMap
       // testData
    );
  }

  createVirtualNode(): Node {
    return {
      id: 0,
      parentId: 0,
      version: 0,
      content: 'Parent',
      outgoingNodeIds: [],
      footnotes: null,
      section: null,
      index: 0,
      guidelineId: null,
    };
  }

  createAddParentNode(): Node {
    return {
      id: null,
      parentId: -1,
      version: null,
      content: 'New TextBox',
      outgoingNodeIds: [],
      footnotes: null,
      section: null,
      index: 0,
      guidelineId: this.guidelineId,
    };
  }

  createNewNode(root = false): Node {
    return {
      id: null,
      parentId: -1,
      version: null,
      content: 'New Textbox',
      outgoingNodeIds: [],
      footnotes: null,
      section: null,
      index: 0,
      guidelineId: this.guidelineId,
      root,
    };
  }

  // An invisible top level parent node for multiple parent roots
  createVirtualRoot(
    node: Node,
    childNode: Node,
    realNodes: GraphNode[]
  ): GraphNode {
    const graphNode = new GraphNode(node);
    graphNode.setIsRoot();
    const childrenNode = new GraphNode(childNode);
    childrenNode.setIsAddParent();

    graphNode.x = 0; // Fix for spacing between nodes
    graphNode.y = 57; // this is the root - Fix for icons placement
    graphNode.width = 212;
    graphNode.height = 67;

    childrenNode.width = 212;
    childrenNode.height = 20;
    childrenNode.setParent(graphNode);

    realNodes.forEach((realNode) => {
      realNode.setIsRoot();
      graphNode.children.push(realNode);
    });
    graphNode.children.push(childrenNode);
    return graphNode;
  }

  createGraphNode(
    svgRef: ElementRef<SVGElement>,
    node: GraphNode[],
    gNode: GraphNode,
    nodeMap: NodeMap
  ): void {
    // if (gNode.children.length > 2) {
    //   showFreeFormIcon = true;
    // }
    this.gNode = gNode;
    const totHeight = 0;

    let count = 1;
    // const lineX1 = 180;
    // const lineX2 = 180;
    const lineX1 = 110; // fix for spacing between nodes.
    const lineX2 = 110; // fix for spacing between nodes.
    const lineY1 = 0;
    const lineY2 = 47; // graph node - Fix for icon placement

    const posX = gNode.x;
    const posY = gNode.y;

    // Preparing the canvas for the d3 drawing
    const mainGrp = this.renderMainGroupForRootNode(svgRef, gNode);

    // attaching text box to the canvas
    const isChild = false;
    const textBox = this.attachTextBox(
      mainGrp.g,
      0,
      // 60,
      40, // fix for spacing between nodes.
      80,
      200,
      64,
      gNode,
      false,
      undefined
    );

    // Append the pencil icon
    const editImg = this.appendEditImg(mainGrp.g, null);

    // Append the down arrow
    const downArrowImg = this.appendDownArrowImg(mainGrp.g, null);

    // Append the green check icon
    this.appendGreenCheckImg(mainGrp.g, null);

    // hover on the down arrow, click on Edit Icon, height adjustment, placement of downarrow
    this.commonActionsOnAnyNode(
      mainGrp,
      downArrowImg,
      editImg,
      null,
      textBox,
      isChild,
      gNode,
      false,
      null,
      null,
      0,
      0,
      0,
      0,
      0,
      0,
      this
    );

    gNode.node = mainGrp.block;

    // draw the tree based on the data coming from backend
    this.drawTreeWithData(
      gNode,
      mainGrp,
      node,
      nodeMap,
      posX,
      posY,
      count,
      lineX1,
      lineX2,
      lineY1,
      lineY2
    );
  }

  drawChildGraphNodes(
    svgRef: ElementRef<SVGElement>,
    node: GraphNode[],
    gNode: GraphNode,
    parentId: any,
    nodeMap: NodeMap,
    posX: any,
    posY: any,
    id: string,
    lineX1: any,
    lineY1: any,
    lineX2: any,
    lineY2: any,
    parent: GraphNode,
    blockContent?: any,
    seeIcons?: boolean
  ): void {
    const isChild = true;
    const isStepChild = this.isStepChild(gNode, nodeMap.stepRelationships);

    // Description: Calculate width of html element - dynamic width fix
    let originWidth = 212;

    if (gNode && gNode.content) {
      let temp = document.createElement('div');
      temp.style.position = 'absolute';
      temp.innerHTML = gNode.content;
      document.body.appendChild(temp);
      originWidth = temp.clientWidth;
      document.body.removeChild(temp);
    }

    // Get widths for svg, rectangle, text
    let svgWidth;
    let retangleWidth;
    let textWidth;
    if (originWidth <= 212) {
      svgWidth = 230;
      retangleWidth = 212;
      textWidth = 200;
      originWidth = 212;
    } else if (originWidth > 212 && originWidth < 512) {
      svgWidth = originWidth + 17;
      retangleWidth = originWidth;
      textWidth = originWidth - 12;
    } else {
      svgWidth = 530;
      retangleWidth = 512;
      textWidth = 500;
      originWidth = 512;
    }

    // var retangleWidth = 212;

    // A limit of 15 child nodes per parent node
    if (parseInt(id.replace('child', ''), 10) <= 15) {
      const content = 'New textbox';
      let childId = 0;
      nodeMap.nodes.forEach((element) => {
        if (element.id > childId) {
          childId = element.id;
        }
      });

      const newChild: Node = {
        id: childId + 1,
        parentId: parentId,
        version: 0,
        content: blockContent ? blockContent : content,
        outgoingNodeIds: [],
        footnotes: null,
        section: null,
        index: 0,
        guidelineId: this.guidelineId,
      };

      // prepare the canvas for drawing child nodes
      const mainChildGrp = this.renderMainGroupForChildNodes(
        svgRef,
        id,
        parentId,
        blockContent,
        svgWidth
      );

      // Append rectangle nodes
      mainChildGrp.svgContainer = this.appendRect(
        mainChildGrp.svgContainer,
        // posX + 20,
        posX, // Fix for spacing between nodes
        posY + 20, // added this to move the child - delete icon placement.
        retangleWidth,
        85,
        null,
        true,
        gNode && gNode.isAddParent,
        isStepChild
      );

      // attach text box
      const textBox = this.attachTextBox(
        mainChildGrp.svgContainer,
        id,
        // posX + 30,
        posX + 10, // Fix for spacing between nodes
        posY + 30,
        textWidth,
        64,
        gNode,
        isChild,
        blockContent,
        isStepChild
      );

      let editImg, downArrowImg, freeFormImg;
      if (seeIcons === undefined && !isStepChild) {
        editImg = this.appendEditImg(
          null,
          mainChildGrp.svgContainer,
          true,
          posX,
          posY,
          svgWidth - 45
        );

        downArrowImg = this.appendDownArrowImg(
          null,
          mainChildGrp.svgContainer,
          true,
          posX,
          posY,
          (svgWidth - 50) / 2
        );

        freeFormImg = this.appendFreeFormImg(
          null,
          mainChildGrp.svgContainer,
          true,
          posX,
          posY,
          (svgWidth - 50) / 2 + 50
        );
      }

      const defs = mainChildGrp.svgContainer.append('defs');

      // draw link arrows
      this.appendLinks(
        mainChildGrp.svgContainer,
        defs,
        lineX1,
        lineX2,
        lineY1,
        lineY2,
        mainChildGrp.lineBlock,
        parentId,
        id,
        this,
        gNode
      );

      // append green check image
      // Description: x = originWidth - 15 - Fix for dynamic width fix
      if (!(gNode && gNode.isAddParent) && parentId === 0) {
        this.appendGreenCheckImg(
          mainChildGrp.svgContainer,
          null,
          originWidth - 15
        );
      }

      let count = 1;
      if (gNode == null || !gNode.isAddParent) {
        if (seeIcons === undefined && !isStepChild) {
          // hover on the down arrow, click on Edit Icon, height adjustment, placement of downarrow
          this.commonActionsOnAnyNode(
            mainChildGrp,
            downArrowImg,
            editImg,
            freeFormImg,
            textBox,
            isChild,
            gNode,
            showFreeFormIcon,
            mainChildGrp.block,
            node,
            posX,
            posY,
            lineX1,
            lineY1,
            lineX2,
            lineY2,
            this
          );
        }
      } else {
        this.activateGreyedOutNode(mainChildGrp, gNode, showFreeFormIcon);
      }

      // Height adjustmnet of the rect based on the content coming from backend
      const foHeight = textBox.text._groups[0][0].getBoundingClientRect()
        .height;
      this.adjustHeight(foHeight, textBox.text);

      // For drawing grandchildren
      if (gNode != null) {
        if (!isStepChild) {
          this.drawTreeWithData(
            gNode,
            mainChildGrp,
            node,
            nodeMap,
            posX,
            posY,
            count,
            lineX1,
            lineX2,
            lineY1,
            lineY2
          );
        }
      }
    }
  }

  createRelationship(gNode: GraphNode): void {
    const parentNode = this.mapFromGraphNode(gNode);
    const childNode = this.createNewNode();
    const isStep = false;

    this.store.dispatch(createRelationship({ parentNode, childNode }));
  }

  createStepChildRelationship(
    sourceGNode: GraphNode,
    destGnode: GraphNode
  ): void {
    const parentNode = this.mapFromGraphNode(sourceGNode);
    const childNode = this.mapFromGraphNode(destGnode);
    const isStep = true;

    this.store.dispatch(createRelationship({ parentNode, childNode, isStep }));
  }

  toggleTextEditor(): void {
    this.showEditor = !this.showEditor;
  }

  updatedText(event): void {
    this.showEditor = false;
  }

  mapFromGraphNode(gNode: GraphNode): Node {
    return this.nodeMap.nodes.find((node) => node.id === gNode.id);
  }

  commonActionsOnAnyNode(
    mainGrp: any,
    downArrowImg: any,
    editImg: any,
    freeFormImg: any,
    textBox: any,
    isChild: any,
    gNode: any,
    showFreeFormIcon: boolean,
    block: any,
    node: any,
    posX: any,
    posY: any,
    lineX1: any,
    lineY1: any,
    lineX2: any,
    lineY2: any,
    thisRef: any
  ) {
    this.downArrowHoverActions(
      isChild ? mainGrp.svgContainer : mainGrp.g,
      downArrowImg,
      freeFormImg,
      showFreeFormIcon
    );
    this.clickActions(
      downArrowImg,
      editImg,
      freeFormImg,
      gNode,
      isChild,
      block,
      textBox,
      node,
      this.nodeMap,
      posX,
      posY,
      lineX1,
      lineY1,
      lineX2,
      lineY2,
      thisRef
    );
    // Height adjustmnet of the rect based on the content saved in the text editor
    const foHeight = textBox.text._groups[0][0].getBoundingClientRect().height;
    this.adjustHeight(foHeight, textBox.text);
    downArrowImg.attr('y', foHeight + 105);   // added 20 to place the icon over the border of the rectangle => delete icon placement
    if (freeFormImg !== null) {
      freeFormImg.attr('y', foHeight + 105); // added 20 to place the icon over the border of the rectangle => delete icon placement
    }
  }

  renderMainGroupForRootNode(
    svgRef: ElementRef<SVGElement>,
    gNode: GraphNode
  ): any {
    const totHeight = 0;
    const block = d3
      .select(svgRef.nativeElement)
      .append('div')
      .attr('class', 'main_svg_block')
      .style('display', 'none');

    const main = d3
      .select(svgRef.nativeElement)
      .append('div')
      .attr('class', 'main_block')
      .style('padding-left', '20px'); // Fix for spacing between nodes

    const svgContainer = block
      .append('svg')
      .attr('width', 2000)
      .attr('height', 500);

    let g = svgContainer
      .append('g')
      .attr('transform', 'translate(20,' + totHeight + ')');

    g = this.appendRect(
      null,
      gNode.x,
      gNode.y,
      gNode.width,
      gNode.height,
      g,
      false,
      false
    );
    return { g, main, block, svgContainer };
  }

  // Description: I added fifth parameter for set width of svg for the dynamic width fix
  renderMainGroupForChildNodes(
    svgRef: ElementRef<SVGElement>,
    id: any,
    parentId: any,
    blockContent?: any,
    svgWidth?: number
  ): any {
    let block;
    if (svgRef.nativeElement === undefined) {
      if (svgRef['_groups'] !== undefined) {
        block = d3.select(svgRef['_groups'][0][0]).append('div');

        if (blockContent !== undefined) {
          block.attr(
            'class',
            'parentID_' + parentId + ' ' + id + ' child_block blue_block'
          );
        } else {
          block.attr('class', 'parentID_' + parent + ' ' + id + ' child_block');
        }
      } else {
        block = d3.select(svgRef).append('div');

        if (blockContent !== undefined) {
          block.attr(
            'class',
            'parentID_' + parentId + ' ' + id + ' child_block blue_block'
          );
        } else {
          block.attr(
            'class',
            'parentID_' + parentId + ' ' + id + ' child_block'
          );
        }
      }
    } else {
      block = d3.select(svgRef.nativeElement).append('div').attr('class', id);
    }
    let parentNodesLength = block._groups[0][0].parentNode.childNodes.length;
    if (parentNodesLength !== 0) {
      let cl = block._groups[0][0].parentNode.childNodes[
        parentNodesLength - 1
      ].classList[1].replace('child', '');
      if (parseInt(cl) !== parentNodesLength) {
        id = 'child' + parentNodesLength;
        block
          .attr(
            'class',
            'parentID_' +
              parentId +
              ' ' +
              'child' +
              parentNodesLength +
              ' child_block'
          )
          .attr('id', 'tree' + parentNodesLength);
      }
    }

    const svgContainer = block
      .append('div')
      // .attr('style', 'height: 155px') //Fix for icon placement
      .append('svg')
      .attr('id', id)
      // .attr('width', 300)
      .attr('width', svgWidth) // Fix for spacing between nodes
      .attr('height', 160)
      .append('g');

    const lineBlock = block
      .append('div')
      .attr('class', 'lineBlock' + id.replace('child', ''))
      .attr(
        'style',
        // 'position:absolute; width: 100%; height: 5px; top: 34px; left: 180px; border-top: 1px solid black; opacity: 0.12; display: none'
        // Fix for spacing between nodes
        'position:absolute; width: 100%; height: 5px; top: 34px; left: 110px; border-top: 1px solid black; opacity: 0.12; display: none'
      );
    const main = block.append('div').attr('class', 'main_block');
    return { block, svgContainer, lineBlock, main };
  }

  adjustHeight(foHeight: any, text: any): void {
    // Dynamic adjustment of height based on the height of the html content
    if (foHeight < 24) {
      foHeight = 24;
    }
    text._groups[0][0].parentNode.style.height = foHeight + 'px';
    text._groups[0][0].parentNode.parentNode.setAttribute('height', foHeight);
    text._groups[0][0].parentNode.parentNode.parentNode
      .querySelector('rect')
      .setAttribute('height', foHeight + 40);
    text._groups[0][0].parentNode.parentNode.parentNode.parentNode.setAttribute(
      'height',
      foHeight + 130  // this also changed by adding 20 =>delete icon placement
    );
    text._groups[0][0].parentNode.parentNode.parentNode.parentNode.parentNode.style.height =
      foHeight + 117 + 'px'; // Changed: Div was moved down 20px to avoid overlapping.
                             // Change svg if you want to get something different!
  }

  editElContentInJSON(nodeMap: NodeMap, id: any, content: any): void {
    nodeMap.nodes.forEach((element) => {
      if (element.id === id) {
        element.content = content;
      }
    });
  }

  drawTreeWithData(
    gNode: GraphNode,
    mainGrp: any,
    node: GraphNode[],
    nodeMap: NodeMap,
    posX: any,
    posY: any,
    count: any,
    lineX1: any,
    lineX2: any,
    lineY1: any,
    lineY2: any
  ): void {
    if (gNode.children.length !== 0) {
      for (const child of gNode.children) {
        this.drawChildGraphNodes(
          mainGrp.main,
          node,
          child,
          gNode.id,
          nodeMap,
          posX,
          posY,
          'child' + count,
          lineX1,
          lineY1,
          lineX2,
          lineY2,
          null
        );
        count++;
      }
    }
  }

  clickActions(
    downArrowImg: any,
    editImg: any,
    freeFormImg: any,
    gNode: GraphNode,
    isChild: boolean,
    block: any,
    textBox: any,
    node: any,
    nodeMap: any,
    posX: any,
    posY: any,
    lineX1: any,
    lineY1: any,
    lineX2: any,
    lineY2: any,
    thisRef: any
  ) {
    // Logic for clicking on the down arrow
    downArrowImg.on('click', () => {
      console.log('hi',);
      this.createRelationship(gNode);
      this.left = document.querySelector('mat-sidenav-content').scrollLeft;
      this.top = document.querySelector('mat-sidenav-content').scrollTop;
    });

    // Logic for clicking on the edit  button
    editImg.on('click', () => {
      this.currentNode = isChild
        ? this.nodeMap.nodes.find((n) => n.id === gNode.id)
        : this.mapFromGraphNode(gNode);
      this.left = document.querySelector('mat-sidenav-content').scrollLeft;
      this.top = document.querySelector('mat-sidenav-content').scrollTop;
      this.toggleTextEditor();
    });

    // Logic for clicking on the freeFormImg  button - click on the source
    if (freeFormImg !== null) {
      this.freeFormImgClickAction(freeFormImg, block, gNode, nodeMap);
    }

    this.textClickAction(
      textBox,
      node,
      nodeMap,
      posX,
      posY,
      lineX1,
      lineY1,
      lineX2,
      lineY2,
      thisRef
    );
  }

  downArrowHoverActions(
    g: any,
    downArrowImg: any,
    freeFormImg: any,
    showFreeFormIcon: boolean
  ) {
    g.style('pointer-events', 'all'); // Changed: G element should listen all mouse events
    g.on('mouseover', function () {
       // added this to check whether the line node exists - delete icon
      if (d3.select(this).select('line')._groups[0][0]) {
        // added this to get the id of the line node to apply to the image - delete icon
        let lid = d3.select(this).select('line').attr('id');
        d3.select(this)
          .select('[id="' + 'i_' + lid.split('_')[1] + '"]')
          .style('opacity', '1'); // showing the icon when mouseover based on the line id the image id is selected - delete icon
      }
      downArrowImg.style('display', 'block');
      if (showFreeFormIcon) {
        freeFormImg.style('display', 'block');
      }
      d3.select(this).select('rect').style('fill', '#fff');
    }).on('mouseleave', function () {
      // added this to check whether the line node exists - delete icon
      if (d3.select(this).select('line')._groups[0][0]) {
        // added this to get the id of the line node to apply to the image - delete icon
        let lid = d3.select(this).select('line').attr('id');
        d3.select(this)
          .select('[id="' + 'i_' + lid.split('_')[1] + '"]')
          .style('opacity', '0'); // hiding the icon when mouseover based on the line id the image id is selected - delete icon
      }
      downArrowImg.style('display', 'none');
      if (showFreeFormIcon) {
        freeFormImg.style('display', 'none');
      }
      d3.select(this).select('rect').style('fill', 'none');
    });
  }

  textClickAction(
    text: any,
    node: any,
    nodeMap: any,
    posX: any,
    posY: any,
    lineX1: any,
    lineY1: any,
    lineX2: any,
    lineY2: any,
    thisRef: any
  ) {
    text.text.on('click', function (e) {
      document.querySelector<HTMLBaseElement>('.tooltop').style.display =
        'none';
      document.querySelector<HTMLBaseElement>('.graph-block').style.cursor =
        'default';
      if (pressedBlock !== null) {
        text.gNode.children = null;
        destNodeContext = text.gNode;
        console.log('source node context -> ', sourceNodeContext);
        console.log('dest node context ->', destNodeContext);
        thisRef.createStepChildRelationship(sourceNodeContext, destNodeContext);
      }
    });
  }

  // Fix for spacing between nodes
  freeFormImgClickAction(
    freeFormImg: any,
    block: any,
    gNode: any,
    nodeMap: any
  ) {
    freeFormImg.on('click', function (e) {
      sourceNodeContext = gNode;
      pressedBlock = block;
      var scrollParent = document.getElementsByTagName(
        'mat-sidenav-content'
      )[0];

      document.querySelector<HTMLBaseElement>('.tooltop').style.display =
        'block';
      document.querySelector<HTMLBaseElement>('.tooltop').style.top =
        e.pageY - 30 + scrollParent.scrollTop + 'px';
      document.querySelector<HTMLBaseElement>('.tooltop').style.left =
        e.pageX - 30 + scrollParent.scrollLeft + 'px';
      document.querySelector<HTMLBaseElement>('.graph-block').style.cursor =
        'pointer';

      let parent = document.querySelector<HTMLBaseElement>('.graph-block');
      parent.onmouseover = parent.onmouseout = parent.onmousemove = handler;

      function handler(event) {
        if (pressedBlock !== null) {
          let X = event.pageX;
          let Y = event.pageY;
          let top = Y - 30;
          let left = X - 30;

          var scrollParent = document.getElementsByTagName(
            'mat-sidenav-content'
          )[0];
          document.querySelector<HTMLBaseElement>('.tooltop').style.top =
            top + scrollParent.scrollTop + 'px';
          document.querySelector<HTMLBaseElement>('.tooltop').style.left =
            left + scrollParent.scrollLeft + 'px';
          return false;
        }
      }
    });
  }

  appendLinks(
    svgContainer: any,
    defs: any,
    lineX1: any,
    lineX2: any,
    lineY1: any,
    lineY2: any,
    lineBlock: any,
    parentId: any,
    id: any,
    thisRef?: any,
    gNode? : any
  ): void {
    const marker = defs
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', '10')
      .attr('markerHeight', '7')
      .attr('refX', '0')
      .attr('refY', '3.5')
      .attr('orient', 'auto');

    marker.append('polygon').attr('points', '0 0, 10 3.5, 0 7');

    if (parentId !== 0) {
      let idgen = Math.random();
      const line = svgContainer
        .append('line')
        .attr('x1', lineX1)
        .attr('x2', lineX2)
        .attr('y2', lineY2 + 20) // added this to move the line for delete icon placement
        .attr('style', 'fill:none')
        .attr('stroke', 'black')
        .attr('stroke-width', '1')
        .attr('opacity', 0.12)
        .attr("id","l_"+idgen)   // ID is not added =>delete icon placement
        .attr('marker-end', 'url(#arrowhead)');

      if (id === 'child1') {
        line.attr('y1', lineY1); // Changed: Line should start from zero point.
        let y = lineY1 + 20 + (lineY2 + 20 - (lineY1 + 25)) / 2;
        svgContainer
          .append('svg:image')
          .attr('class', 'nodeDelete')
          .attr("rel","delete")
          .attr('x', lineX1 - 10) // added to adjust x axis
          .attr('y', y) // added the y variable
          .attr('width', '20') // width of the icon
          .attr('height', '20') // height of the icon
          .attr(
            'xlink:href',
            './assets/system-icon-outlined-icons-edit-icon-remove.svg'
          )
          .attr('id', 'i_' + idgen) // added id to refer the same for hide or show
          .style('cursor', 'pointer')
          .style('opacity', 0) // initial state is hidden
          .on('click',function(){    //click event a is the 
            console.log('clicked',gNode.id);
            thisRef.openDeleteDialog(gNode.id);
          });
      } else {
        line.attr('y1', lineY1 + 35); // added 20 to this  to move the child
        let y = lineY1 + 20 + (lineY2 + 20 - (lineY1 + 25)) / 2; // find the center of the line
        svgContainer
          .append('svg:image')
          .attr('class', 'nodeDelete')
          .attr('x', lineX1 - 10) // added to adjust x axis
          .attr('y', y) // added the y variable
          .attr("rel","delete")
          .attr('width', '20') // width of the icon
          .attr('height', '20') // height of the icon
          .attr('id', 'i_' + idgen) // added id to refer the same for hide or show
          .attr(
            'xlink:href',
            './assets/system-icon-outlined-icons-edit-icon-remove.svg'
          )
          .style('cursor', 'pointer')
          .style('opacity', 0) // initial state is hidden
          .on('click',function(){    //click event a is the 
            console.log('clicked',gNode.id);
            thisRef.openDeleteDialog(gNode.id);
          });
        const c = parseInt(id.replace('child', ''), 10);
        lineBlock._groups[0][0].parentNode.parentNode.childNodes[
          c - 2
        ].querySelector('.lineBlock' + (c - 1)).style.display = 'block';
      }
    }
  }

  attachTextBox(
    g: any,
    id: any,
    x: number,
    y: number,
    width: any,
    height: any,
    gNode: GraphNode,
    isChild: boolean,
    block_content: any,
    isStepChild?: boolean
  ): any {
    const text = g
      .append('foreignObject')
      .attr('width', width)
      .attr('height', height)
      .attr('x', x)
      .attr('y', y)
      .attr('id', isChild ? 'textBox' + id.replace('child', '') : 'textBox')
      .attr(
        'style',
        isChild ? 'overflow: auto' : 'overflow: auto; height: 64px'
      )
      .append('xhtml:body')
      .append('div')
      .style('margin', '0px')
      .style('color', isStepChild ? '#0066CC' : 'black')
      .style('width', width - 30 + 'px')
      .style('word-break', 'keep-all');
    // .html(content);

    if (block_content !== undefined) {
      text.html(block_content);
    } else {
      if (gNode !== null) {
        text.html(gNode.content);
      } else {
        text.html('<span>' + 'New textbox' + '</span>');
      }
    }
    return { text, gNode };
  }

  appendRect(
    svgContainer: any,
    posX: any,
    posY: any,
    width: any,
    height: any,
    g: any,
    isChild: boolean,
    isAddParent: boolean,
    isStepChild?: boolean
  ): any {
    if (!isChild) {
      g.append('rect')
        .attr('x', posX)
        .attr('y', posY)
        .attr('width', width)
        .attr('height', height)
        .attr('style', 'fill:#fff')
        .attr('opacity', 0.12)
        .attr('stroke', 'black')
        .attr('stroke-width', '1')
        .style('stroke-dasharray', isAddParent ? '10 10' : '');
      return g;
    }
    svgContainer
      .append('rect')
      .attr('x', posX)
      .attr('y', posY)
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'fill:#fff')
      .attr('stroke', isStepChild ? '#0066CC' : 'black')
      .attr('opacity', isStepChild ? 0.65 : 0.12)
      .attr('stroke-width', '1')
      .style('stroke-dasharray', isAddParent ? '10 10' : '');

    return svgContainer;
  }

  // Description: I added sixth parameter for set icon position by offset after the dynamic width changes
  appendEditImg(
    g: any,
    svgContainer: any,
    isChild = false,
    posX = 235,
    posY = 75,
    offset = 180,
    width = 24,
    height = 24
  ): any {
    let editImg: any;
    if (!isChild) {
      editImg = g
        .append('svg:image')
        .attr('class', 'textEdit')
        .attr('x', posX)
        .attr('y', posY + 20) // added this to move the text edit image - delete icon placement
        .attr('width', width)
        .attr('height', height)
        .attr('xlink:href', './assets/edit-24-px.svg')
        .style('cursor', 'pointer');
      return editImg;
    }
    editImg = svgContainer
      .append('svg:image')
      .attr('class', 'textEdit')
      // .attr('x', posX + 205)
      // .attr('y', posY)
      .attr('x', posX + offset) // Fix for spacing between nodes
      // .attr('y', posY + 10) // Fix for spacing between nodes
      .attr('y', posY + 30) // delete icon placement
      .attr('width', 24)
      .attr('height', 24)
      .attr('xlink:href', './assets/edit-24-px.svg')
      .style('cursor', 'pointer');
    return editImg;
  }

  // Date: 2020-11-29
  // Description: I added sixth parameter for set icon position by offset
  appendDownArrowImg(
    g: any,
    svgContainer: any,
    isChild = false,
    //posX = 150,
    posX = 120, // Fix for spacing between nodes
    posY = 75,
    offset = 97,
    width = 24,
    height = 24
  ): any {
    let downArrowImg: any;
    if (!isChild) {
      downArrowImg = g
        .append('svg:image')
        .attr('class', 'textEdit')
        // .attr('x', 150)
        .attr('x', 120) // Fix for spacing between nodes
        .attr('y',75)
        .attr('width', 24)
        .attr('height', 24)
        .style('display', 'none')
        .attr('xlink:href', './assets/arrow_circle_down-24px.svg')
        .style('cursor', 'pointer');
      return downArrowImg;
    }
    downArrowImg = svgContainer
      .append('svg:image')
      .attr('class', 'textEdit')
      // .attr('x', posX + 120)
      .attr('x', posX + offset) // Fix for spacing between nodes
      .attr('y', posY)
      .attr('width', 24)
      .attr('height', 24)
      .style('display', 'none')
      .attr('xlink:href', './assets/arrow_circle_down-24px.svg')
      .style('cursor', 'pointer');
    return downArrowImg;
  }

  appendFreeFormImg = (
    g: any,
    svgContainer: any,
    isChild = false,
    posX = 150,
    posY = 75,
    offset = 150,
    width = 24,
    height = 24
  ): any => {
    let freeFormImg: any;
    if (!isChild) {
      freeFormImg = g
        .append('svg:image')
        .attr('class', 'freeFormIcon')
        // .attr('x', 170)
        .attr('x', 140) // Fix for spacing between nodes
        .attr('y', 75 + 20) // added 20 to move the navigation icon
        .attr('width', 24)
        .attr('height', 24)
        .style('display', 'none')
        .attr(
          'xlink:href',
          './assets/system-icon-outlined-icons-navigation-icon-freeform.svg'
        )
        .style('cursor', 'pointer');
      return freeFormImg;
    }
    freeFormImg = svgContainer
      .append('svg:image')
      .attr('class', 'freeFormIcon')
      .attr('x', posX + offset) // free form image - Fix for icon placement //conflict fix for spacing too
      .attr('y', posY + 20) // added this to move the navigation icon - delete icon placement
      .attr('width', 24)
      .attr('height', 24)
      .style('display', 'none')
      .attr(
        'xlink:href',
        './assets/system-icon-outlined-icons-navigation-icon-freeform.svg'
      )
      .style('cursor', 'pointer');
    return freeFormImg;
  };

  activateGreyedOutNode(g: any, gNode: any, showFreeFormIcon: boolean) {
    showFreeFormIcon = true;
    g.svgContainer.on('click', () => {
      const sidenavEl = document.querySelector('mat-sidenav-content');
      if (sidenavEl) {
        this.left = sidenavEl.scrollLeft;
        this.top = sidenavEl.scrollTop;
      }
      d3.select(
        g.svgContainer._groups[0][0].parentNode.parentNode.parentNode
      ).remove();
      this.store.dispatch(create({ node: this.createNewNode(true) }));
    });
  }

  appendGreenCheckImg(
    g: any,
    svgContainer: any,
    // posX = 270, //
    posX = 200, // Fix for spacing between nodes
    posY = 45, // green checker - fix for icon placement. //confilc - fix for spacing too.
    width = 24,
    height = 24
  ): void {
    g.append('svg:image')
      .attr('x', posX)
      .attr('y', posY + 20) // added this to move the green check icon - delete icon placement
      .attr('width', width)
      .attr('height', height)
      .attr(
        'xlink:href',
        './assets/system-icon-filled-icons-alert-icon-positive.svg'
      );
  }

  isStepChild(
    currentNode: GraphNode,
    stepRelationships: Map<number, number[]>
  ): boolean {
    for (const key in stepRelationships) {
      if (
        currentNode.parent &&
        currentNode.id &&
        currentNode.id === +key &&
        stepRelationships[key].includes(currentNode.parent.id)
      ) {
        return true;
      }
    }
    return false;
  }

  openDeleteDialog(id: number): void {
    const data: DialogData = {
      title: 'Delete Confirmation',
      content: DELETE_GUIDELINE_CONFIRMATION,
      type: AlertType.Warning,
      acceptText: 'Confirm',
      declineText: 'Cancel'
    };

    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        ...confirmationDialogConfig,
        data,
        panelClass: 'confirmation-dialog'
      }
    );

    const eventSubscription = dialogRef.componentInstance.acceptEvent.subscribe(() => {
      this.delete(id);
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(() => eventSubscription.unsubscribe()).unsubscribe();
  }

  delete(id: number): void {
    // this.store.dispatch(deleteGuidelineVersion({ guidelineVersionId }));
    this.store.dispatch(remove({ id }));
  }

}
