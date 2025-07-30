import { useEffect, useState } from 'react'
import Button from '../../ui/Button'
import MiniTab from '../../ui/MiniTab'
import MiniProgressBar from '../MiniProgressBar'
import DateAndTimePicker from '../../ui/DateAndTimePicker'
import { useAuth } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { getItem } from '../../../constants/operations'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Spinner from '../../ui/Spinner'
import { getDateMonth } from '../../../utils/date'
import arrowfor from '../../../assets/icons/arrowfor.svg'

function transformData(data) {
	if (data) {
		return data.map((item) => ({
			Date: getDateMonth(new Date(item.Date)),
			Count: item.Count,
		}))
	}
	return
}

const UserInsightsAnalyticsSection = ({ filters, setFilters }) => {
	const { currentUserData, updateCurrentUser } = useAuth()
	const toast = useToast()
	const [activeTab, setActiveTab] = useState(0)
	const tabs = (userInsights) => [
		{
			title: 'All Users',
			value: userInsights?.Users?.TotalCount,
			update:
				userInsights?.Users?.PercentageChange > 0
					? `+${userInsights?.Users?.PercentageChange}%`
					: `${userInsights?.Users?.PercentageChange}%`,
			render: () => {
				return (
					<div className='bg-system-secondary-bg rounded-lg p-3 overflow-hidden'>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart
								data={transformData(userInsights?.Users?.CountWithDate)}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='Date' />
								<YAxis />
								<Tooltip />
								<Line type='monotone' dataKey='Count' stroke='#8884d8' activeDot={{ r: 8 }} />
							</LineChart>
						</ResponsiveContainer>
					</div>
				)
			},
		},
		{
			title: 'Active Users',
			value: userInsights?.ActiveUsers?.TotalCount,
			update:
				userInsights?.ActiveUsers?.PercentageChange > 0
					? `+${userInsights?.ActiveUsers?.PercentageChange}%`
					: `${userInsights?.ActiveUsers?.PercentageChange}%`,
			render: () => {
				return (
					<div className='bg-system-secondary-bg rounded-lg p-3'>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart
								data={transformData(userInsights?.ActiveUsers?.CountWithDate)}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='Date' />
								<YAxis />
								<Tooltip />
								<Line type='monotone' dataKey='Count' stroke='#8884d8' activeDot={{ r: 8 }} />
							</LineChart>
						</ResponsiveContainer>
					</div>
				)
			},
		},
		{
			title: 'Total No. of Posts',
			value: userInsights?.Activities?.TotalCount,
			update:
				userInsights?.Activities?.PercentageChange > 0
					? `+${userInsights?.Activities?.PercentageChange}%`
					: `${userInsights?.Activities?.PercentageChange}%`,
			render: () => {
				return (
					<div className='bg-system-secondary-bg rounded-lg p-3'>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart
								data={transformData(userInsights?.Activities?.CountWithDate)}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='Date' />
								<YAxis />
								<Tooltip />
								<Line type='monotone' dataKey='Count' stroke='#8884d8' activeDot={{ r: 8 }} />
							</LineChart>
						</ResponsiveContainer>
					</div>
				)
			},
		},
	]

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
	const [userInsights, setUserInsights] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const getUserInsights = () => {
		setIsLoading(true)
		getItem(
			`analytics/userInsights?${jsonToQuery(filters)}`,
			(result) => {
				setIsLoading(false)
				setUserInsights(result)
			},
			(err) => {
				setIsLoading(false)
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const [userBreakDown, setUserBreakDown] = useState({})
	const getUserBreakDown = () => {
		getItem(
			`analytics/userBreakdown?${jsonToQuery(filters)}`,
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
		getUserInsights()
		getUserBreakDown()
	}, [filters])

	return (
		<>
			<div className='bg-system-secondary-bg rounded-lg p-3 px-6 pr-20'>
				<div className='flex flex-wrap items-center justify-between gap-2 mb-1'>
					<div className='flex items-center gap-2'>
						{/* icon goes here */}
						<h4 className='font-semibold text-xl text-system-primary-text'>User Insights</h4>
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
							<img src={arrowfor} alt="" className='h-6' />
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
						{/* <Button variant='black' size='md'>
							Download Report
						</Button> */}
					</div>
				</div>
				<div className='mt-8'>
					<div className='grid lg:grid-cols-3 gap-4 lg:gap-16'>
						<div>
							{userInsights && (
								<TabList setActiveTab={setActiveTab} activeTab={activeTab} tablist={tabs(userInsights)} />
							)}
						</div>
						<div className='lg:col-span-2'>
							<TabContent>{tabs(userInsights)[activeTab].render()}</TabContent>
						</div>
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

const TabList = ({ setActiveTab, activeTab, tablist }) => {
	return (
		<div className='flex flex-col gap-3'>
			{tablist.map((item, index) => {
				return (
					<div
						onClick={() => {
							setActiveTab(index)
						}}
						key={index}
						className={`rounded-lg  border-2 p-2 px-3 cursor-pointer ${
							activeTab === index ? 'border-system-primary-accent' : 'border-transparent'
						}`}>
						<div className='flex items-center gap-1 mb-2'>
							<h4 className='text-base text-brand-gray-dim'>{item.title}</h4>
							{/* info icon goes here */}
						</div>
						<p className={`font-semibold text-2xl text-system-primary-text`}>
							{item.value} <sup className='text-xs text-brand-green'>{item.update}</sup>
						</p>
					</div>
				)
			})}
		</div>
	)
}
const TabContent = ({ children }) => {
	return <div className={``}>{children}</div>
}

export default UserInsightsAnalyticsSection
