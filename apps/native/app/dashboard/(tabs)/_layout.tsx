import { Tabs } from "expo-router";

import { Icon } from "@mdreal/ui-kit";

import { HeaderLeft } from "../../../components/header/dashboard-layout/header-left";
import { HeaderRight } from "../../../components/header/dashboard-layout/header-right";

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        unmountOnBlur: true,
        headerTitleStyle: { display: "none" },
        headerLeft: () => <HeaderLeft title="Xoş gəlmisən!" />,
        headerRight: () => <HeaderRight />
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana səhifə",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="home" state={focused && "active"} variables={{ fill: color }} />
          )
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: "Performans",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="monitor" state={focused && "active"} variables={{ fill: color }} />
          )
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: "Tapşırıq",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="task" state={focused && "active"} variables={{ fill: color }} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="profile" state={focused && "active"} variables={{ fill: color }} />
          )
        }}
      />
    </Tabs>
  );
}
