import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { RouterProvider } from "react-router";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { SWRConfig } from "swr";
import { fetcher } from "@/api/axiosInstance";
import { router } from "./routes/AppRoutes";
import { theme } from "./theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ColorSchemeScript defaultColorScheme="light" />
    <MantineProvider theme={theme} defaultColorScheme="light">
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: true,
          shouldRetryOnError: false,
        }}
      >
        <RouterProvider router={router} />
      </SWRConfig>
    </MantineProvider>
  </StrictMode>,
);
