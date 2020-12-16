import { Resource } from './resource';
import { GuidelineVersion } from './guideline-version';
import { TableItem } from './table-item';
import { NodeMap } from './node';

export class Guideline implements Resource {
  id: number;
  createdDate: Date;
  guidelineVersion: GuidelineVersion;
  tableItems: TableItem[];
  removed: boolean;
  nodeMap?: NodeMap;
}
