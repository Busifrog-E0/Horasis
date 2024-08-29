import { useEffect, useState } from 'react'
import MembersSection from '../components/Connections/MembersSection'
import MapChart from '../components/Map/MapChart'
import PieChart from '../components/Analytics/PieChart'
import SidebarTab from '../components/ui/SidebarTab'
import UserInsightsAnalyticsSection from '../components/Analytics/Sections/UserInsightsAnalyticsSection'
import ArticleAnalyticsSection from '../components/Analytics/Sections/ArticleAnalyticsSection'
import DiscussionsAnalyticsSection from '../components/Analytics/Sections/DiscussionsAnalyticsSection'
import EventsAnalyticsSection from '../components/Analytics/Sections/EventsAnalyticsSection'
import { getItem } from '../constants/operations'
import { jsonToQuery } from '../utils/searchParams/extractSearchParams'
import { useAuth } from '../utils/AuthProvider'
import { useToast } from '../components/Toast/ToastService'

const Analytics = () => {
	const { currentUserData, updateCurrentUser } = useAuth()
	const toast = useToast()
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
	const [hoveredPieSlice, setHoveredPieSlice] = useState(null)
	const [hoveredCity, setHoveredCity] = useState(null)
	const cities = ['India', 'United States']
	const tabs = (filters, setFilters) => [
		{
			icon: (
				<svg
					className='w-5 h-5 cursor-pointer'
					aria-hidden='true'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 20 20'>
					<path
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
					/>
				</svg>
			),
			title: 'User Insights',
			render: () => <UserInsightsAnalyticsSection filters={filters} setFilters={setFilters} />,
		},
		{
			icon: (
				<svg
					className='w-5 h-5 cursor-pointer'
					aria-hidden='true'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 20 20'>
					<path
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
					/>
				</svg>
			),
			title: 'Articles',
			render: () => <ArticleAnalyticsSection filters={filters} setFilters={setFilters} />,
		},
		{
			icon: (
				<svg
					className='w-5 h-5 cursor-pointer'
					aria-hidden='true'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 20 20'>
					<path
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
					/>
				</svg>
			),
			title: 'Discussions',
			render: () => <DiscussionsAnalyticsSection filters={filters} setFilters={setFilters} />,
		},
		{
			icon: (
				<svg
					className='w-5 h-5 cursor-pointer'
					aria-hidden='true'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 20 20'>
					<path
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
					/>
				</svg>
			),
			title: 'Events',
			render: () => <EventsAnalyticsSection />,
		},
	]

	const data = [
		{ value: 35, color: '#004992', label: 'Active' },
		{ value: 65, color: '#FE855A', label: 'Non-active' },
	]

	const [userStaticsData, setUserStaticsData] = useState({})
	const [filters, setFilters] = useState({
		StartDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime(),
		EndDate: new Date().getTime(),
		NoOfIntervals: 6,
	})

	const getUserStatistics = () => {
		getItem(
			`analytics/userStatistics?${jsonToQuery(filters)}`,
			(result) => {
				setUserStaticsData(result)
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
		getUserStatistics()
	}, [filters])

	return (
		<>
			<div className='p-2 lg:px-10 lg:py-6'>
				<div className='grid lg:grid-cols-4 gap-3 lg:gap-12'>
					<div className='lg:col-span-3'>
						<div>
							<SidebarTab tabs={tabs(filters, setFilters)} />
						</div>
					</div>
					<div>
						<div className='p-5 pb-0 bg-system-secondary-bg rounded-lg'>
							<h4 className='font-bold text-xl text-system-primary-text '>Statistics By Users</h4>
							<PieChart
								setHoveredPieSlice={setHoveredPieSlice}
								hoveredPieSlice={hoveredPieSlice}
								cursorPosition={cursorPosition}
								setCursorPosition={setCursorPosition}
								data={[
									{ value: userStaticsData?.ActiveUsersPercentage, color: '#004992', label: 'Active' },
									{ value: userStaticsData?.NonActiveUsersPercentage, color: '#FE855A', label: 'Non-active' },
								]}
							/>
						</div>
						<div className='p-5 pb-0 bg-system-secondary-bg rounded-lg mt-3 lg:mt-5'>
							<h4 className='font-bold text-xl text-system-primary-text '>Today's Event Location</h4>

							<MapChart
								onCitySelect={(city) => {
									console.log(city)
								}}
								setHoveredCity={setHoveredCity}
								cursorPosition={cursorPosition}
								setCursorPosition={setCursorPosition}
								eventLocations={userStaticsData?.EventLocations}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Analytics
