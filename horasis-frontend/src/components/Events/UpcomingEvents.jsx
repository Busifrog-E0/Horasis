import { useEffect, useState } from 'react'
import { useAuth } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import Button from '../ui/Button'
import { getItem } from '../../constants/operations'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import { getDateInWordsFormat, gettimenow, relativeTime } from '../../utils/date'
import Spinner from '../ui/Spinner'
import EmptyMembers from '../Common/EmptyMembers'
import arrowforwhite from '../../assets/icons/arrowforwhite.svg'
import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/icons/avatar.svg'

const UpcomingEvents = () => {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [events, setEvents] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const navigate = useNavigate()
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 1,
		Keyword: '',
	})

	const api = 'events'

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getAllActivities = (tempEvents) => {
		getData(`${api}?&${jsonToQuery(filters)}`, tempEvents, setEvents)
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
		getAllActivities(initialRender ? [] : events)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (events.length > 0) hasAnyLeft(`${api}`, events)
	}, [events])

	useEffect(() => {
		fetch()
	}, [filters])
	return (
		<div className='bg-system-secondary-bg rounded-lg'>
			<div className='flex items-center justify-between gap-2 my-1 px-5 py-2'>
				<h4 className='font-semibold text-xl text-system-primary-text'>Upcoming Event</h4>
				{/* arrow cursor-pointer */}
			</div>
			{isLoading ? (
				<div className='my-10'>
					<Spinner />
				</div>
			) : (
				<>
					{events.length > 0 ? (
						<>
							{events.map((item) => {
								return (
									<div className='bg-system-secondary-bg rounded-lg mt-3 ' key={item.DocId}>
										<div className='w-full h-72 aspect-square overflow-hidden rounded-lg relative'>
											<div className='absolute bg-black/40 h-full w-full flex items-start justify-end p-4'>
												<div className='text-system-secondary-bg font-medium text-right w-1/2 text-lg flex justify-end items-end gap-4'>
													{item.EventName}

													<img
														src={arrowforwhite}
														alt=''
														className='h-7 cursor-pointer'
														onClick={() => navigate(`/Events/${item.DocId}`)}
													/>
												</div>
											</div>
											<img src={item.CoverPicture} className='object-cover h-full w-full' />
										</div>
										<div className='px-8 py-4'>
											<div className='flex items-start gap-2'>
												{item.UserDetails?.ProfilePicture ? (
													<>
														<img
															className={` rounded-full h-10 w-10 object-cover`}
															src={item.UserDetails?.ProfilePicture}
															alt='Rounded avatar'
														/>
													</>
												) : (
													<>
														<img className={` rounded-full h-10 w-10 object-cover`} src={avatar} alt='Rounded avatar' />
													</>
												)}

												<div className='flex-1'>
													<div className='flex items-start justify-between gap-10'>
														<div className='flex  flex-col gap-1'>
															<h1 className={`font-semibold text-system-primary-accent mt-1`}>
																{item.UserDetails?.FullName}
															</h1>
															{/* <h4 className='text-system-primary-text text-md'>Updated their photo</h4> */}
														</div>
														<h4 className={`font-medium text-sm text-brand-gray-dim`}>{relativeTime(item.CreatedIndex)}</h4>
													</div>
												</div>
											</div>
											<p className='text-system-secondary-text whitespace-pre-line mt-4'>{item.Description}</p>
										</div>
										{/* <div className='p-1 px-4'>
											<h4 className='text-base font-semibold text-system-primary-text mb-2 leading-6'>{item.Name}</h4>
											<div className='flex flex-wrap items-center gap-x-2'>
												<h4 className='text-xs text-brand-gray-dim'>{item.Type} Event</h4>
												<h4 className='tetx-xs text-brand-gray-dim'>•</h4>
												<h4 className='text-xs text-brand-gray-dim'>{item.NoOfMembers} Participants</h4>
											</div>
										</div>
										<div className='p-1 px-4'>
											<h4 className='text-xs text-brand-gray-dim'>When</h4>
											<h4 className='text-base text-system-primary-text mb-2 leading-6'>
												{getDateInWordsFormat(new Date(item.Date))} {gettimenow(new Date(item.StartTime))}
											</h4>
										</div>
										<div className='p-1 px-4'>
											<h4 className='text-base text-brand-gray-dim'>About the event</h4>
											<h4 className='text-sm text-system-primary-text mb-2'>{item.Description}</h4>
										</div>
										<div className='flex items-center justify-center pb-4'>
											<Button variant='outline'>Register</Button>
										</div> */}
									</div>
								)
							})}
						</>
					) : (
						<>
							<EmptyMembers emptyText={'No upcoming  events'} />
						</>
					)}
				</>
			)}
			{/* <div className='bg-system-secondary-bg rounded-lg mt-3 border border-system-file-border'>
				<div className='h-44 overflow-hidden rounded-t-lg'>
					<img
						src='https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain'
						className='object-cover h-full w-full'
					/>
				</div>
				<div className='p-2 pt-5'>
					<h4 className='text-base font-semibold text-system-primary-text mb-2 leading-6'>Horasis Meeting </h4>
					<div className='flex flex-wrap items-center gap-x-2'>
						<h4 className='text-xs text-brand-gray-dim'>Virtual Event</h4>
						<h4 className='tetx-xs text-brand-gray-dim'>•</h4>
						<h4 className='text-xs text-brand-gray-dim'>104 Participants</h4>
					</div>
				</div>
				<div className='p-2 pt-4'>
					<h4 className='text-xs text-brand-gray-dim'>When</h4>
					<h4 className='text-base text-system-primary-text mb-2 leading-6'>29 January 2024 19:30</h4>
				</div>
				<div className='p-2 pt-0'>
					<h4 className='text-base text-brand-gray-dim'>About the event</h4>
					<h4 className='text-sm text-system-primary-text mb-2 mt-3'>
						Horasis Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
						et dolore magna aliqua. Ut enim ad minim veniam.
					</h4>
				</div>
				<div className='flex items-center justify-center pb-4'>
					<Button variant='outline'>Register</Button>
				</div>
			</div> */}
		</div>
	)
}

export default UpcomingEvents
