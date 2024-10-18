import { FC, useRef, useState } from "react";
import { Text, View } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import { RangeChange } from "react-native-ui-datepicker/src/types";

import { Button, Icon, Modal, ModalRef } from "@oneiro/ui-kit";

import { DateService } from "../../services/date-service";
import { BlockContainer } from "../blocks";
import { DateRange, RangePickerProps } from "./range-picker.types";

export const RangePicker: FC<RangePickerProps> = ({ onChange }) => {
  const modalRef = useRef<ModalRef>(null);
  const [range, setRange] = useState<Partial<DateRange> | null>(null);
  const [debouncedRange, setDebouncedRange] = useState<Partial<DateRange> | null>(null);
  const tmpStartDate = useRef<DateService | null>(null);

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
      startDate && endDate && modalRef.current?.close();
      if (modalRef.current?.isOpen && startDate && endDate) {
        setDebouncedRange(dateRange);
        onChange?.(dateRange as DateRange);
      }
      return dateRange;
    });
  };

  const toggleDatePicker = () => {
    if (!modalRef.current?.isOpen && range?.start && range?.end) {
      setRange(null);
    }
    modalRef.current?.open();
  };

  return (
    <BlockContainer className="relative">
      <Button variant="none" onClick={toggleDatePicker} className="flex flex-row justify-between">
        <View className="flex flex-row gap-2">
          <View>
            <Text className="text-lg">{debouncedRange?.start?.format("DD/MMM/YYYY") || "Select from date"}</Text>
          </View>
          <View>
            <Text className="text-lg">-</Text>
          </View>
          <View>
            <Text className="text-lg">{debouncedRange?.end?.format("DD/MMM/YYYY") || "Select to date"}</Text>
          </View>
        </View>
        <Icon name="calendar" state="raw" variables={{ fill: "black" }} />
      </Button>

      <Modal ref={modalRef} type="bottom" height={350}>
        <DateTimePicker mode="range" startDate={range?.start} endDate={range?.end} onChange={handleDateChange} />
      </Modal>
    </BlockContainer>
  );
};
