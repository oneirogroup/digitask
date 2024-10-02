import { defineConfig } from "@oneiro/ui-kit/server";

import { palette } from "./palette";

export const baseConfig = defineConfig({
  colors(colors) {
    return {
      primary: { DEFAULT: colors.primary["60"] },
      secondary: { DEFAULT: "" },
      success: { DEFAULT: "" },
      error: { DEFAULT: "" },
      neutral: { DEFAULT: "" },
      link: { DEFAULT: colors.primary["50"] }
    };
  },
  palette,
  extra: {
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        fontSize: {
          "1.5xl": "1.375rem"
        }
      }
    }
  }
});
