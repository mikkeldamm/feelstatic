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
import { RiAddBoxFill, RiDeleteBin5Fill, RiMenu2Fill } from 'react-icons/ri';
import AdminViewFields from './AdminViewFields';

type Props = {
  name: string;
  value: {
    [key: string]: string | number | boolean;
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

const RepeaterItem = ({ name, repeaterItem, repeaterIndex, onFieldChange, removeItem }: any) => {
  const id = JSON.stringify(repeaterItem);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="bg-[#f8faf7] hover:bg-[#eff1ed] grid grid-cols-[auto,1fr,auto] gap-6 items-start py-6 mt-2"
      style={style}
    >
      <div className="pl-6 cursor-row-resize" ref={setNodeRef} {...attributes} {...listeners}>
        <RiMenu2Fill className="w-5 h-5" />
      </div>
      <div>
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
      <div className="text-xs uppercase mb-1.5 font-medium">{name}</div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value.map((repeaterItem) => ({ id: JSON.stringify(repeaterItem) }))}>
          {value.map((repeaterItem, repeaterIndex) => {
            return (
              <RepeaterItem
                key={repeaterIndex}
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
