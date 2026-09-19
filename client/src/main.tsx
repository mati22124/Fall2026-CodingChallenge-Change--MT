import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={{ primaryColor: "blue", primaryShade: 5, defaultRadius: "md" }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);


// tried to keep this as flat as possible, as simple as possible using claude code
// I think that I definitely could have been more involved in the development 
// and structure of the app, but I also think I was able to create a polished,
// simple, and functional app that meets the requirements of the project in a short
// amount of time. I definitely think the structure of the app is clean as well.