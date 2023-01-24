import { atom } from 'jotai';
import { mutate } from 'swr';
import { setItem } from '../../utils/storage';
import { FeelstaticComponent } from '../component';
import { FeelstaticImage } from '../image';
import { FeelstaticPage } from '../page';

export const pagesAtom = atom<FeelstaticPage[]>([]);
export const componentsAtom = atom<FeelstaticComponent[]>([]);
export const imagesAtom = atom<FeelstaticImage[]>([]);

export const changesAtom = atom((get) => {
  const pages = get(pagesAtom);
  const components = get(componentsAtom);
  const images = get(imagesAtom);

  return {
    pages: pages.filter((page) => page.isDraft),
    components: components.filter((component) => component.isDraft),
    images: images.filter((image) => image.isDraft),
  };
});

export const savePageDraftAtom = atom(null, (get, _, updatedPage: FeelstaticPage) => {
  const pages = get(pagesAtom);
  const updatedPages = pages.map((page) => {
    return page.url === updatedPage.url
      ? {
          ...updatedPage,
          lastModified: new Date(),
          isDraft: true,
        }
      : page;
  });

  setItem('feelstatic:pages', updatedPages);
  mutate('/api/feelstatic/pages', updatedPages);
});

export const saveComponentDraftAtom = atom(null, (get, _, updatedComponent: FeelstaticComponent) => {
  const components = get(componentsAtom);
  const updatedComponents = components.map((component) => {
    return component.url === updatedComponent.url
      ? {
          ...updatedComponent,
          lastModified: new Date(),
          isDraft: true,
        }
      : component;
  });

  setItem('feelstatic:components', updatedComponents);
  mutate('/api/feelstatic/components', updatedComponents);
});

export const saveImageDraftAtom = atom(null, (get, _, updatedImage: FeelstaticImage) => {
  const images = get(imagesAtom);
  const updatedImages = [
    ...images.filter((image) => image.src !== updatedImage.src),
    {
      ...updatedImage,
      isDraft: true,
    },
  ];

  setItem('feelstatic:images', updatedImages);
  mutate('/api/feelstatic/images', updatedImages);
});
