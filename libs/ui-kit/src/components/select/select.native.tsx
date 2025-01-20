import type { FieldValues } from "react-hook-form";
import { Platform } from "react-native";

import { useWithController } from "../../hoc/with-controller/use-with-controller";
import type { ControlledBaseProps } from "../../hoc/with-controller/with-controller.types";
import { Option } from "./components/option.native";
import { SelectAndroid } from "./select.android";
import { SelectIOS } from "./select.ios";
import type { SelectComponent, SelectProps } from "./select.types";

export const Select = Platform.select({
  android: SelectAndroid,
  ios: SelectIOS
}) as SelectComponent;
Select.Option = Option;
Select.Controlled = <TValue, TValues extends FieldValues = FieldValues>(
  props: SelectProps<TValue> & ControlledBaseProps<TValue, TValues>
) => useWithController<TValue, TValues, SelectProps<TValue>>(props, Select);
