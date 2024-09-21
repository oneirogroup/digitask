import { defineConfig } from "@oneiro/ui-kit/server";

const palette = {
  primary: {
    "10": "#053973",
    "20": "#064388",
    "30": "#064A96",
    "40": "#014FA7",
    "50": "#005ABF",
    "60": "#2B75CC",
    "70": "#5B96DB",
    "80": "#8BB8EC",
    "90": "#AED0F5",
    "95": "#D2E5FA",
    "99": "#E4EFFB"
  },
  secondary: {
    "10": "#705F07",
    "20": "#B49807",
    "30": "#C9AA08",
    "40": "#E5C208",
    "50": "#F8D004",
    "60": "#FFD600",
    "70": "#FFDB20",
    "80": "#FFE03E",
    "90": "#FFE76A",
    "95": "#FFF0A1",
    "99": "#FFF7CC"
  },
  success: {
    "10": "#002202",
    "20": "#003A06",
    "30": "#00530C",
    "40": "#006E13",
    "50": "#008B1B",
    "60": "#23B131",
    "70": "#36C43D",
    "80": "#57E156",
    "90": "#B8F1AC",
    "95": "#C9FFBD",
    "99": "#F6FFEF"
  },
  error: {
    "10": "#750606",
    "20": "#940707",
    "30": "#BB0707",
    "40": "#D60A0A",
    "50": "#EA0A0A",
    "60": "#FF5449",
    "70": "#FF897D",
    "80": "#FFB4AB",
    "90": "#FFDAD6",
    "95": "#FFEDEA",
    "99": "#FFFBFF"
  },
  neutral: {
    "10": "#000000",
    "20": "#2F3033",
    "30": "#2F3033",
    "40": "#5E5E62",
    "50": "#76777A",
    "60": "#909094",
    "70": "#ABABAF",
    "80": "#C7C6CA",
    "90": "#E3E2E6",
    "95": "#F1F0F4",
    "99": "#FDFBFF"
  }
};

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
    theme: {
      extend: {
        fontSize: {
          "1.5xl": "1.375rem"
        }
      }
    }
  }
});
