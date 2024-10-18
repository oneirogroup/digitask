import { Block } from "@oneiro/ui-kit";

import { NavbarTopTabs } from "../../../components/navbar/top-tabs";

export default function DashboardLayout() {
  return (
    <Block.Fade>
      <NavbarTopTabs screenOptions={{ tabBarContentContainerStyle: { justifyContent: "space-evenly" } }}>
        <NavbarTopTabs.Screen name="connections" options={{ title: "Qosulmalar" }} />
        <NavbarTopTabs.Screen name="problems" options={{ title: "Problemler" }} />
      </NavbarTopTabs>
    </Block.Fade>
  );
}
