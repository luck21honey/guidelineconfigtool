import { Resource } from './resource';
import { GuidelineType } from './guideline-type';

export class GuidelineVersion implements Resource {
  id: number;
  guidelineTypeId: number;
  guidelineType: GuidelineType;
  providerGuidelineVersion: string;
  createdDate: Date;
  createdBy: string;
  lastModifiedDate: Date;
  updates: string[];
  removed: boolean;
}
