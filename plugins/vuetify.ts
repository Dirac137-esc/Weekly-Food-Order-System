// plugins/vuetify.ts

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import type { ThemeDefinition } from "vuetify";

const staticPrimaryColor = "#8C57FF";
const staticPrimaryDarkenColor = "#7E4EE6";

const customThemes: Record<string, ThemeDefinition> = {
  light: {
    dark: false,
    colors: {
      // Primary colors
      primary: staticPrimaryColor,
      "on-primary": "#fff",
      "primary-darken-1": staticPrimaryDarkenColor,
      "primary-container": "#E8DDFF",
      "on-primary-container": "#21005D",
      
      // Secondary colors
      secondary: "#8A8D93",
      "secondary-darken-1": "#7C7F84",
      "on-secondary": "#fff",
      "secondary-container": "#E2E0E7",
      "on-secondary-container": "#1D1B20",
      
      // Tertiary colors
      tertiary: "#7D5260",
      "on-tertiary": "#FFFFFF",
      "tertiary-container": "#FFD8E4",
      "on-tertiary-container": "#31111D",
      
      // Status colors
      success: "#56CA00",
      "success-darken-1": "#4DB600",
      "on-success": "#fff",
      "success-container": "#A6F779",
      "on-success-container": "#0F2000",
      
      info: "#16B1FF",
      "info-darken-1": "#149FE6",
      "on-info": "#fff",
      "info-container": "#CCE8FF",
      "on-info-container": "#001E30",
      
      warning: "#FFB400",
      "warning-darken-1": "#E6A200",
      "on-warning": "#fff",
      "warning-container": "#FFCC02",
      "on-warning-container": "#261900",
      
      error: "#FF4C51",
      "error-darken-1": "#E64449",
      "on-error": "#fff",
      "error-container": "#FFDAD6",
      "on-error-container": "#410002",
      
      // Background and surface
      background: "#f4f5fa",
      "on-background": "#2E263D",
      surface: "#fff",
      "on-surface": "#2E263D",
      "surface-variant": "#E7E0EC",
      "on-surface-variant": "#49454F",
      "surface-container": "#F3F0F4",
      "surface-container-high": "#EDE8ED",
      "surface-container-highest": "#E8E2E7",
      "surface-container-low": "#F9F5F9",
      "surface-container-lowest": "#FFFFFF",
      "surface-bright": "#FDF8FD",
      "surface-dim": "#DED8DD",
      "surface-tint": staticPrimaryColor,
      
      // Outline colors
      outline: "#79747E",
      "outline-variant": "#CAC4D0",
      
      // Inverse colors
      "inverse-surface": "#313033",
      "inverse-on-surface": "#F4EFF4",
      "inverse-primary": "#D0BCFF",
      
      // Scrim and shadow
      scrim: "#000000",
      shadow: "#000000",
      
      // Your custom grey scale
      "grey-50": "#FAFAFA",
      "grey-100": "#F5F5F5",
      "grey-200": "#EEEEEE",
      "grey-300": "#E0E0E0",
      "grey-400": "#BDBDBD",
      "grey-500": "#9E9E9E",
      "grey-600": "#757575",
      "grey-700": "#616161",
      "grey-800": "#424242",
      "grey-900": "#212121",
      
      // Custom theme colors
      "perfect-scrollbar-thumb": "#dbdade",
      "skin-bordered-background": "#fff",
      "skin-bordered-surface": "#fff",
      "expansion-panel-text-custom-bg": "#fafafa",
      "track-bg": "#F0F2F8",
      "chat-bg": "#F7F6FA",
    },
    variables: {
      "code-color": "#d400ff",
      "overlay-scrim-background": "#2E263D",
      "tooltip-background": "#1A0E33",
      "overlay-scrim-opacity": 0.5,
      "hover-opacity": 0.04,
      "focus-opacity": 0.1,
      "selected-opacity": 0.08,
      "activated-opacity": 0.16,
      "pressed-opacity": 0.14,
      "dragged-opacity": 0.1,
      "disabled-opacity": 0.4,
      "border-color": "#2E263D",
      "border-opacity": 0.12,
      "table-header-color": "#F6F7FB",
      "high-emphasis-opacity": 0.9,
      "medium-emphasis-opacity": 0.7,
      "shadow-key-umbra-color": "#2E263D",
      "shadow-xs-opacity": "0.16",
      "shadow-sm-opacity": "0.18",
      "shadow-md-opacity": "0.20",
      "shadow-lg-opacity": "0.22",
      "shadow-xl-opacity": "0.24",
    },
  },

  dark: {
    dark: true,
    colors: {
      // Primary colors
      primary: staticPrimaryColor,
      "on-primary": "#fff",
      "primary-darken-1": staticPrimaryDarkenColor,
      "primary-container": "#4F378B",
      "on-primary-container": "#EADDFF",
      
      // Secondary colors
      secondary: "#8A8D93",
      "secondary-darken-1": "#7C7F84",
      "on-secondary": "#fff",
      "secondary-container": "#4A4458",
      "on-secondary-container": "#E2E0E7",
      
      // Tertiary colors
      tertiary: "#EFB8C8",
      "on-tertiary": "#492532",
      "tertiary-container": "#633B48",
      "on-tertiary-container": "#FFD8E4",
      
      // Status colors
      success: "#56CA00",
      "success-darken-1": "#4DB600",
      "on-success": "#fff",
      "success-container": "#0F2000",
      "on-success-container": "#A6F779",
      
      info: "#16B1FF",
      "info-darken-1": "#149FE6",
      "on-info": "#fff",
      "info-container": "#001E30",
      "on-info-container": "#CCE8FF",
      
      warning: "#FFB400",
      "warning-darken-1": "#E6A200",
      "on-warning": "#fff",
      "warning-container": "#261900",
      "on-warning-container": "#FFCC02",
      
      error: "#FF4C51",
      "error-darken-1": "#E64449",
      "on-error": "#fff",
      "error-container": "#410002",
      "on-error-container": "#FFDAD6",
      
      // Background and surface
      background: "#28243D",
      "on-background": "#E7E3FC",
      surface: "#312d4b",
      "on-surface": "#E7E3FC",
      "surface-variant": "#49454F",
      "on-surface-variant": "#CAC4D0",
      "surface-container": "#1D1B20",
      "surface-container-high": "#272529",
      "surface-container-highest": "#322F35",
      "surface-container-low": "#16151A",
      "surface-container-lowest": "#0F0E13",
      "surface-bright": "#3B383E",
      "surface-dim": "#16151A",
      "surface-tint": staticPrimaryColor,
      
      // Outline colors
      outline: "#938F99",
      "outline-variant": "#49454F",
      
      // Inverse colors
      "inverse-surface": "#E6E1E5",
      "inverse-on-surface": "#313033",
      "inverse-primary": "#6750A4",
      
      // Scrim and shadow
      scrim: "#000000",
      shadow: "#000000",
      
      // Your custom grey scale (adapted for dark)
      "grey-50": "#2A2E42",
      "grey-100": "#2F3349",
      "grey-200": "#4A5072",
      "grey-300": "#5E6692",
      "grey-400": "#7983BB",
      "grey-500": "#8692D0",
      "grey-600": "#AAB3DE",
      "grey-700": "#B6BEE3",
      "grey-800": "#CFD3EC",
      "grey-900": "#E7E9F6",
      
      // Custom theme colors
      "perfect-scrollbar-thumb": "#4a5072",
      "skin-bordered-background": "#312d4b",
      "skin-bordered-surface": "#312d4b",
      "expansion-panel-text-custom-bg": "#373350",
      "track-bg": "#474360",
      "chat-bg": "#373452",
    },
    variables: {
      "code-color": "#d400ff",
      "overlay-scrim-background": "#312D4B",
      "tooltip-background": "#F7F4FF",
      "overlay-scrim-opacity": 0.5,
      "hover-opacity": 0.04,
      "focus-opacity": 0.1,
      "selected-opacity": 0.08,
      "activated-opacity": 0.16,
      "pressed-opacity": 0.14,
      "disabled-opacity": 0.4,
      "dragged-opacity": 0.1,
      "border-color": "#E7E3FC",
      "border-opacity": 0.12,
      "table-header-color": "#3D3759",
      "high-emphasis-opacity": 0.9,
      "medium-emphasis-opacity": 0.7,
      "shadow-key-umbra-color": "#131120",
      "shadow-xs-opacity": "0.20",
      "shadow-sm-opacity": "0.22",
      "shadow-md-opacity": "0.24",
      "shadow-lg-opacity": "0.26",
      "shadow-xl-opacity": "0.28",
    },
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    blueprint: md3,
    theme: {
      defaultTheme: "light",
      themes: customThemes,
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: { mdi },
    },
  });

  app.vueApp.use(vuetify);
  app.provide("vuetify", vuetify);
});