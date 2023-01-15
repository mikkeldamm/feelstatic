import { FeelstaticFieldName } from '../../../state/field';

type Props = {
  name: FeelstaticFieldName;
  value: number;
  onChange: (value: number) => void;
};

export default function AdminViewNumberField({ name, value, onChange }: Props) {
  return (
    <div className="mb-4">
      <div className="text-xs uppercase mb-1.5 font-medium">{name}</div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="border border-[#c3c7c5] bg-white px-3 py-3 text-[#09150f] focus:border-[#09150f] focus:outline-none"
      />
    </div>
  );
}
