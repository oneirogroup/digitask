import { FC, useRef, useState } from "react";
import { useClickOutside } from "react-native-click-outside";
import DateTimePicker from "react-native-ui-datepicker";
import { RangeChange } from "react-native-ui-datepicker/src/types";
import { useBoolean } from "react-use";

import { Button, Icon, Text, View, ViewRef, When } from "@oneiro/ui-kit";

import { DateService } from "../../services/date-service";
import { BlockContainer } from "../blocks";
import { DateRange, RangePickerProps } from "./range-picker.types";

export const RangePicker: FC<RangePickerProps> = ({ onChange }) => {
  const [isDatePickerVisible, toggleDatePickerVisibility] = useBoolean(false);
  const [range, setRange] = useState<Partial<DateRange> | null>(null);
  const [debouncedRange, setDebouncedRange] = useState<Partial<DateRange> | null>(null);
  const tmpStartDate = useRef<DateService | null>(null);
  const ref = useClickOutside<ViewRef>(toggleDatePickerVisibility);

  const handleDateChange: RangeChange = ({ startDate, endDate }) => {
    if (startDate && tmpStartDate.current && !endDate) {
      endDate = DateService.from(tmpStartDate.current);
      tmpStartDate.current = null;
    }
    if (startDate) {
      tmpStartDate.current = DateService.from(startDate);
    }
    if (endDate && tmpStartDate.current) {
      tmpStartDate.current = null;
    }

    setRange(prev => {
      if (prev?.start && prev?.end) return null;
      const dateRange: Partial<DateRange> = {};
      startDate && (dateRange.start = DateService.from(startDate));
      endDate && (dateRange.end = DateService.from(endDate));
      startDate && endDate && toggleDatePickerVisibility();
      if (isDatePickerVisible && startDate && endDate) {
        setDebouncedRange(dateRange);
        onChange?.(dateRange as DateRange);
      }
      return dateRange;
    });
  };

  const toggleDatePicker = () => {
    if (!isDatePickerVisible && range?.start && range?.end) {
      setRange(null);
    }
    toggleDatePickerVisibility();
  };

  return (
    <BlockContainer>
      <Button variant="none" onClick={toggleDatePicker} className="flex flex-row justify-between">
        <View className="flex flex-row gap-2">
          <View>
            <Text className="text-lg">{debouncedRange?.start?.format("dd/mm/yyyy") || "Select from date"}</Text>
          </View>
          <View>
            <Text className="text-lg">-</Text>
          </View>
          <View>
            <Text className="text-lg">{debouncedRange?.end?.format("dd/mm/yyyy") || "Select to date"}</Text>
          </View>
        </View>
        <Icon name="calendar" state="raw" variables={{ fill: "black" }} />
      </Button>

      <When condition={isDatePickerVisible}>
        <View ref={ref} className="absolute left-4 top-24 rounded-2xl bg-white">
          <DateTimePicker mode="range" startDate={range?.start} endDate={range?.end} onChange={handleDateChange} />
        </View>
      </When>
    </BlockContainer>
  );
};
