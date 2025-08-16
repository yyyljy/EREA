import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";
import { Bounce, ToastContainer } from "react-toastify";
import { AvalancheWalletProvider } from "./AvalancheWalletProvider";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AvalancheWalletProvider network="fuji">
    <App />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme="light"
      transition={Bounce}
      toastClassName={"font-sans border-avax-blue/60"}
    />
    <Analytics />
  </AvalancheWalletProvider>
);
