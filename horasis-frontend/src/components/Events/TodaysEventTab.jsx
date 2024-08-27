import { useEffect, useState } from 'react'
import { useAuth } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import Button from '../ui/Button'
import { getNextId } from '../../utils/URLParams'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getItem } from '../../constants/operations'
import { useNavigate } from 'react-router-dom'
import { getMonthsShort } from '../../utils/date'
import EmptyMembers from '../Common/EmptyMembers'

const TodaysEventTab = () => {
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
		<>
			{events.length < 0 ? (
				<>
					{events.map((item) => {
						return (
							<div className='bg-system-secondary-bg rounded-lg mt-3 overflow-hidden' key={item.DocId}>
								<div className='h-24 bg-system-secondary-bg relative overflow-hidden'>
									<img src={item.CoverPicture} className='object-cover h-full w-full' />
									<div className='absolute top-0 right-0 p-2'>
										<Button
											loading={false}
											onClick={() => {
												// handleLogin()
											}}
											variant='black'
											width='full'>
											Join Event
										</Button>
									</div>
								</div>
								<div className='p-3 px-2 grid grid-cols-5 gap-3 items-center'>
									<div className='p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex flex-col items-center h-full justify-center'>
										<h4 className='text-sm text-center text-system-primary-text m-0'>{getMonthsShort(item.Date)}</h4>
										<h4 className='font-semibold text-xl text-center text-system-primary-text m-0'>
											{new Date(item.Date).getDate()}
										</h4>
									</div>
									<div className='col-span-4 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg h-full'>
										<h4 className='text-base text-system-primary-text m-0 leading-5'>{item.EventName}</h4>
										<h4 className=' text-xs text-brand-gray-dim line-clamp-2'>{item.Description}</h4>
									</div>
								</div>
							</div>
						)
					})}
				</>
			) : (
				<>
					<EmptyMembers emptyText={'No Events available today.'} />
				</>
			)}
			{/* <div className='bg-system-secondary-bg rounded-lg mt-3 overflow-hidden'>
				<div className='h-24 bg-brand-green relative overflow-hidden'>
					<img
						src='https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain'
						className='object-cover h-full w-full'
					/>
					<div className='absolute top-0 right-0 p-2'>
						<Button
							loading={false}
							onClick={() => {
								// handleLogin()
							}}
							variant='black'
							width='full'>
							Join Event
						</Button>
					</div>
				</div>
				<div className='p-3 px-2 grid grid-cols-5 gap-3 items-center'>
					<div className='p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex flex-col items-center h-full justify-center'>
						<h4 className='text-sm text-center text-system-primary-text m-0'>Jan</h4>
						<h4 className='font-semibold text-xl text-center text-system-primary-text m-0'>08</h4>
					</div>
					<div className='col-span-4 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg'>
						<h4 className='text-base text-system-primary-text m-0 leading-5'>Horasis Meeting Worldwide Barcelona</h4>
						<h4 className=' text-xs text-brand-gray-dim'>Directly seated and inside for you to enjoy the show.</h4>
					</div>
				</div>
			</div> */}
		</>
	)
}

export default TodaysEventTab
