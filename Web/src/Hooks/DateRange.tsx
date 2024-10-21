import { useState } from "react";
import { DateRangePicker } from "@nextui-org/date-picker";
import "@/Css/Transaction.css";

// Define the props interface
interface DateRangeProps {
  onDateChange: (dateRange: [Date | null, Date | null]) => void; // Specify the type of the prop
}

export default function DateRange({ onDateChange }: DateRangeProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]); // State to hold the date range

  const handleDateChange = (newRange: [Date | null, Date | null]) => {
    setDateRange(newRange);
    onDateChange(newRange); // Notify the parent component about the new date range
  };

  const resetDateRange = () => {
    setDateRange([null, null]);
    onDateChange([null, null]); // Notify parent to reset date as well
  };

  return (
    <div className="flex items-center justify-end"> {/* Align items horizontally */}
      <DateRangePicker
        calendarProps={{
          classNames: {
            base: "bg-background bg-white border border-gray-500", // Ensure border is consistent
            headerWrapper: "pt-4 bg-background",
            prevButton: "border-1 border-default-200 rounded-small",
            nextButton: "border-1 border-default-200 rounded-small",
            gridHeader: "bg-background shadow-none border-b-1 border-default-100",
            cellButton: [
              // Styling for cell buttons (dates)
              "data-[today=true]:bg-default-100 data-[selected=true]:bg-green-500 rounded-full", // selected dates in green
              "hover:bg-green-100", // on hover, show light green
              "focus:bg-green-200", // on focus (keyboard interaction), show a bit darker green
              // start (pseudo)
              "data-[range-start=true]:before:rounded-l-small",
              "data-[selection-start=true]:before:rounded-l-small",
              // end (pseudo)
              "data-[range-end=true]:before:rounded-r-small",
              "data-[selection-end=true]:before:rounded-r-small",
              // start (selected)
              "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-small",
              // end (selected)
              "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-small",
            ],
          },
        }}
        className="min-w-[17rem] border border-gray-500 rounded-2xl py-1 shadow-md" // Ensure consistent border here as well
        label="Stay duration:"
        variant="bordered"
        value={dateRange} // Pass the selected date range to the DateRangePicker
        onChange={handleDateChange} // Update the date range on selection
      />
      <button 
        onClick={resetDateRange} 
        className="ml-2 p-1 bg-green-500 text-white rounded-xl hover:bg-red-600"
      >
        Clear
      </button>
    </div>
  );
}
