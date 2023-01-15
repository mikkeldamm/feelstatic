import { FeelstaticGroup } from './group';

export type FeelstaticComponent = {
  name: string;
  parents: string[];
  url: string;
  path: string;
  lastModified: Date;
  isDraft?: boolean;
  groups: FeelstaticGroup;
};
