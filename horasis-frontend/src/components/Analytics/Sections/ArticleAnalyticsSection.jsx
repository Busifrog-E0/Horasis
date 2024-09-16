import { useEffect, useState } from 'react'
import ArticleTab from '../../Articles/ArticleTab'
import DateAndTimePicker from '../../ui/DateAndTimePicker'
import { useAuth } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { getItem } from '../../../constants/operations'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import ArticlesList from '../../Articles/ArticlesList'
import arrowfor from '../../../assets/icons/arrowfor.svg'


const ArticleAnalyticsSection = ({ filters, setFilters }) => {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [articlesData, setArticlesData] = useState({})
	const getArticlesdata = () => {
		getItem(
			`analytics/articles?${jsonToQuery(filters)}`,
			(result) => {
				setArticlesData(result)
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const [topFilter, setTopFilter] = useState({
		OrderBy: 'Index',
		Keyword: '',
		Limit: 2,
	})
	const [topArticles, setTopArticles] = useState([])
	const getTopArticles = () => {
		getItem(
			`analytics/topArticles?${jsonToQuery(topFilter)}`,
			(result) => {
				setTopArticles(result)
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
		getTopArticles()
	}, [topFilter])

	useEffect(() => {
		getArticlesdata()
	}, [filters])
	return (
		<>
			<div className='bg-system-secondary-bg rounded-lg p-3 px-6 pr-20'>
				<div className='flex flex-wrap items-center justify-between gap-2 mb-1'>
					<div className='flex items-center gap-2'>
						{/* icon goes here */}
						<h4 className='font-semibold text-xl text-system-primary-text'>Articles</h4>
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
					</div>
				</div>
				<div className='mt-8 mb-6'>
					<div className='grid lg:grid-cols-3 gap-16'>
						<div className={`rounded-lg cursor-pointer`}>
							<div className='flex items-center gap-1 mb-2'>
								<h4 className='text-base text-brand-gray-dim'>{'No. of Articles'}</h4>
								{/* info icon goes here */}
							</div>
							<p className={`font-semibold text-2xl text-system-primary-text`}>
								{articlesData?.Articles?.TotalCount}
								<sup className='text-xs text-brand-green'>
									{articlesData?.Articles?.PercentageChange > 0
										? `+${articlesData?.Articles?.PercentageChange}%`
										: `${articlesData?.Articles?.PercentageChange}%`}
								</sup>
							</p>
						</div>
						<div className={`rounded-lg cursor-pointer`}>
							<div className='flex items-center gap-1 mb-2'>
								<h4 className='text-base text-brand-gray-dim'>{'No. of Engagements'}</h4>
								{/* info icon goes here */}
							</div>
							<p className={`font-semibold text-2xl text-system-primary-text`}>
								{articlesData?.Engagements?.TotalCount}{' '}
								<sup className='text-xs text-brand-green'>
									{articlesData?.Engagements?.PercentageChange > 0
										? `+${articlesData?.Engagements?.PercentageChange}%`
										: `${articlesData?.Engagements?.PercentageChange}%`}
								</sup>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className='bg-system-secondary-bg rounded-lg p-3 px-6 pr-40 mt-6'>
				<h4 className='font-semibold text-xl text-system-primary-text mb-1 mt-3'>Top Articles</h4>
				<div className='flex items-center gap-1 mb-2'>
					<h4 className='text-xs text-brand-gray-dim'>{'Most Engagements'}</h4>
					{/* info icon goes here */}
				</div>
				<div className='my-6'>
					<div className='grid lg:grid-cols-2 gap-8'>
						{topArticles && topArticles.length > 0 ? (
							<>
								{topArticles.map((item) => {
									return (
										<ArticleTab
											article={item}
											key={item.DocId}
											navigateToArticle={() => {}}
											saveArticle={() => {}}
											removeSaveArticle={() => {}}
											saving={false}
											from='tab'
										/>
									)
								})}
							</>
						) : (
							<></>
						)}

						{/* <ArticleTab />
                    <ArticleTab />
                    <ArticleTab /> */}
					</div>
				</div>
			</div>
		</>
	)
}

export default ArticleAnalyticsSection
