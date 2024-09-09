import { Text, View } from "react-native";

import { Button } from "@oneiro/ui-kit/native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <Button onPress={() => console.log("Pressed")}>
        <Text>I'm button</Text>
      </Button>
    </View>
  );
}
