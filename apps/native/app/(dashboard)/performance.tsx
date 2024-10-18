import { FC, useEffect } from "react";
import { Text } from "react-native";

import { Block, If, Table, cn } from "@oneiro/ui-kit";
import { useMutation } from "@tanstack/react-query";

import { DateRange, RangePicker } from "../../components/date-time-picker";
import { DateService } from "../../services/date-service";

const Loading: FC = () => <Text className="text-center">Loading...</Text>;

export default function Performance() {
  const {
    data: rangeTableData = [],
    isPending: isRangeTablePending,
    mutate: rangeTableMutate,
    isSuccess: isRangeTableSuccess,
    isError: isRangeTableError
  } = useMutation({
    mutationKey: ["performance/range-table"],
    mutationFn: (range: DateRange) =>
      new Promise<{ id: number; name: string; group: string; tasks: number }[]>(resolve =>
        setTimeout(
          resolve,
          1500,
          Array.from({ length: 100 }, (_, idx) => ({ id: idx + 1, name: "John Doe", tasks: (idx + 1) * 10 }))
        )
      ),
    onSuccess(data) {}
  });

  useEffect(() => {
    rangeTableMutate({ start: DateService.from(new Date()), end: DateService.from(new Date()) });
  }, []);

  return (
    <Block.Scroll className="relative flex max-h-full gap-4 p-4">
      <RangePicker onChange={range => rangeTableMutate(range)} />

      <Table>
        <Table.Header>
          <Table.Header.Cell name="name">
            <Text className="text-center">Name</Text>
          </Table.Header.Cell>
          <Table.Header.Cell name="group">
            <Text className="text-center">Group</Text>
          </Table.Header.Cell>
          <Table.Header.Cell name="tasks">
            <Text className="text-center">Tasks</Text>
          </Table.Header.Cell>
        </Table.Header>

        <Table.Body>
          <If condition={isRangeTablePending}>
            <If.Then>
              <Table.Row>
                <Table.Cell fullCellSpan>
                  <Loading />
                </Table.Cell>
              </Table.Row>
            </If.Then>

            <If.ElseIf condition={isRangeTableSuccess}>
              {rangeTableData.map(({ id, name, group, tasks }) => (
                <Table.Row key={id}>
                  <Table.Cell>
                    <Text className="text-center">{name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-center">{group}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-center">{tasks}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </If.ElseIf>

            <If.ElseIf condition={isRangeTableError}>
              <Table.Row fullRowSpan>
                <Table.Cell>
                  <Text>Error</Text>
                </Table.Cell>
              </Table.Row>
            </If.ElseIf>

            <If.Else>
              <Table.Row fullRowSpan>
                <Table.Cell fullCellSpan>
                  <Text>No data</Text>
                </Table.Cell>
              </Table.Row>
            </If.Else>
          </If>
        </Table.Body>
      </Table>
    </Block.Scroll>
  );
}
