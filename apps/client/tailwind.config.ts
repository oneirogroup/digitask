import { defineConfig } from "@oneiro/ui-kit/server";

export default defineConfig({
  content: ["./{components,app}/**/*.{js,ts,jsx,tsx,mdx}"],
  extra: { important: "html", presets: [require("nativewind/preset")] }
});
