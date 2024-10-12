import { MaterialTopTabs } from "../../../components/top-navbar-tabs";

export default function DashboardLayout() {
  return (
    <MaterialTopTabs screenOptions={{ tabBarContentContainerStyle: { justifyContent: "space-evenly" } }}>
      <MaterialTopTabs.Screen name="connections" options={{ title: "Qosulmalar" }} />
      <MaterialTopTabs.Screen name="problems" options={{ title: "Problemler" }} />
    </MaterialTopTabs>
  );
}
