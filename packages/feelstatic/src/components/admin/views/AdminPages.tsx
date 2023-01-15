'use client';

import { RiArrowLeftLine } from 'react-icons/ri';
import { usePages } from '../../../state/admin/hooks';
import AdminViewListItem from '../primitives/AdminViewListItem';
import AdminPage from './AdminPage';

type Props = {
  pageUrl?: string | null;
};

export default function AdminPages({ pageUrl }: Props) {
  // useImages();
  const { pages } = usePages();
  const page = pages?.find((page) => page.url === pageUrl);

  return (
    <>
      <div className="bg-[#f8faf7] border-r border-[#e7e8e7] w-[380px] overflow-y-auto">
        <div className="border-[#e7e8e7] border-b px-10 py-8 flex items-center">
          <h2 className="text-2xl font-bold">Pages</h2>
        </div>
        <div>
          {pages?.map((page) => {
            return <AdminViewListItem key={page.url} viewUrl={`/feelstatic/pages`} item={page} />;
          })}
        </div>
      </div>
      {page && <AdminPage page={page} />}
      {!page && (
        <div className="flex items-center justify-center text-lg text-gray-400">
          <RiArrowLeftLine className="w-4 h-4 mt-1 mr-2" />
          select a page
        </div>
      )}
    </>
  );
}
