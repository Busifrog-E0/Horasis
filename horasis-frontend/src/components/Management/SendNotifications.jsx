import { useState } from 'react'
import Input from '../ui/Input'
import TextArea from '../ui/TextArea'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { SendNotificationSchema } from '../../utils/schema/management/send-notification'
import usePostData from '../../hooks/usePostData'
import { useToast } from '../Toast/ToastService'

const MAX_CHAR_LIMIT = 250

export default function SendNotifications() {
	const [notificationsData, setNotificationsData] = useState({ Title: '', Description: '' })
	const [errorObj, setErrorObj] = useState({})
	const toast = useToast()
	const { postData: postSendNotification, isLoading } = usePostData()

	const sendNotification = () => {
		postSendNotification({
			endpoint: 'admin/sendNotification/All',
			payload: notificationsData,
			onsuccess: (result) => {
				toast.open('success', 'Successful!', 'Notification has been send successfully')
			},
			onerror: (result) => {
				toast.open('error', 'Failed!', 'Failed to send notification')
			},
		})
	}

	const validate = (callback) => {
		const { error, warning } = SendNotificationSchema.validate(notificationsData, {
			abortEarly: false,
			stripUnknown: true,
		})
		if (error && error.details) {
			let obj = {}
			error.details.forEach((val) => (obj[val.context.key] = val.message))
			setErrorObj(obj)
		} else {
			setErrorObj({})
			if (callback) {
				callback()
			}
		}
	}

	const validateSingle = (value, key, callback) => {
		setNotificationsData({ ...notificationsData, ...value })
		const { error, warning } = SendNotificationSchema.extract(key).validate(value[key], {
			abortEarly: false,
			stripUnknown: true,
		})
		if (error && error.details) {
			let obj = {}
			error.details.forEach((val) => (obj[key] = val.message))
			setErrorObj(obj)
		} else {
			setErrorObj({})
			if (callback) {
				callback()
			}
		}
	}
	return (
		<div className='w-full h-full flex flex-col gap-4  bg-system-secondary-bg rounded-lg relative overflow-hidden'>
			{isLoading && (
				<div className='absolute top-0  z-10 left-0 bg-system-secondary-bg-transparent w-full h-full flex items-center justify-center'>
					<Spinner />
				</div>
			)}
		

			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Notification Content<span className='text-brand-red'>*</span>
				</h1>
				<div className='relative'>
					<TextArea
						rows={8}
						placeholder='Notification Content'
						width='full'
						variant='primary_outlined'
						value={notificationsData.Description}
						resizable={false}
						maxLength={MAX_CHAR_LIMIT}
						onChange={(e) => {
							if (e.target.value.length <= MAX_CHAR_LIMIT) {
								validateSingle({ ['Description']: e.target.value }, 'Description')
							}
						}}
					/>
					<p className='text-system-secondary-text absolute bottom-2 right-2'>
						{notificationsData.Description ? MAX_CHAR_LIMIT - notificationsData.Description.length : MAX_CHAR_LIMIT} /{' '}
						{MAX_CHAR_LIMIT}
					</p>
				</div>
				{errorObj['Description'] != undefined && <p className='text-brand-red m-0'>{errorObj['Description']}</p>}
			</div>
			<Button
				onClick={() => validate(() => sendNotification(notificationsData))}
				className='px-10 self-end justify-end'
				variant='black'
				disabled={Object.keys(errorObj).length > 0 ||  !notificationsData.Description}>
				Send Notification
			</Button>
		</div>
	)
}
