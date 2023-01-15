import { atom } from 'jotai';
import { FeelstaticField } from './field';

export type FeelstaticGroupName = string;
export type FeelstaticGroup = {
  [key: FeelstaticGroupName]: FeelstaticField;
};

export const groupsAtom = atom<FeelstaticGroup[]>([]);
