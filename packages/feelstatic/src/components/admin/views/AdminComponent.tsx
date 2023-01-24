'use client';

import { useState } from 'react';
import { RiStackFill } from 'react-icons/ri';
import { ComponentContext } from '../../../state/admin/contexts';
import { useComponent } from '../../../state/admin/hooks';
import { FeelstaticComponent } from '../../../state/component';
import { capatilize } from '../../../utils/capatilize';
import AdminViewGroupItem from '../primitives/AdminViewGroupItem';

type Props = {
  component: FeelstaticComponent;
};

const ComponentHeader = ({ component }: { component: FeelstaticComponent }) => {
  const { saveDraft } = useComponent();
  return (
    <div className="sticky top-0 z-40 flex items-center px-10 py-8 before:bg-white before:inset-0 before:absolute before:z-30 before:opacity-75 after:absolute after:z-30 after:inset-0 after:backdrop-blur-sm">
      <h2 className="z-40 text-2xl font-bold truncate" style={{ direction: 'rtl' }}>
        {capatilize(component.name)}
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

const ComponentGroups = ({ component }: { component: FeelstaticComponent }) => {
  const { updateField, addRepeaterItem, removeRepeaterItem, reorderRepeaterItem } = useComponent();
  return (
    <>
      {Object.entries(component.groups).map(([name, groupFields]) => {
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

export default function AdminComponent({ component: componentData }: Props) {
  const [component, setComponent] = useState(componentData);
  return (
    <ComponentContext.Provider value={{ component, setComponent }}>
      <div className="min-w-[450px] pb-20 overflow-y-auto">
        <ComponentHeader component={component} />
        <div className="border-b border-[#e7e8e7] mx-10 grid grid-cols-[1fr,auto] mt-4 pb-6 mb-4">
          <div className="border-r border-[#e7e8e7] pr-6 mr-6">
            <div className="text-[#9da19f] text-xs uppercase mb-1.5 font-bold">Component path</div>
            <div className="font-medium">{component.parents.join(' > ')}</div>
          </div>
          <div className="pr-10">
            <div className="text-[#9da19f] text-xs uppercase mb-1.5 font-bold">Status</div>
            <div className="flex items-center font-medium">
              {!component.isDraft && (
                <>
                  <div className="w-1.5 h-1.5 mr-2 bg-green-500 rounded-full mt-[1px]"></div>
                  Published
                </>
              )}
              {component.isDraft && (
                <>
                  <div className="w-1.5 h-1.5 mr-2 bg-orange-500 rounded-full mt-[1px]"></div>
                  Draft
                </>
              )}
            </div>
          </div>
        </div>
        <ComponentGroups component={component} />
      </div>
    </ComponentContext.Provider>
  );
}
