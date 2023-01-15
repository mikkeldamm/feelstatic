import { atom } from 'jotai';

export type FeelstaticImage = {
  name: string;
  extension: string;
  src: string;
  path: string;
  isDraft?: boolean;
  contents?: string;
};

export const imagesAtom = atom<FeelstaticImage[]>([]);
