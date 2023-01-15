'use client';

import { useState } from 'react';
import { RiArrowDropRightLine, RiHome4Fill, RiStackFill } from 'react-icons/ri';
import { PageContext } from '../../../state/admin/contexts';
import { usePage } from '../../../state/admin/hooks';
import { FeelstaticPage } from '../../../state/page';
import { capatilize } from '../../../utils/capatilize';
import AdminViewGroupItem from '../primitives/AdminViewGroupItem';

type Props = {
  page: FeelstaticPage;
};

const PageHeader = ({ page }: { page: FeelstaticPage }) => {
  const { saveDraft } = usePage();
  return (
    <div className="sticky top-0 z-40 flex items-center px-10 py-8 before:bg-white before:inset-0 before:absolute before:z-30 before:opacity-75 after:absolute after:z-30 after:inset-0 after:backdrop-blur-sm">
      <h2 className="z-40 text-2xl font-bold truncate" style={{ direction: 'rtl' }}>
        {page.parents.length > 0 &&
          [...page.parents, page.name].map((parent, index) => {
            return (
              <>
                {index > 0 && <RiArrowDropRightLine className="inline w-4 h-4 mx-1" />}
                {capatilize(parent)}
              </>
            );
          })}
        {page.name === '' && <RiHome4Fill className="mt-1 mb-1" />}
        {page.parents.length === 0 && capatilize(page.name)}
      </h2>
      <div className="z-40 pl-10 ml-auto shrink-0">
        <div
          onClick={saveDraft}
          className="flex items-center px-3 py-1 font-medium border border-[#09150f] cursor-pointer hover:bg-[#1f3329] hover:border-[#1f3329] hover:text-white"
        >
          Save draft
          <RiStackFill className="w-3 h-3 ml-2" />
        </div>
      </div>
    </div>
  );
};

const PageGroups = ({ page }: { page: FeelstaticPage }) => {
  const { updateField, addRepeaterItem, removeRepeaterItem, reorderRepeaterItem } = usePage();
  return (
    <>
      {Object.entries(page.groups).map(([name, groupFields]) => {
        return (
          <AdminViewGroupItem
            key={name}
            name={name}
            groupFields={groupFields}
            onFieldChange={(group, field, value, repeater) => {
              console.log({ group, field, value, repeater });
              updateField({ group, field, value, repeater });
            }}
            onAddItem={(group, field) => {
              addRepeaterItem({ group, field });
            }}
            onRemoveItem={(group, field, index) => {
              removeRepeaterItem({ group, field, index });
            }}
            onReorderItem={(group, field, oldIndex, newIndex) => {
              reorderRepeaterItem({ group, field, oldIndex, newIndex });
            }}
          />
        );
      })}
    </>
  );
};

export default function AdminPage({ page: pageData }: Props) {
  const [page, setPage] = useState(pageData);
  return (
    <PageContext.Provider value={{ page, setPage }}>
      <div className="min-w-[450px] pb-20 overflow-y-auto">
        <PageHeader page={page} />
        <div className="border-b border-[#e7e8e7] mx-10 grid grid-cols-[1fr,auto] mt-4 pb-6 mb-4">
          <div className="border-r border-[#e7e8e7] pr-6 mr-6">
            <div className="text-[#9da19f] text-xs uppercase mb-1.5 font-bold">Page link</div>
            <a href={page.url} target="_blank" rel="nofollow noreferrer noopener" className="font-medium">
              {page.url}
            </a>
          </div>
          <div className="pr-10">
            <div className="text-[#9da19f] text-xs uppercase mb-1.5 font-bold">Status</div>
            <div className="flex items-center font-medium">
              {!page.isDraft && (
                <>
                  <div className="w-1.5 h-1.5 mr-2 bg-green-500 rounded-full mt-[1px]"></div>
                  Published
                </>
              )}
              {page.isDraft && (
                <>
                  <div className="w-1.5 h-1.5 mr-2 bg-orange-500 rounded-full mt-[1px]"></div>
                  Draft
                </>
              )}
            </div>
          </div>
        </div>
        <PageGroups page={page} />
      </div>
    </PageContext.Provider>
  );
}
