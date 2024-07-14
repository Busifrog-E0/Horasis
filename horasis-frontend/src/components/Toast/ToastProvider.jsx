import { useState } from 'react'
import ToastContext from './ToastService'

const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([])
	const open = (type, title, message, timeout = 2000) => {
		console.log('opened	')
		const id = Date.now()
		setToasts((toasts) => [...toasts, { id, type, title, message }])
		setTimeout(() => close(id), timeout)
	}

	const close = (id) => setToasts((toasts) => toasts.filter((toast) => toast.id !== id))

	return (
		<ToastContext.Provider value={{ open, close }}>
			{children}
			<div className='space-y-2 absolute bottom-4 right-4 transition-all'>
				{toasts.map(({ id, message, type, title }) => {
					return (
						<div key={id} className='relative'>
							{/* <button
								onClick={() => close(id)}
								className='absolute top-2 right-2 p-1 rounded-lg bg-gray-200/20 text-gray-800/60'>
								close
							</button> */}
							{type === 'error' && (
								<>
									<button
										onClick={() => close(id)}
										className='absolute top-2 right-2 p-1 rounded-lg bg-red-200/20 text-red-800/60'>
										close
									</button>
									<div
										className={`flex min-w-[400px] gap-2 bg-red-100 text-red-500 border border-red-500 p-4 rounded-lg shadow-lg`}>
										<div>
											<h3 className='font-bold'>{title}</h3>
											<p className='text-md'>{message}</p>
										</div>
									</div>
								</>
							)}
							{type === 'info' && (
								<>
									<button
										onClick={() => close(id)}
										className='absolute top-2 right-2 p-1 rounded-lg bg-blue-200/20 text-blue-800/60'>
										close
									</button>
									<div
										className={`flex min-w-[400px] gap-2 bg-blue-100 text-blue-500 border border-blue-500 p-4 rounded-lg shadow-lg`}>
										<div>
											<h3 className='font-bold'>{title}</h3>
											<p className='text-md'>{message}</p>
										</div>
									</div>
								</>
							)}
							{type === 'success' && (
								<>
									<button
										onClick={() => close(id)}
										className='absolute top-2 right-2 p-1 rounded-lg bg-green-200/20 text-green-800/60'>
										close
									</button>
									<div
										className={`flex min-w-[400px] gap-2 bg-green-100 text-green-700 border border-green-500 p-4 rounded-lg shadow-lg`}>
										<div>
											<h3 className='font-bold'>{title}</h3>
											<p className='text-md'>{message}</p>
										</div>
									</div>
								</>
							)}
							{type === 'warning' && (
								<>
									<button
										onClick={() => close(id)}
										className='absolute top-2 right-2 p-1 rounded-lg bg-yellow-200/20 text-yellow-800/60'>
										close
									</button>
									<div
										className={`flex min-w-[400px] gap-2 bg-yellow-100 text-yellow-700 border border-yellow-500 p-4 rounded-lg shadow-lg`}>
										<div>
											<h3 className='font-bold'>{title}</h3>
											<p className='text-md'>{message}</p>
										</div>
									</div>
								</>
							)}
						</div>
					)
				})}
			</div>
		</ToastContext.Provider>
	)
}

export default ToastProvider
