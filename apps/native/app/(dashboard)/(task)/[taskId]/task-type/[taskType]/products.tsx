import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { productsAtom, useRecoilArray } from "@digitask/shared-lib";
import { Block, Button, Modal, Table, useModalRef } from "@mdreal/ui-kit";

export default function ListAddedSpecificTaskProducts() {
  const modalRef = useModalRef();
  const router = useRouter();
  const [products, controls] = useRecoilArray(productsAtom);

  const onConfirm = () => {
    modalRef.current?.close();
    controls.clear();
    router.back();
  };

  const onCancel = () => {
    modalRef.current?.close();
  };

  return (
    <Block className="flex justify-between gap-4 py-4">
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
