import { arrayMove } from '@dnd-kit/sortable';
import { useAtom, useSetAtom } from 'jotai';
import { useContext } from 'react';
import useSWR from 'swr';
import { fetcher } from '../../utils/fetcher';
import { getItem, setItem } from '../../utils/storage';
import { FeelstaticComponent } from '../component';
import { FeelstaticFieldValue, FeelstaticRepeater } from '../field';
import { FeelstaticImage } from '../image';
import { FeelstaticPage } from '../page';
import { componentsAtom, imagesAtom, pagesAtom, saveComponentDraftAtom, savePageDraftAtom } from './atoms';
import { ComponentContext, PageContext } from './contexts';

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

export const useComponents = () => {
  const [components, setComponents] = useAtom(componentsAtom);

  const { isLoading, error } = useSWR<FeelstaticComponent[]>('/api/feelstatic/components', fetcher, {
    onSuccess: (apiComponents) => {
      const cachedComponents = getItem<FeelstaticComponent[]>('feelstatic:components') || [];
      const mappedComponents = apiComponents.map((apiComponent) => {
        const cachedComponent = cachedComponents.find(
          (cachedComponent) =>
            cachedComponent.url === apiComponent.url &&
            new Date(cachedComponent.lastModified) > new Date(apiComponent.lastModified)
        );
        if (cachedComponent) {
          return {
            ...cachedComponent,
            isDraft: true,
          };
        }

        return { ...apiComponent, isDraft: false };
      });

      setComponents(mappedComponents);
      setItem('feelstatic:components', mappedComponents);
    },
  });

  return {
    components,
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
  value: FeelstaticFieldValue;
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
        acc[key] =
          typeof value === 'string' &&
          /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/.test(
            value
          )
            ? new Date().toISOString()
            : typeof value === 'string'
            ? ''
            : typeof value === 'number'
            ? 0
            : typeof value === 'object' && value.hasOwnProperty('reference')
            ? { ...value }
            : false;
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

export const useComponent = () => {
  const { component, setComponent } = useContext(ComponentContext);
  const saveComponentDraft = useSetAtom(saveComponentDraftAtom);

  return {
    saveDraft: () => {
      if (!component) {
        return;
      }

      saveComponentDraft(component);
    },
    updateField: ({ group, field, value, repeater }: UpdateFieldParams) => {
      if (!component) {
        return;
      }

      if (repeater) {
        setComponent({
          ...component,
          groups: {
            ...component.groups,
            [group]: {
              ...component.groups[group],
              [repeater.field]: (component.groups[group][repeater.field] as FeelstaticRepeater).map((item, index) => {
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
        setComponent({
          ...component,
          groups: {
            ...component.groups,
            [group]: {
              ...component.groups[group],
              [field]: value,
            },
          },
        });
      }
    },
    addRepeaterItem: ({ group, field }: AddFieldParams) => {
      if (!component) {
        return;
      }

      const repeater = component.groups[group][field] as FeelstaticRepeater;
      const firstItem = repeater[0];
      if (!firstItem) {
        return;
      }

      const copiedItem = { ...firstItem };
      const cleanedItem = Object.entries(copiedItem).reduce((acc, [key, value]) => {
        acc[key] =
          typeof value === 'string' &&
          /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/.test(
            value
          )
            ? new Date().toISOString()
            : typeof value === 'string'
            ? ''
            : typeof value === 'number'
            ? 0
            : typeof value === 'object' && value.hasOwnProperty('reference')
            ? { ...value }
            : false;
        return acc;
      }, copiedItem);

      setComponent({
        ...component,
        groups: {
          ...component.groups,
          [group]: {
            ...component.groups[group],
            [field]: [...(component.groups[group][field] as FeelstaticRepeater), cleanedItem],
          },
        },
      });
    },
    removeRepeaterItem: ({ group, field, index }: RemoveFieldParams) => {
      if (!component) {
        return;
      }

      setComponent({
        ...component,
        groups: {
          ...component.groups,
          [group]: {
            ...component.groups[group],
            [field]: (component.groups[group][field] as FeelstaticRepeater).filter((_, i) => i !== index),
          },
        },
      });
    },
    reorderRepeaterItem: ({ group, field, oldIndex, newIndex }: ReorderFieldParams) => {
      if (!component) {
        return;
      }

      setComponent({
        ...component,
        groups: {
          ...component.groups,
          [group]: {
            ...component.groups[group],
            [field]: arrayMove(component.groups[group][field] as FeelstaticRepeater, oldIndex, newIndex),
          },
        },
      });
    },
  };
};
