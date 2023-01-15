import { arrayMove } from '@dnd-kit/sortable';
import { useAtom, useSetAtom } from 'jotai';
import { useContext } from 'react';
import useSWR from 'swr';
import { fetcher } from '../../utils/fetcher';
import { getItem, setItem } from '../../utils/storage';
import { FeelstaticRepeater } from '../field';
import { FeelstaticImage } from '../image';
import { FeelstaticPage } from '../page';
import { imagesAtom, pagesAtom, savePageDraftAtom } from './atoms';
import { PageContext } from './contexts';

export const usePages = () => {
  const [pages, setPages] = useAtom(pagesAtom);

  const { isLoading, error } = useSWR<FeelstaticPage[]>('/api/feelstatic/pages', fetcher, {
    onSuccess: (apiPages) => {
      const cachedPages = getItem<FeelstaticPage[]>('feelstatic:pages') || [];
      const mappedPages = apiPages.map((apiPage) => {
        const cachedPage = cachedPages.find(
          (cachedPage) =>
            cachedPage.url === apiPage.url && new Date(cachedPage.lastModified) > new Date(apiPage.lastModified)
        );
        if (cachedPage) {
          return {
            ...cachedPage,
            isDraft: true,
          };
        }

        return { ...apiPage, isDraft: false };
      });

      setPages(mappedPages);
      setItem('feelstatic:pages', mappedPages);
    },
  });

  return {
    pages,
    isLoading,
    isError: error ? true : false,
  };
};

export const useImages = () => {
  const [images, setImages] = useAtom(imagesAtom);

  const { isLoading, error } = useSWR<FeelstaticImage[]>('/api/feelstatic/images', fetcher, {
    onSuccess: (apiImages) => {
      const cachedImages = getItem<FeelstaticImage[]>('feelstatic:images') || [];
      const filteredCachedImages = cachedImages.filter((cachedImage) => {
        return apiImages.some((image) => image.src === cachedImage.src) ? false : true;
      });

      const mappedImages = [
        ...filteredCachedImages,
        ...apiImages
          .filter((image) => {
            return filteredCachedImages.every((cachedImage) => cachedImage.src !== image.src);
          })
          .map((image) => ({ ...image, isDraft: false })),
      ];

      setImages(mappedImages);
      setItem('feelstatic:images', mappedImages);
    },
  });

  return {
    images,
    isLoading,
    isError: error ? true : false,
  };
};

type UpdateFieldParams = {
  group: string;
  field: string;
  value: string | number | boolean;
  repeater?: {
    index: number;
    field: string;
  };
};

type AddFieldParams = {
  group: string;
  field: string;
};

type RemoveFieldParams = {
  group: string;
  field: string;
  index: number;
};

type ReorderFieldParams = {
  group: string;
  field: string;
  oldIndex: number;
  newIndex: number;
};

export const usePage = () => {
  const { page, setPage } = useContext(PageContext);
  const savePageDraft = useSetAtom(savePageDraftAtom);

  return {
    saveDraft: () => {
      if (!page) {
        return;
      }

      savePageDraft(page);
    },
    updateField: ({ group, field, value, repeater }: UpdateFieldParams) => {
      if (!page) {
        return;
      }

      if (repeater) {
        setPage({
          ...page,
          groups: {
            ...page.groups,
            [group]: {
              ...page.groups[group],
              [repeater.field]: (page.groups[group][repeater.field] as FeelstaticRepeater).map((item, index) => {
                return index === repeater.index
                  ? {
                      ...item,
                      [field]: value,
                    }
                  : item;
              }),
            },
          },
        });
      } else {
        setPage({
          ...page,
          groups: {
            ...page.groups,
            [group]: {
              ...page.groups[group],
              [field]: value,
            },
          },
        });
      }
    },
    addRepeaterItem: ({ group, field }: AddFieldParams) => {
      if (!page) {
        return;
      }

      const repeater = page.groups[group][field] as FeelstaticRepeater;
      const firstItem = repeater[0];
      if (!firstItem) {
        return;
      }

      const copiedItem = { ...firstItem };
      const cleanedItem = Object.entries(copiedItem).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? '' : typeof value === 'number' ? 0 : false;
        return acc;
      }, copiedItem);

      setPage({
        ...page,
        groups: {
          ...page.groups,
          [group]: {
            ...page.groups[group],
            [field]: [...(page.groups[group][field] as FeelstaticRepeater), cleanedItem],
          },
        },
      });
    },
    removeRepeaterItem: ({ group, field, index }: RemoveFieldParams) => {
      if (!page) {
        return;
      }

      setPage({
        ...page,
        groups: {
          ...page.groups,
          [group]: {
            ...page.groups[group],
            [field]: (page.groups[group][field] as FeelstaticRepeater).filter((_, i) => i !== index),
          },
        },
      });
    },
    reorderRepeaterItem: ({ group, field, oldIndex, newIndex }: ReorderFieldParams) => {
      if (!page) {
        return;
      }

      setPage({
        ...page,
        groups: {
          ...page.groups,
          [group]: {
            ...page.groups[group],
            [field]: arrayMove(page.groups[group][field] as FeelstaticRepeater, oldIndex, newIndex),
          },
        },
      });
    },
  };
};
