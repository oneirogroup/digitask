/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/forgot-password` | `/(auth)/sign-in` | `/(tabs)` | `/(tabs)/` | `/(tabs)/performance` | `/(tabs)/profile` | `/(tabs)/task` | `/_sitemap` | `/forgot-password` | `/performance` | `/profile` | `/sign-in` | `/task` | `/welcome`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
