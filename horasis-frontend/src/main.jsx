import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { AuthProvider } from "./utils/AuthProvider";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })

const Auth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AgoraRTCProvider client={client}>
      <Auth />
    </AgoraRTCProvider>
  </React.StrictMode>
)

