import React, { useState, useRef, useEffect, useContext } from 'react'
import { relativeTime } from '../../utils/date'
import DropdownMenu from '../ui/DropdownMenu'
import AlertDetailsItem from './AlertDetailsItem'
import { getItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import Spinner from '../ui/Spinner'

const AlertList = () => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef(null)

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const { currentUserData, updateCurrentUser } = useContext(AuthContext)
	const toast = useToast()

	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [notifications, setNotifications] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 2,
		Keyword: '',
	})
	const api = `users/${currentUserData.CurrentUser.UserId}/notifications`

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getSingleNotification = (notification,actionType) => {
		getItem(
			`${api}/${notification.DocId}`,
			(result) => {
				if (actionType === 'REMOVE') {
					setNotifications(notifications.filter((singleNotification) => singleNotification.DocId !== notification.DocId))
				} else if (actionType === 'UPDATE') {
					setNotifications(notifications.map((singleNotification) => (singleNotification.DocId === notification.DocId ? { ...singleNotification, ...result } : singleNotification)))
				}
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const getNotifications = (tempArr) => {
		getData(`${api}?&${jsonToQuery(filters)}`, tempArr, setNotifications)
	}
	const getData = (endpoint, tempData, setData) => {
		setLoadingCom(tempData, true)
		getItem(
			`${endpoint}&NextId=${getNextId(tempData)}`,
			(data) => {
				setData([...tempData, ...data])
				setLoadingCom(tempData, false)
			},
			(err) => {
				setLoadingCom(tempData, false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const hasAnyLeft = (endpoint, tempData) => {
		getItem(
			`${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...filters, Limit: 1 })}`,
			(data) => {
				if (data?.length > 0) {
					setPageDisabled(false)
				} else {
					setPageDisabled(true)
				}
			},
			(err) => {
				setPageDisabled(true)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const fetchData = (initialRender = false) => {
		getNotifications(initialRender ? [] : notifications)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (notifications.length > 0) hasAnyLeft(`${api}`, notifications)
	}, [notifications])

	useEffect(() => {
		fetch()
	}, [filters, isOpen])

	return (
		<>
			<div className='relative inline-block text-left ' ref={dropdownRef}>
				<button
					type='button'
					className='inline-flex justify-center rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim'
					onClick={() => setIsOpen(!isOpen)}>
					Notifications
				</button>
				{isOpen && (
					<div className='overflow-hidden origin-top-right absolute z-[999] right-0 mt-2 w-80 lg:w-96 rounded-md shadow-lg bg-system-secondary-bg ring-1 ring-black ring-opacity-5'>
						<div className='bg-system-primary-accent p-3 px-5'>
							<p className='text-brand-secondary text-md'>Notifications</p>
						</div>
						<div
							className='max-h-96 overflow-y-auto'
							role='menu'
							aria-orientation='vertical'
							aria-labelledby='options-menu'>
							{notifications.length > 0 &&
								notifications.map((notification) => {
									return <AlertDetailsItem notification={notification} key={notification.DocId} setIsOpen={setIsOpen} getSingleNotification={getSingleNotification} />
								})}
							{/* <AlertDetailsItem /> */}
						</div>

						{isLoadingMore && (
							<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
								<Spinner />
							</div>
						)}
						{!pageDisabled && (
							<div
								onClick={() => {
									fetchMore()
								}}
								className='flex flex-row justify-center mt-2 mb-2'>
								<div className='cursor-pointer flex items-center gap-2'>
									<h4 className='text-sm font-medium text-system-primary-accent'>Load more messages</h4>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	)
}

export default AlertList
