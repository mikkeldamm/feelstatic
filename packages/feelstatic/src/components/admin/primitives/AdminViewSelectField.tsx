import { useContext } from 'react';
import { PageContext } from '../../../state/admin/contexts';
import {
  FeelstaticField,
  FeelstaticFieldName,
  FeelstaticFieldValue,
  FeelstaticReference,
  FeelstaticRepeater,
} from '../../../state/field';
import { FeelstaticGroup } from '../../../state/group';

type Props = {
  name: FeelstaticFieldName;
  value: FeelstaticReference;
  onChange: (value: FeelstaticReference) => void;
};

export default function AdminViewTextField({ name, value: fieldValue, onChange }: Props) {
  const { page } = useContext(PageContext);

  const referencedField = fieldValue.reference.split('.').reduce((acc, curr) => {
    return (acc as FeelstaticGroup | FeelstaticField)[curr];
  }, (page?.groups || {}) as FeelstaticGroup | FeelstaticField | FeelstaticFieldValue) as FeelstaticRepeater;

  const options = referencedField.map((referenceField) => {
    const referenceFieldValue = referenceField[fieldValue.field];
    const referenceFieldLabel = fieldValue.label ? referenceField[fieldValue.label] : referenceFieldValue;
    return {
      value: referenceFieldValue,
      label: referenceFieldLabel,
    };
  });

  return (
    <div className="mb-4">
      <div className="text-xs uppercase mb-1.5 font-medium">{name}</div>
      <select
        className="border border-[#c3c7c5] bg-white px-3 py-3 text-[#09150f] focus:border-[#09150f] focus:outline-none"
        onChange={(e) => {
          const selectedValue = e.target.value;
          onChange({
            ...fieldValue,
            value: selectedValue,
          });
        }}
      >
        {options.map((option) => {
          return (
            <option
              value={option.value as string}
              key={option.value as string}
              selected={fieldValue.value === option.value}
            >
              {option.label as string}
            </option>
          );
        })}
      </select>
    </div>
  );
}
