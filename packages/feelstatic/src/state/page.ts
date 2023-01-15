import { atom } from 'jotai';
import { FeelstaticGroup } from './group';

export type FeelstaticPage = {
  name: string;
  parents: string[];
  url: string;
  path: string;
  lastModified: Date;
  isDraft?: boolean;
  groups: FeelstaticGroup;
};

export const feelstaticPagesAtom = atom<FeelstaticPage[]>([]);
