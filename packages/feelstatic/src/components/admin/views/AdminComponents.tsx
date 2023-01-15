'use client';

import { RiArrowLeftLine } from 'react-icons/ri';
import useSWR from 'swr';
import { FeelstaticComponent } from '../../../state/component';
import { fetcher } from '../../../utils/fetcher';
import AdminViewListItem from '../primitives/AdminViewListItem';
import AdminComponent from './AdminComponent';

type Props = {
  componentUrl?: string | null;
};

export default function AdminComponents({ componentUrl }: Props) {
  const { data: components } = useSWR<FeelstaticComponent[]>('/api/feelstatic/components', fetcher);
  const component = components?.find((component) => component.url === componentUrl);

  return (
    <>
      <div className="bg-[#f8faf7] border-r border-[#e7e8e7] w-[380px] overflow-y-auto">
        <div className="border-[#e7e8e7] border-b px-10 py-8 flex items-center">
          <h2 className="text-2xl font-bold">Components</h2>
        </div>
        <div>
          {components?.map((component) => {
            return (
              <AdminViewListItem
                key={component.name}
                onlyShowName={true}
                viewUrl={`/feelstatic/components`}
                item={component}
              />
            );
          })}
        </div>
      </div>
      {component && <AdminComponent component={component} />}
      {!component && (
        <div className="flex items-center justify-center text-lg text-gray-400">
          <RiArrowLeftLine className="w-4 h-4 mt-1 mr-2" />
          select a component
        </div>
      )}
    </>
  );
}
