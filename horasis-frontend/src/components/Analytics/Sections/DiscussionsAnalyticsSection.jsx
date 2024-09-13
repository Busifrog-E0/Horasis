import { useEffect, useState } from 'react'
import DiscussionsAnalyticsTab from '../../Discussions/DiscussionsAnalyticsTab'
import DateAndTimePicker from '../../ui/DateAndTimePicker'
import { useAuth } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { getItem } from '../../../constants/operations'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import DiscussionsList from '../../Discussions/DiscussionsList'

const DiscussionsAnalyticsSection = ({ filters, setFilters }) => {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [discussionsData, setDiscussionsData] = useState({})
	const getDiscussionsData = () => {
		getItem(
			`analytics/discussions?${jsonToQuery(filters)}`,
			(result) => {
				setDiscussionsData(result)
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
		getDiscussionsData()
	}, [filters])

	const [topFilter, setTopFilter] = useState({
		OrderBy: 'Index',
		Keyword: '',
		Limit: 3,
	})
	const [topDiscussions, setTopDiscussions] = useState([])
	const getTopDiscussions = () => {
		getItem(
			`analytics/topDiscussions?${jsonToQuery(topFilter)}`,
			(result) => {
				setTopDiscussions(result)
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
		getTopDiscussions()
	}, [topFilter])

	return (
		<>
			<div className='bg-system-secondary-bg rounded-lg p-3 px-6 pr-20'>
				<div className='flex flex-wrap items-center justify-between gap-2 mb-1'>
					<div className='flex items-center gap-2'>
						{/* icon goes here */}
						<h4 className='font-semibold text-xl text-system-primary-text'>Discussions</h4>
					</div>
					<div className='flex flex-wrap items-center gap-5'>
						<div className='flex border rounded-md'>
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
								<h4 className='text-base text-brand-gray-dim'>{'No. of Discussions'}</h4>
								{/* info icon goes here */}
							</div>
							<p className={`font-semibold text-2xl text-system-primary-text`}>
								{discussionsData?.Discussions?.TotalCount}{' '}
								<sup className='text-xs text-brand-green'>
									{' '}
									{discussionsData?.Discussions?.PercentageChange > 0
										? `+${discussionsData?.Discussions?.PercentageChange}%`
										: `${discussionsData?.Discussions?.PercentageChange}%`}
								</sup>
							</p>
						</div>
						<div className={`rounded-lg cursor-pointer`}>
							<div className='flex items-center gap-1 mb-2'>
								<h4 className='text-base text-brand-gray-dim'>{'No. of Engagements'}</h4>
								{/* info icon goes here */}
							</div>
							<p className={`font-semibold text-2xl text-system-primary-text`}>
								{discussionsData?.Activities?.TotalCount}{' '}
								<sup className='text-xs text-brand-green'>
									{discussionsData?.Activities?.PercentageChange > 0
										? `+${discussionsData?.Activities?.PercentageChange}%`
										: `${discussionsData?.Activities?.PercentageChange}%`}
								</sup>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className='bg-system-secondary-bg rounded-lg p-3 px-6 mt-6'>
				<h4 className='font-semibold text-xl text-system-primary-text mb-1 mt-3'>Top Discussions</h4>
				<div className='flex items-center gap-1 mb-2'>
					<h4 className='text-xs text-brand-gray-dim'>{'Most Engagements'}</h4>
					{/* info icon goes here */}
				</div>
				<div className='my-6'>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2'>
						{topDiscussions && (
							<>
								{topDiscussions.length > 0 ? (
									<>
										{topDiscussions.map((item) => {
											return <DiscussionsAnalyticsTab discussion={item} key={item.DocId} />
										})}
									</>
								) : (
									<></>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default DiscussionsAnalyticsSection
