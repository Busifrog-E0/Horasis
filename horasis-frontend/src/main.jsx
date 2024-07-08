import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { AuthProvider } from "./utils/AuthProvider";

const Auth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth />
  </React.StrictMode>
)
