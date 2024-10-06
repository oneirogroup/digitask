import { Block, Table, TableRef, useTableControls } from "@oneiro/ui-kit";
import { useMutation } from "@tanstack/react-query";

import { DateRange, RangePicker } from "../../components/date-time-picker";

export default function Performance() {
  const tableControls = useTableControls<TableRef>();

  const rangeTableMutation = useMutation({
    mutationKey: ["performance/range-table"],
    mutationFn: (range: DateRange) => new Promise<never[]>(resolve => setTimeout(resolve, 1500, [])),
    onSuccess(data) {
      console.log(data);
    }
  });

  return (
    <Block className="relative p-4">
      <RangePicker onChange={range => rangeTableMutation.mutate(range)} />

      <Table ref={tableControls.ref} />
    </Block>
  );
}
