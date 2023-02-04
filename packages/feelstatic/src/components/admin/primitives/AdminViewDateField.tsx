import { FeelstaticFieldName } from '../../../state/field';

type Props = {
  name: FeelstaticFieldName;
  value: string;
  onChange: (value: string) => void;
};

export default function AdminViewDateField({ name, value, onChange }: Props) {
  return (
    <div className="mb-4">
      <div className="text-xs uppercase mb-1.5 font-medium">{name}</div>
      <input
        type="date"
        value={value.split('T')[0]}
        className="border border-[#c3c7c5] bg-white px-3 py-3 text-[#09150f] focus:border-[#09150f] focus:outline-none"
        onChange={(e) => {
          const value = e.target.valueAsNumber;
          onChange(new Date(value).toISOString());
        }}
      />
    </div>
  );
}
