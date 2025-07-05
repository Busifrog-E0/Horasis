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

import whiteUserActivity from '../assets/icons/useractivitywhite.svg'
import blackUserActivity from '../assets/icons/useractivityblack.svg'
import whiteArticle from '../assets/icons/articlewhite.svg'
import blackArticle from '../assets/icons/articleblack.svg'
import whiteforum from '../assets/icons/forumwhite.svg'
import blackforum from '../assets/icons/forumblack.svg'
import whiteevent from '../assets/icons/eventwhite.svg'
import blackevent from '../assets/icons/eventblack.svg'
import ChoroplethChart from '../components/Map/ChoroplethChart'

const Analytics = () => {
	const { currentUserData, updateCurrentUser } = useAuth()
	const toast = useToast()
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
	const [hoveredPieSlice, setHoveredPieSlice] = useState(null)
	const [hoveredCity, setHoveredCity] = useState(null)
	const cities = ['India', 'United States']
	const tabs = (filters, setFilters) => [
		{
			whiteIcon: <img src={whiteUserActivity} className='h-6' />,
			blackIcon: <img src={blackUserActivity} className='h-6' />,
			title: 'User Insights',
			render: () => <UserInsightsAnalyticsSection filters={filters} setFilters={setFilters} />,
		},
		{
			whiteIcon: <img src={whiteArticle} className='h-6' />,
			blackIcon: <img src={blackArticle} className='h-6' />,
			title: 'Articles',
			render: () => <ArticleAnalyticsSection filters={filters} setFilters={setFilters} />,
		},
		{
			whiteIcon: <img src={whiteforum} className='h-6' />,
			blackIcon: <img src={blackforum} className='h-6' />,
			title: 'Discussions',
			render: () => <DiscussionsAnalyticsSection filters={filters} setFilters={setFilters} />,
		},
		{
			whiteIcon: <img src={whiteevent} className='h-6' />,
			blackIcon: <img src={blackevent} className='h-6' />,
			title: 'Events',
			render: () => <EventsAnalyticsSection filters={filters} setFilters={setFilters} />,
		},
	]

	// const data = [
	// 	{ value: 35, color: '#004992', label: 'Active' },
	// 	{ value: 65, color: '#FE855A', label: 'Non-active' },
	// ]

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
