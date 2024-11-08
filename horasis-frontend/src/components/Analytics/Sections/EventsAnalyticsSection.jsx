import { useEffect, useState } from 'react'
import EventBriefTab from '../../Events/EventBriefTab'
import { useAuth } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getItem } from '../../../constants/operations'
import DateAndTimePicker from '../../ui/DateAndTimePicker'
import EmptyMembers from '../../Common/EmptyMembers'
import arrowfor from '../../../assets/icons/arrowfor.svg'
import MiniTab from '../../ui/MiniTab'
import MiniProgressBar from '../MiniProgressBar'

const EventsAnalyticsSection = ({ filters, setFilters }) => {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [eventsData, setEventsData] = useState({})
	const getEventsData = () => {
		getItem(
			`analytics/events?${jsonToQuery(filters)}`,
			(result) => {
				setEventsData(result)
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const miniLocationTabs = (userBreakDown) => [
		{
			title: 'Country',
			render: () => (
				<div className='flex flex-col gap-2 mt-3'>
					{userBreakDown?.Country?.map((country) => {
						return <MiniProgressBar color='bg-system-primary-btn' title={country.EntityName} value={country.Count} />
					})}
				</div>
			),
		},
		{
			title: 'City',
			render: () => (
				<div className='flex flex-col gap-2 mt-3'>
					{userBreakDown?.City?.map((city) => {
						return <MiniProgressBar color='bg-system-primary-btn' title={city.EntityName} value={city.Count} />
					})}
				</div>
			),
		},
	]

	const miniJobTabs = (userBreakDown) => [
		{
			title: 'Industry',
			render: () => (
				<div className='flex flex-col gap-2 mt-3'>
					{userBreakDown?.Industry?.map((industry) => {
						return <MiniProgressBar color='bg-brand-orange' title={industry.EntityName} value={industry.Count} />
					})}
				</div>
			),
		},
		{
			title: 'Job Title',
			render: () => (
				<div className='flex flex-col gap-2 mt-3'>
					{userBreakDown?.JobTitle?.map((jobTitle) => {
						return <MiniProgressBar color='bg-brand-orange' title={jobTitle.EntityName} value={jobTitle.Count} />
					})}
				</div>
			),
		},
	]
	const [userBreakDown, setUserBreakDown] = useState({})
	const getUserBreakDown = () => {
		getItem(
			`analytics/engagement/breakdown?Type=Event&${jsonToQuery(filters)}`,
			(result) => {
				setUserBreakDown(result)
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	useEffect(() => {
		getEventsData()
		getUserBreakDown()
	}, [filters])

	const [topFilter, setTopFilter] = useState({
		OrderBy: 'Index',
		Keyword: '',
		Limit: 2,
	})
	const [topEvents, setTopEvents] = useState([])
	const getTopEvents = () => {
		getItem(
			`analytics/topEvents?${jsonToQuery(topFilter)}`,
			(result) => {
				setTopEvents(result)
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	useEffect(() => {
		getTopEvents()
	}, [topFilter])

	return (
		<>
			<div className='bg-system-secondary-bg rounded-lg p-3 px-6 pr-20'>
				<div className='flex flex-wrap items-center justify-between gap-2 mb-1'>
					<div className='flex items-center gap-2'>
						{/* icon goes here */}
						<h4 className='font-semibold text-xl text-system-primary-text'>Events</h4>
					</div>
					<div className='flex flex-wrap items-center gap-5'>
						<div className='flex border rounded-md items-center'>
							<DateAndTimePicker
								dateFormat='MMM dd'
								selected={new Date(filters.StartDate)}
								onChange={(date) => {
									const newDate = new Date(date)
									const epochTime = newDate.getTime()
									setFilters({ ...filters, StartDate: epochTime })
								}}
								placeholder='Start date'
								className='w-24 border-none'
							/>
							<img src={arrowfor} alt='' className='h-6' />
							<DateAndTimePicker
								dateFormat='MMM dd'
								selected={new Date(filters.EndDate)}
								onChange={(date) => {
									const newDate = new Date(date)
									const epochTime = newDate.getTime()
									setFilters({ ...filters, EndDate: epochTime })
								}}
								placeholder='End date'
								className='w-24 border-none'
							/>
						</div>
					</div>
				</div>
				<div className='mt-8 mb-6'>
					<div className='grid lg:grid-cols-3 gap-16'>
						<div className={`rounded-lg cursor-pointer`}>
							<div className='flex items-center gap-1 mb-2'>
								<h4 className='text-base text-brand-gray-dim'>{'No. of Events'}</h4>
								{/* info icon goes here */}
							</div>
							<p className={`font-semibold text-2xl text-system-primary-text`}>{eventsData?.Events?.TotalCount} </p>
						</div>
						<div className={`rounded-lg cursor-pointer`}>
							<div className='flex items-center gap-1 mb-2'>
								<h4 className='text-base text-brand-gray-dim'>{'Physical Events'}</h4>
								{/* info icon goes here */}
							</div>
							<p className={`font-semibold text-2xl text-system-primary-text`}>
								{eventsData?.PhysicalEvents?.TotalCount}{' '}
							</p>
						</div>
						<div className={`rounded-lg cursor-pointer`}>
							<div className='flex items-center gap-1 mb-2'>
								<h4 className='text-base text-brand-gray-dim'>{'Virtual Events'}</h4>
								{/* info icon goes here */}
							</div>
							<p className={`font-semibold text-2xl text-system-primary-text`}>
								{eventsData?.VirtualEvents?.TotalCount}{' '}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className='bg-system-secondary-bg rounded-lg p-3 px-6 mt-6'>
				<h4 className='font-semibold text-xl text-system-primary-text mb-1 mt-3'>Top Events</h4>
				<div className='flex items-center gap-1 mb-2'>
					<h4 className='text-xs text-brand-gray-dim'>{'Most Engagements'}</h4>
					{/* info icon goes here */}
				</div>
				<div className='my-6 hidden lg:block'>
					<div className='flex flex-row overflow-auto gap-4'>
						{topEvents && topEvents.length > 0 ? (
							<>
								{topEvents.map((event) => {
									return (
										<div className='w-60 ' key={event.DocId}>
											<EventBriefTab event={event} />
										</div>
									)
								})}
							</>
						) : (
							<>
								<EmptyMembers emptyText='No events' />
							</>
						)}
					</div>
				</div>
			</div>
			<div className='bg-system-secondary-bg rounded-lg p-3 px-6 mt-3 lg:mt-6'>
				<div className='flex items-center gap-2 mb-2'>
					{/* icon goes here */}
					<h4 className='font-semibold text-xl text-system-primary-text'>User Breakdown</h4>
				</div>
				<div className='grid lg:grid-cols-2 gap-10'>
					<div className=''>
						<MiniTab tabs={miniLocationTabs(userBreakDown)} />
					</div>
					<div className=''>
						<MiniTab tabs={miniJobTabs(userBreakDown)} />
					</div>
				</div>
			</div>
		</>
	)
}

export default EventsAnalyticsSection
