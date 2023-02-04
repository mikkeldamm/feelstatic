import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { RiAddBoxFill, RiDeleteBin5Fill, RiLayoutGridLine, RiLayoutRowLine, RiMenu2Fill } from 'react-icons/ri';
import { FeelstaticFieldValue } from '../../../state/field';
import AdminViewFields from './AdminViewFields';

type RepeaterView = 'list' | 'grid';

type Props = {
  name: string;
  value: {
    [key: string]: FeelstaticFieldValue;
  }[];
  onFieldChange: (
    field: string,
    value: string | number | boolean,
    repeater?: {
      index: number;
      field: string;
    }
  ) => void;
  onAddItem: (field: string) => void;
  onRemoveItem: (field: string, index: number) => void;
  onReorderItem: (field: string, fromIndex: number, toIndex: number) => void;
};

const RepeaterItem = ({
  name,
  view,
  repeaterItem,
  repeaterIndex,
  onFieldChange,
  removeItem,
}: any & { view: RepeaterView }) => {
  const id = JSON.stringify(repeaterItem);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const fieldsCount = view === 'list' ? 1 : Object.entries(repeaterItem).length;
  const gridTemplateColumns = `repeat(${fieldsCount > 4 ? 4 : fieldsCount}, 1fr)`;
  const paddingY = view === 'list' ? 24 : 12;
  const marginBottom = view === 'list' ? undefined : '-1rem';

  return (
    <div
      className="bg-[#f8faf7] hover:bg-[#eff1ed] grid grid-cols-[auto,1fr,auto] gap-6 items-start mt-2"
      style={{
        ...style,
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
    >
      <div className="pl-6 cursor-row-resize" ref={setNodeRef} {...attributes} {...listeners}>
        <RiMenu2Fill className="w-5 h-5" />
      </div>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: gridTemplateColumns,
          marginBottom: marginBottom,
        }}
      >
        <AdminViewFields
          fields={repeaterItem}
          onFieldChange={(fieldName, fieldValue) =>
            onFieldChange(fieldName, fieldValue, { index: repeaterIndex, field: name })
          }
          onAddItem={() => {}}
          onRemoveItem={() => {}}
          onReorderItem={() => {}}
        />
      </div>
      <div
        onClick={() => removeItem(repeaterIndex)}
        className="cursor-pointer px-2 py-2 mr-6 text-[#09150f] hover:text-red-500"
      >
        <RiDeleteBin5Fill className="w-5 h-5" />
      </div>
    </div>
  );
};

export default function AdminViewRepeaterField({
  name,
  value,
  onFieldChange,
  onAddItem,
  onRemoveItem,
  onReorderItem,
}: Props) {
  const [view, setView] = useState<RepeaterView>(value.length > 3 ? 'grid' : 'list');
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = value.findIndex((repeaterItem) => JSON.stringify(repeaterItem) === active.id);
      const newIndex = value.findIndex((repeaterItem) => JSON.stringify(repeaterItem) === over.id);

      onReorderItem(name, oldIndex, newIndex);
    }
  };

  const addItem = () => {
    onAddItem(name);
  };

  const removeItem = (index: number) => {
    if (confirm('Are you sure you want to remove this item?')) {
      onRemoveItem(name, index);
    }
  };

  return (
    <>
      <div className="text-xs uppercase mb-1.5 font-medium flex items-center">
        {name}
        <div className="flex items-center ml-2 bg-[#e7e8e7] py-[3px] px-[5px]">
          <div
            onClick={() => setView('list')}
            className="cursor-pointer"
            style={{ color: view === 'list' ? '#000' : '#85988e' }}
          >
            <RiLayoutRowLine className="w-4 h-4" />
          </div>
          <div
            onClick={() => setView('grid')}
            className="ml-1 cursor-pointer"
            style={{ color: view === 'grid' ? '#000' : '#85988e' }}
          >
            <RiLayoutGridLine className="w-4 h-4" />
          </div>
        </div>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value.map((repeaterItem) => ({ id: JSON.stringify(repeaterItem) }))}>
          {value.map((repeaterItem, repeaterIndex) => {
            return (
              <RepeaterItem
                key={repeaterIndex}
                view={view}
                className="bg-[#f8faf7] hover:bg-[#eff1ed] grid grid-cols-[auto,1fr,auto] gap-6 items-start py-6 mt-2"
                name={name}
                repeaterItem={repeaterItem}
                repeaterIndex={repeaterIndex}
                onFieldChange={onFieldChange}
                removeItem={removeItem}
              />
            );
          })}
        </SortableContext>
      </DndContext>
      <div onClick={addItem} className="flex justify-center mt-3 cursor-pointer" title="Add new">
        <RiAddBoxFill className="w-6 h-6 text-[#09150f]" />
      </div>
    </>
  );
}
