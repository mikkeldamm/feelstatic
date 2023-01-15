import Link from 'next/link';
import { RiHome4Fill } from 'react-icons/ri';
import { TbChevronDownLeft } from 'react-icons/tb';
import { FeelstaticComponent } from '../../../state/component';
import { FeelstaticPage } from '../../../state/page';
import { capatilize } from '../../../utils/capatilize';

type Props = {
  viewUrl: string;
  item: FeelstaticPage | FeelstaticComponent;
  onlyShowName?: boolean;
};

export default function AdminViewListItem({ viewUrl, item, onlyShowName }: Props) {
  return (
    <Link
      href={`${viewUrl}/edit${item.url}`}
      className="hover:bg-[#1f3329] hover:text-white cursor-pointer flex items-start px-10 py-4 border-b border-[#e7e8e7]"
    >
      <div className="min-w-0">
        <div className="font-medium">
          {!onlyShowName &&
            item.parents.length > 0 &&
            [...item.parents, item.name].map((parent, index) => {
              return (
                <div
                  className={`truncate ${index !== item.parents.length && 'text-gray-300'}`}
                  style={{ marginTop: index > 0 ? '6px' : 0, marginLeft: 12 * index }}
                  key={parent}
                >
                  {index > 0 && <TbChevronDownLeft className="w-4 h-4 text-gray-300 inline mr-0.5 -mt-[5px]" />}
                  {capatilize(parent)}
                </div>
              );
            })}
          {item.name === '' && <RiHome4Fill className="mt-1 mb-1" />}
          {(item.parents.length === 0 || onlyShowName) && capatilize(item.name)}
        </div>
      </div>
      <div className="flex items-center mt-1 ml-auto text-xs">
        {!item.isDraft && (
          <>
            <div className="w-1.5 h-1.5 mr-2 bg-green-500 rounded-full mt-[1px]"></div>
            Published
          </>
        )}
        {item.isDraft && (
          <>
            <div className="w-1.5 h-1.5 mr-2 bg-orange-500 rounded-full mt-[1px]"></div>
            Draft
          </>
        )}
      </div>
    </Link>
  );
}
