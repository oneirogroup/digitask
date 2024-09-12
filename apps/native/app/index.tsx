import { Text } from "react-native";

import { Button, View } from "@oneiro/ui-kit";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <Button onClick={() => console.log("Clicked")} className="bg-red-500">
        <Text>I'm button</Text>
      </Button>
    </View>
  );
}
