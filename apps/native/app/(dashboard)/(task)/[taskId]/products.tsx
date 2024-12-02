import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Platform, Text, View } from "react-native";

import { api, productsAtom, useRecoilArray } from "@digitask/shared-lib";
import { Block, Button, Modal, Table, cn, useModalRef } from "@mdreal/ui-kit";
import { useMutation } from "@tanstack/react-query";

export default function ListAddedSpecificTaskProducts() {
  const modalRef = useModalRef();
  const router = useRouter();
  const { taskId } = useLocalSearchParams() as { taskId: string };
  const [products, controls] = useRecoilArray(productsAtom);

  const bulkUploadProducts = useMutation({
    mutationFn: api.services.warehouse.items.$bulkCreate
  });

  const newProduct = () => {
    router.push({ pathname: `/(task)/[taskId]/add-product`, params: { taskId } });
  };

  const handleUploadProducts = async () => {
    await bulkUploadProducts.mutateAsync(
      products.map(product => ({
        task: product.task,
        count: +product.count,
        item: product.item!.id,
        is_tv: product.type === "tv",
        is_internet: product.type === "internet",
        is_voice: product.type === "voice"
      }))
    );
    controls.clear();
    router.back();
  };

  useEffect(() => {
    if (products.length === 0) {
      newProduct();
    }
  }, [products]);

  const onConfirm = () => {
    modalRef.current?.close();
    controls.clear();
    router.back();
  };

  const onCancel = () => {
    modalRef.current?.close();
  };

  return (
    <Block className={cn("flex justify-between gap-4 py-4", Platform.select({ ios: "h-5/6", android: "h-full" }))}>
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
      </Block.Scroll>

      <View className="px-4">
        <Button onClick={newProduct}>
          <Text className="text-white">Yeni məhsul əlavə et</Text>
        </Button>
      </View>

      <View className="px-4">
        <Button onClick={handleUploadProducts}>
          <Text className="text-white">Məhsulları yadda saxla</Text>
        </Button>
      </View>

      <Modal ref={modalRef} type="popup" defaultHeight={250}>
        <View className="h-28 rounded-2xl bg-white p-4">
          <Text>Çıxmaq istədiyinizdə məhsullar silinəcək. Əminsiniz?</Text>
          <View className="flex flex-row gap-4">
            <Button variant="danger" className="flex-1" onClick={onConfirm}>
              <Text className="text-center text-white">Hə</Text>
            </Button>
            <Button variant="secondary" className="flex-1" onClick={onCancel}>
              <Text className="text-primary text-center">Yox</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </Block>
  );
}
