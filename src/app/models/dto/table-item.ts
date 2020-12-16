import { Resource } from './resource';
import { Guideline } from './guideline';

export class TableItem implements Resource {
  id: number;
  name: string;
  code: string;
  nodeIds: number[];
  guideline: Guideline;
  chapter?: any;
  pageNumber?: number;
  startingPoint?: boolean;
}

export class TableItemNodeRelationship {
  tableItemId: number;
  nodeId: number;
}
