import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './utils/AuthProvider'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react'
import { AgoraRTMProvider } from './rtm/AgoraRTMProvider.jsx'
AgoraRTC.setLogLevel(3)
const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })

const Auth = () => (
	<AuthProvider>
		<App />
	</AuthProvider>
)

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AgoraRTCProvider client={client}>
			<AgoraRTMProvider>
				<Auth />
			</AgoraRTMProvider>
		</AgoraRTCProvider>
	</React.StrictMode>
)
