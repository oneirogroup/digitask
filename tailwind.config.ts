import { defineConfig } from "@oneiro/ui-kit/server";

import { palette } from "./palette";

export const baseConfig = defineConfig({
  colors(colors) {
    return {
      primary: { DEFAULT: colors.primary["60"] },
      secondary: { DEFAULT: colors.secondary["60"] },
      success: { DEFAULT: colors.success["60"] },
      error: { DEFAULT: colors.error["60"] },
      neutral: { DEFAULT: colors.neutral["60"] },
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
