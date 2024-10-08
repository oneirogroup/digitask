import { FC, useRef, useState } from "react";
import { Dimensions } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import DateTimePicker from "react-native-ui-datepicker";
import { RangeChange } from "react-native-ui-datepicker/src/types";
import { useBoolean } from "react-use";

import { Button, Icon, Text, View } from "@oneiro/ui-kit";

import { DateService } from "../../services/date-service";
import { BlockContainer } from "../blocks";
import { DateRange, RangePickerProps } from "./range-picker.types";

const { height: screenHeight } = Dimensions.get("window");

export const RangePicker: FC<RangePickerProps> = ({ onChange }) => {
  const [isDatePickerVisible, toggleDatePickerVisibility] = useBoolean(false);
  const [range, setRange] = useState<Partial<DateRange> | null>(null);
  const [debouncedRange, setDebouncedRange] = useState<Partial<DateRange> | null>(null);
  const tmpStartDate = useRef<DateService | null>(null);
  const height = useSharedValue(-screenHeight * 0.4);

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
    height.value = isDatePickerVisible ? 0 : -screenHeight * 0.4;
    toggleDatePickerVisibility();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    bottom: withTiming(height.value, { duration: 300 })
  }));

  return (
    <BlockContainer className="relative">
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

      <View className="absolute bottom-0 left-0 right-0">
        <Animated.View style={animatedStyle} className="absolute left-0 right-0">
          <View className="">
            <DateTimePicker mode="range" startDate={range?.start} endDate={range?.end} onChange={handleDateChange} />
          </View>
        </Animated.View>
      </View>

      {/*<View className="flex-1 justify-end">*/}
      {/*<AnimatedView></AnimatedView>*/}

      {/*<When condition={isDatePickerVisible}>*/}
      {/*  <Button className="absolute inset-0 bg-black/50" onPress={toggleDatePicker} />*/}
      {/*</When>*/}
      {/*<AnimatedView*/}
      {/*  style={[{ height: screenHeight * 0.6 }, animatedStyle]}*/}
      {/*  className="w-full rounded-t-3xl bg-white shadow-lg"*/}
      {/*>*/}
      {/*  <DateTimePicker mode="range" startDate={range?.start} endDate={range?.end} onChange={handleDateChange} />*/}
      {/*</AnimatedView>*/}
      {/*</View>*/}

      {/*<Modal*/}
      {/*  animationType="slide"*/}
      {/*  transparent={true}*/}
      {/*  visible={isDatePickerVisible}*/}
      {/*  onRequestClose={toggleDatePickerVisibility}*/}
      {/*>*/}
      {/*<TouchableWithoutFeedback onPress={toggleDatePicker}>*/}
      {/*  <View className="flex-1 items-center justify-end bg-black/50">*/}
      {/*    <TouchableWithoutFeedback>*/}
      {/*      <View className="h-max w-full rounded-t-2xl bg-white">*/}
      {/*        <DateTimePicker*/}
      {/*          mode="range"*/}
      {/*          startDate={range?.start}*/}
      {/*          endDate={range?.end}*/}
      {/*          onChange={handleDateChange}*/}
      {/*        />*/}
      {/*      </View>*/}
      {/*    </TouchableWithoutFeedback>*/}
      {/*  </View>*/}
      {/*</TouchableWithoutFeedback>*/}

      {/*<Button*/}
      {/*  variant="none"*/}
      {/*  className="flex-1 items-center justify-end bg-black/50"*/}
      {/*  onClick={toggleDatePickerVisibility}*/}
      {/*>*/}
      {/*  <Button variant="none" onClick={e => e.stopPropagation()} className="h-max w-full rounded-t-2xl bg-white">*/}
      {/*  </Button>*/}
      {/*</Button>*/}

      {/*<TouchableWithoutFeedback onPress={toggleDatePickerVisibility}>*/}
      {/*<View>*/}
      {/*  <TouchableWithoutFeedback>*/}
      {/*    <View >*/}

      {/*    </View>*/}
      {/*  </TouchableWithoutFeedback>*/}
      {/*</View>*/}
      {/*</TouchableWithoutFeedback>*/}
      {/*</Modal>*/}
      {/*<When condition={isDatePickerVisible}>*/}
      {/*  <View ref={ref} className="absolute left-4 top-24 rounded-2xl bg-white">*/}

      {/*  </View>*/}
      {/*</When>*/}
    </BlockContainer>
  );
};
