'use client';
import { LuCalendarDays } from 'react-icons/lu';
import { DateFormInput } from '@/components/form';

const EmployeeDateRangeFilter = ({ control }) => {
  return (
    <>
      <DateFormInput
        name="filterByDateStart"
        control={control}
        className="max-w-[180px]"
        placeholder="Ngày bắt đầu"
        startInnerIcon={<LuCalendarDays />}
        options={{
          dateFormat: 'd/m/Y',
        }}
      />

      <DateFormInput
        name="filterByDateEnd"
        control={control}
        className="max-w-[180px]"
        placeholder="Ngày kết thúc"
        startInnerIcon={<LuCalendarDays />}
        options={{
          dateFormat: 'd/m/Y',
        }}
      />
    </>
  );
};

export default EmployeeDateRangeFilter;
