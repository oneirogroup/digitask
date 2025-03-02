import type { FC } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import {
  type AddResourceSchema,
  Backend,
  api,
  fields,
  selectedWarehouseIdAtom,
  useRecoilQuery,
  warehouseAtom
} from "@digitask/shared-lib";
import { Select } from "@mdreal/ui-kit";

export const Warehouse: FC = () => {
  const setWarehouseId = useSetRecoilState(selectedWarehouseIdAtom);
  const warehouses = useRecoilValue(warehouseAtom);
  useRecoilQuery(warehouseAtom, {
    queryKey: [fields.warehouse],
    queryFn: () => api.services.warehouse.$getAll
  });

  return (
    <Select.Controlled<Backend.Warehouse, AddResourceSchema>
      name="warehouse"
      label="Anbarı seçin..."
      valueExtractor={warehouse => warehouse.id}
      onChange={warehouse => {
        setWarehouseId(warehouse?.id || null);
      }}
    >
      {warehouses.map(warehouse => (
        <Select.Option key={warehouse.id} label={warehouse.name} value={warehouse} />
      ))}
    </Select.Controlled>
  );
};
