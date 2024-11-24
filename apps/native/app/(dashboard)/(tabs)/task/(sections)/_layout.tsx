import { palette } from "../../../../../../../palette";
import { NavbarTopTabs } from "../../../../../components/navbar/top-tabs";

export default function DashboardSectionsLayout() {
  return (
    <NavbarTopTabs>
      <NavbarTopTabs.Screen name="connections" options={{ title: "Qosulmalar" }} />
      <NavbarTopTabs.Screen name="problems" options={{ title: "Problemler" }} />
    </NavbarTopTabs>
  );
}
