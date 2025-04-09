import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './utils/AuthProvider'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react'
import { SuperAuthProvider } from './context/SuperAdmin/SuperAuthProvider.jsx'
import ErrorBoundary from './components/Common/ErrorBoundaries/ErrorBoundary.jsx'
import MyFallback from './components/Common/ErrorBoundaries/MyFallback.jsx'
AgoraRTC.setLogLevel(3)
const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })

const Auth = () => (
	<SuperAuthProvider>
		<AuthProvider>
			<App />
		</AuthProvider>
	</SuperAuthProvider>
)

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
	
			<AgoraRTCProvider client={client}>
				<Auth />
			</AgoraRTCProvider>

	</React.StrictMode>
)
