import React, { useState } from 'react';

interface DateFilterProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ selectedDate, onDateChange }) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(event.target.value);
  };

  return (
    <div className="flex items-center space-x-4 mt-4">
      <label htmlFor="date" className="text-gray-700 font-medium">
       
      </label>
      <input
        type="date"
        id="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="px-4 py-2 rounded border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
  );
};

export default DateFilter;
