import { FeelstaticFieldName } from '../../../state/field';

type Props = {
  name: FeelstaticFieldName;
  value: string;
  onChange: (value: string) => void;
};

export default function AdminViewTextField({ name, value, onChange }: Props) {
  return (
    <div className="mb-4">
      <div className="text-xs uppercase mb-1.5 font-medium">{name}</div>
      <div
        dangerouslySetInnerHTML={{ __html: value.replaceAll('\n', '<br/>') }}
        contentEditable
        className="border border-[#c3c7c5] bg-white px-3 py-3 text-[#09150f] focus:border-[#09150f] focus:outline-none"
        onBlur={({ currentTarget }) => {
          const value = currentTarget.innerText;
          onChange(value);
        }}
      ></div>
    </div>
  );
}
