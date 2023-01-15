import { createContext } from 'react';
import { FeelstaticPage } from '../page';

export const PageContext = createContext<{
  page: FeelstaticPage | null;
  setPage: (page: FeelstaticPage) => void;
}>({ page: null, setPage: () => {} });
