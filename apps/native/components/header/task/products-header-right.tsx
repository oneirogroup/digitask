import { useGlobalSearchParams, useRouter } from "expo-router";
import { FC, useEffect } from "react";
import { Alert, Pressable, View } from "react-native";

import { api, productsAtom, useRecoilArray } from "@digitask/shared-lib";
import { Icon, When } from "@mdreal/ui-kit";
import { useMutation } from "@tanstack/react-query";

import { palette } from "../../../../../palette";
import { useMatchPathOnRoute } from "../../../hooks/use-match-path-on-route";

export const TaskAddAttachmentHeaderRight: FC = () => {
  const [products, controls] = useRecoilArray(productsAtom);
  const { taskId, taskType } = useGlobalSearchParams() as { taskId: string; taskType: "problem" | "connection" };
  const router = useRouter();

  useMatchPathOnRoute(
    /\/products$/,
    () => {
      if (products.length) {
        Alert.alert("Çıxmaq istədiyinizə əminsiniz?", "Çıxmaq istədiyinizdə məhsullar silinəcək. ", [
          { text: "Xeyr", style: "cancel" },
          {
            text: "Bəli",
            onPress: () => {
              controls.clear();
              router.back();
            }
          }
        ]);
        return true;
      }
    },
    [products]
  );

  const bulkUploadProducts = useMutation({
    mutationFn: api.services.warehouse.items.$bulkCreate
  });

  const newProduct = () => {
    router.push({
      pathname: `/(dashboard)/(task)/[taskId]/task-type/[taskType]/add-product`,
      params: { taskId, taskType }
    });
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
    !products.length && newProduct();
  }, [products]);

  return (
    <View className="flex flex-row gap-2">
      <Pressable onPress={newProduct}>
        <Icon name="plus" variables={{ stroke: palette.primary["50"] }} />
      </Pressable>

      <When condition={!!products.length}>
        <Pressable onPress={handleUploadProducts}>
          <Icon name="save" variables={{ fill: palette.primary["50"] }} />
        </Pressable>
      </When>
    </View>
  );
};
