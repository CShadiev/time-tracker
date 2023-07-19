import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";

import { baseName } from "./app/config";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const container = document.getElementById("root")!;
const root = createRoot(container);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BrowserRouter basename={baseName}>
            <App />
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </CookiesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
