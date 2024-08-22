import { useContext, useEffect, useState } from 'react'
import { useToast } from '../Toast/ToastService'
import { AuthContext } from '../../utils/AuthProvider'
import { getItem } from '../../constants/operations'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import Spinner from '../ui/Spinner'
import EmptyMembers from '../Common/EmptyMembers'
import TabItem from '../ui/TabItem'
import EventsList from './EventsList'
import SearchComponent from '../Search/SearchBox/SearchComponent'

const EventsSection = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [events, setEvents] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
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
			{/* <div className="flex-1 rounded-md p-2 px-4 border border-system-file-border flex items-center justify-between bg-system-secondary-bg">
                <h4 className="font-medium text-lg text-brand-gray-dim italic ">Search Events</h4>

            </div> */}
			<SearchComponent
				searchKey={filters.Keyword}
				setSearchKey={(value) => setFilters({ ...filters, Keyword: value })}
				placeholder='Search Events'
			/>
			<h4 className='font-bold text-2xl text-system-primary-accent mt-4 mb-2'>Events</h4>
			<h4 className=' text-base text-system-primary-text mb-2'>
				Find answers, ask questions, and connect with our community aroundthe world.
			</h4>
			<div className='flex gap-6 flex-wrap mt-4 mb-3'>
				<TabItem variant='active'>All Events</TabItem>
				{/* <TabItem variant='inactive'>Popular Events</TabItem> */}
			</div>
			{isLoading ? (
				<Spinner />
			) : events.length > 0 ? (
				<>
					<EventsList data={events} emptyText={'No events'} gap={'gap-1 lg:gap-4'} cols={3} />

					{isLoadingMore && (
						<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
							<Spinner />
						</div>
					)}
					{!pageDisabled && (
						<div onClick={fetchMore} className='flex flex-row justify-end mt-4 mb-2'>
							<div className='cursor-pointer flex items-center gap-2'>
								<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
							</div>
						</div>
					)}
				</>
			) : (
				<EmptyMembers emptyText={"You don't have any updates."} />
			)}
		</>
	)
}

export default EventsSection
