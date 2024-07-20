// styles
import './style/global.css'
import './style/scrollbar.css'
import './style/chat.css'
// lib
import { RouterProvider } from 'react-router-dom'
// routes
import { router } from './router'
import { _storeData } from './utils/LocalStorage'
import { useEffect } from 'react'
import { AuthProvider } from './utils/AuthProvider'
import ToastProvider from './components/Toast/ToastProvider'
import FollowProvider from './context/Follow/FollowProvider'
import ThemeProvider from './utils/ThemeProvider'

function App() {
	useEffect(() => {
		const BreakWheel = () => {
			function handleNumberInputWheel(event) {
				// Prevent the default behavior of the mouse wheel (scrolling) only if the event occurred on a number input
				if (event.target.type === 'number') {
					event.preventDefault()
				}
			}
			// Add a non-passive event listener for the wheel event on all number input fields
			document.addEventListener('wheel', handleNumberInputWheel, { passive: false })
		}
		return BreakWheel()
	}, [])
	return (
		<ThemeProvider>
			<ToastProvider>
				<AuthProvider>
					<FollowProvider>
						<RouterProvider router={router} />
					</FollowProvider>
				</AuthProvider>
			</ToastProvider>
		</ThemeProvider>
	)
}

export default App
