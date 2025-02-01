import "./loadInitialData";

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

import queryClient from "./queryClient";
import registerHljsLanguages from "./hljs/register-languages";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

import router from "./routes";
import theme from "./theme";

registerHljsLanguages();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ColorModeScript initialColorMode={theme.initialColorMode} />
        <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18n}>
                    <RouterProvider router={router} />                    
                </I18nextProvider>
            </QueryClientProvider>
        </ChakraProvider>
    </React.StrictMode>
);
