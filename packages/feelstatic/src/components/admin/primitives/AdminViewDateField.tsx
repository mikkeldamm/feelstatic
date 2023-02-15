import { useState } from 'react';
import { TbCalendar, TbCalendarTime } from 'react-icons/tb';
import { FeelstaticFieldName } from '../../../state/field';

type Props = {
  name: FeelstaticFieldName;
  value: string;
  onChange: (value: string) => void;
};

export default function AdminViewDateField({ name, value, onChange }: Props) {
  const isWithoutTime = value.includes('00:00:00.000');
  const [type, setType] = useState(isWithoutTime ? 'date' : 'datetime-local');

  return (
    <div className="mb-4">
      <div className="text-xs uppercase mb-1.5 font-medium flex items-center">
        {name}
        <div className="flex items-center ml-2 bg-[#e7e8e7] py-[3px] px-[5px]">
          <div
            onClick={() => {
              setType('date');
            }}
            className="cursor-pointer"
            style={{ color: type === 'date' ? '#000' : '#85988e' }}
          >
            <TbCalendar className="w-4 h-4" />
          </div>
          <div
            onClick={() => {
              setType('datetime-local');
            }}
            className="ml-1 cursor-pointer"
            style={{ color: type === 'datetime-local' ? '#000' : '#85988e' }}
          >
            <TbCalendarTime className="w-4 h-4" />
          </div>
        </div>
      </div>
      <input
        type={type}
        value={type === 'date' ? value.split('T')[0] : value.split(':00.000')[0]}
        className="border border-[#c3c7c5] w-full bg-white px-3 py-3 text-[#09150f] focus:border-[#09150f] focus:outline-none"
        onChange={(e) => {
          const value = e.target.valueAsNumber;
          onChange(new Date(value).toISOString());
        }}
      />
    </div>
  );
}
