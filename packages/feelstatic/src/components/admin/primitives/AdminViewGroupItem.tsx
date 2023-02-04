import { FeelstaticField, FeelstaticFieldValue } from '../../../state/field';
import { FeelstaticGroupName } from '../../../state/group';
import AdminViewFields from './AdminViewFields';

type Props = {
  name: FeelstaticGroupName;
  groupFields: FeelstaticField;
  onFieldChange: (
    group: string,
    field: string,
    value: FeelstaticFieldValue,
    repeater?: {
      index: number;
      field: string;
    }
  ) => void;
  onAddItem: (group: string, field: string) => void;
  onRemoveItem: (group: string, field: string, index: number) => void;
  onReorderItem: (group: string, field: string, oldIndex: number, newIndex: number) => void;
};

export default function AdminViewGroupItem({
  name,
  groupFields,
  onFieldChange,
  onAddItem,
  onRemoveItem,
  onReorderItem,
}: Props) {
  return (
    <div className="px-10 mt-8">
      <div className="mb-4 text-lg font-bold capitalize">{name}</div>
      <AdminViewFields
        fields={groupFields}
        onFieldChange={(field, value, repeater) => {
          onFieldChange(name, field, value, repeater);
        }}
        onAddItem={(field) => onAddItem(name, field)}
        onRemoveItem={(field, index) => onRemoveItem(name, field, index)}
        onReorderItem={(field, oldIndex, newIndex) => onReorderItem(name, field, oldIndex, newIndex)}
      />
    </div>
  );
}
