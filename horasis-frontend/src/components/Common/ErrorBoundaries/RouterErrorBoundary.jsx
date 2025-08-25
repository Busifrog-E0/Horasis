import { useRouteError, useNavigate } from 'react-router-dom'
import Button from '../../ui/Button'

export default function RouterErrorBoundary() {
	const error = useRouteError()
	const navigate = useNavigate()

	const isDev = window.location.hostname === 'localhost' && window.location.port === '5173'

	console.error('RouterErrorBoundary caught an error:', error)

	return (
		<div className='min-h-[100svh] flex flex-col items-center justify-center bg-system-primary-bg px-4 py-8'>
			<div className='bg-white border  rounded-2xl p-10 max-w-lg w-full flex flex-col items-center'>
				{/* Error Title */}
				<h1 className='text-3xl font-medium text-system-primary-accent mb-4 text-center'>Oops! Something Went Wrong</h1>

				{/* Error Description */}
				<p className='text-md text-system-secondary-text mb-6 text-center'>
					We encountered an unexpected issue while loading this page.
				</p>

				{/* Development Error Details (Optional) */}
				{isDev && (
					<div className='bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm w-full'>
						<p>
							<span className='font-medium'>Error Details:</span>{' '}
							{error?.statusText || error?.message || 'Unknown error occurred.'}
						</p>
					</div>
				)}

				{/* Go Back Button */}
				<div className='w-full'>
					<Button width='full' variant='black' size='md' onClick={() => navigate(-1)}>Go Back</Button>
				</div>
			</div>
		</div>
	)
}
