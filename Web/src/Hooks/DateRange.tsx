import { useState, useEffect } from "react";
import { DateRangePicker } from "@nextui-org/date-picker";
import "@/Css/Transaction.css";

interface DateRangeProps {
  onDateChange: (dateRange: [Date | null, Date | null]) => void;
}

export default function DateRange({ onDateChange }: DateRangeProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    onDateChange(dateRange);
  }, [dateRange, onDateChange]);

  const handleDateChange = (newRange: [Date | null, Date | null]) => {
    setDateRange(newRange);
  };

  const resetDateRange = () => {
    const resetRange: [Date | null, Date | null] = [null, null];
    setDateRange(resetRange);
    onDateChange(resetRange);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
      <DateRangePicker
        calendarProps={{
          classNames: {
            separator: "-mx-2",
            base: "bg-background bg-white border border-gray-500 max-w-full",
            headerWrapper: "pt-4 bg-background",
            prevButton: "border-1 border-default-200 rounded-small",
            nextButton: "border-1 border-default-200 rounded-small",
            gridHeader: "bg-background shadow-none border-b-1 border-default-100",
            cellButton: [
              "data-[today=true]:bg-default-100 data-[selected=true]:bg-green-500 rounded-full",
              "hover:bg-green-100",
              "focus:bg-green-200",
              "data-[range-start=true]:before:rounded-l-small",
              "data-[selection-start=true]:before:rounded-l-small",
              "data-[range-end=true]:before:rounded-r-small",
              "data-[selection-end=true]:before:rounded-r-small",
              "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-small",
              "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-small",
            ],
            // Add responsive classes for the calendar popup
            content: "max-h-[80vh] overflow-auto",
          },
        }}
        className={`
          w-full 
          sm:w-auto 
          min-w-[17rem] 
          max-w-full 
          sm:max-w-md 
          border 
          border-gray-500 
          rounded-2xl 
          py-1 
          shadow-md
          ${isMobile ? 'text-sm' : 'text-base'}
        `}
        label="Choose date:"
        variant="bordered"
        value={dateRange}
        onChange={handleDateChange}
        popoverProps={{
          // Make the popover responsive
          classNames: {
          
            base: "max-w-full sm:max-w-[calc(100vw-2rem)] md:max-w-lg",
            content: "max-h-[80vh] overflow-auto"
          },
          placement: isMobile ? "bottom" : "bottom-start"
        }}
        classNames={{
          separator: "mx-1", // Customize the separator class here
        }}
      />
      <button
        onClick={resetDateRange}
        className={`
          w-full 
          sm:w-auto 
          px-4 
          py-2 
          bg-green-500 
          text-white 
          rounded-xl 
          hover:bg-green-300 
          transition-colors 
          duration-200
          text-sm 
          sm:text-base
          ${isMobile ? 'mb-2 sm:mb-0' : ''}
        `}
      >
        Clear
      </button>
    </div>
  );
}