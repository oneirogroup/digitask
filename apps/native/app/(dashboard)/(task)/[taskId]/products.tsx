import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

import { api, productsAtom, useRecoilArray } from "@digitask/shared-lib";
import { Block, Button, Table } from "@mdreal/ui-kit";
import { useMutation } from "@tanstack/react-query";

export default function ListAddedSpecificTaskProducts() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams() as { taskId: string };
  const [products, controls] = useRecoilArray(productsAtom);

  const bulkUploadProducts = useMutation({
    mutationFn: api.services.warehouse.items.$bulkCreate
  });

  const newProduct = (editId?: number) => {
    const pathname = editId ? `/(task)/[taskId]/add-product?editId=[editId]` : `/(task)/[taskId]/add-product`;
    router.push({ pathname, params: { taskId, editId } });
  };

  const handleUploadProducts = async () => {
    await bulkUploadProducts.mutateAsync(
      products.map(product => ({ task: product.task, count: +product.count, item: product.item!.id }))
    );
    router.back();
  };

  useEffect(() => {
    if (products.length === 0) {
      newProduct();
    }
  }, [products]);

  return (
    <Block className="flex h-5/6 justify-between">
      <Block.Scroll>
        <Table stickyHeader>
          <Table.Header className="bg-primary rounded-t-2xl px-4 py-3">
            <Table.Header.Cell name="warehouse">
              <Text className="text-white">Anbar</Text>
            </Table.Header.Cell>
            <Table.Header.Cell name="warehouse-item">
              <Text className="text-white">Məhsul</Text>
            </Table.Header.Cell>
            <Table.Header.Cell name="count">
              <Text className="text-white">Sayı</Text>
            </Table.Header.Cell>
            <Table.Header.Cell name="$actions" />
          </Table.Header>
          <Table.Body>
            {products.map(product => (
              <Table.Row key={product.id} className="items-center rounded-b-2xl bg-white px-2 py-4">
                <Table.Cell>
                  <Text className="text-center">{product.warehouse?.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text className="text-center">{product.item?.equipment_name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text className="text-center">{product.count}</Text>
                </Table.Cell>
                <Table.Cell>
                  <View className="flex gap-2">
                    {/*<Button onClick={() => newProduct(product.id)}>*/}
                    {/*  <Text className="text-white">Düzəliş</Text>*/}
                    {/*</Button>*/}
                    <Button onClick={() => controls.removeItem(product)}>
                      <Text className="text-white">Sil</Text>
                    </Button>
                  </View>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <Button className="mt-4 p-3" onClick={() => newProduct()}>
          <Text className="text-white">Yeni məhsul əlavə et</Text>
        </Button>
      </Block.Scroll>

      <Button className="p-3" onClick={handleUploadProducts}>
        <Text className="text-white">Məhsulları yadda saxla</Text>
      </Button>
    </Block>
  );
}
