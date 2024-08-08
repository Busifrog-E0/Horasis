import React, { useState } from 'react'
import { relativeTime } from '../../utils/date'
import Button from '../../components/ui/Button'
import AlertContent from './Mentions/AlertContent'
import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/icons/avatar.svg'

const Alert = ({ notification, setIsOpen }) => {
	const [withAction, setWithAction] = useState(true)
	const navigate = useNavigate()


	if (notification.Type === 'ConnectionRequest') {
		return (
			<div
				className='p-3 px-5 border-b border-system-file-border hover:bg-system-primary-bg cursor-pointer'
				onClick={() => {
					navigate(notification.Link)
					setIsOpen(false)
				}}>
				<div className='flex items-start gap-2'>
					<img
						className='w-12 h-12 rounded-full'
						src='https://flowbite.com/docs/images/people/profile-picture-1.jpg'
						alt='Rounded avatar'
					/>

					<div className='flex-1 flex flex-col gap-1'>
						<h4 className='font-semibold text-base text-system-primary-accent'>John Smith</h4>
						<h4 className='text-sm font-normal text-system-primary-text'>
							<AlertContent Content={notification.Content} ContentLinks={notification.ContentLinks} />
						</h4>
						<div className='flex gap-2'>
							<Button size='xs' variant='black'>
								Accept
							</Button>
							<Button size='xs' variant='outline'>
								Reject
							</Button>
						</div>
					</div>
					<div>
						<h4 className='font-medium text-xs text-brand-gray-dim'>{relativeTime(new Date().getTime())}</h4>
					</div>
				</div>
			</div>
		)
	}
	return (
		<div
			className='p-3 px-5 border-b border-system-file-border cursor-pointer hover:bg-system-primary-bg'
			onClick={() => {
				navigate(notification.Link)
				setIsOpen(false)
			}}>
			<div className='flex items-start gap-2'>
					{notification?.UserDetails?.ProfilePicture ? (
					<img className='w-12 h-12 rounded-full object-cover' src={notification?.UserDetails?.ProfilePicture} alt='Rounded avatar' />
				) : (
					<img className='w-12 h-12 rounded-full object-cover' src={avatar} alt='Rounded avatar' />
				)}

				<div className='flex-1 flex flex-col gap-1'>
					<h4 className='font-semibold text-base text-system-primary-accent'>John Smith</h4>
					<h4 className='text-sm font-medium text-system-primary-text'>
						<AlertContent Content={notification.Content} ContentLinks={notification.ContentLinks} />
					</h4>
				</div>
				<div>
					<h4 className='font-medium text-xs text-brand-gray-dim'>{relativeTime(new Date().getTime())}</h4>
				</div>
			</div>
		</div>
	)
}

export default Alert
