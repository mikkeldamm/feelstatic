import { createContext } from 'react';
import { FeelstaticComponent } from '../component';
import { FeelstaticPage } from '../page';

export const PageContext = createContext<{
  page: FeelstaticPage | null;
  setPage: (page: FeelstaticPage) => void;
}>({ page: null, setPage: () => {} });

export const ComponentContext = createContext<{
  component: FeelstaticComponent | null;
  setComponent: (component: FeelstaticComponent) => void;
}>({ component: null, setComponent: () => {} });
