import type { FC } from "react";
import { useRecoilValue } from "recoil";

import {
  type AddResourceSchema,
  type Backend,
  api,
  fields,
  selectedWarehouseIdAtom,
  useRecoilQuery,
  warehouseItemsAtom
} from "@digitask/shared-lib";
import { Select } from "@mdreal/ui-kit";

export const WarehouseItem: FC = () => {
  const warehouseId = useRecoilValue(selectedWarehouseIdAtom);

  const warehouseItems = useRecoilValue(warehouseItemsAtom(warehouseId));
  useRecoilQuery(warehouseItemsAtom(warehouseId), {
    queryKey: [fields.warehouse.item, warehouseId],
    queryFn: () => api.services.warehouse.items.$get(warehouseId!),
    enabled: !!warehouseId
  });

  console.log("warehouse.id", warehouseId);
  console.log("warehouse.items", warehouseItems);

  return (
    <Select.Controlled<Backend.WarehouseItem, AddResourceSchema>
      name="item"
      label="Məhsulu seçin..."
      valueExtractor={val => val.id}
    >
      {warehouseItems.map(item => (
        <Select.Option key={item.id} label={item.equipment_name} value={item} />
      ))}
    </Select.Controlled>
  );
};
