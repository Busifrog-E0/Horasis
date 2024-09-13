import { useContext, useEffect, useState } from 'react'
import { relativeTime } from '../../../utils/date'
import DropdownMenu from '../../ui/DropdownMenu'
import { AuthContext } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { getNextId } from '../../../utils/URLParams'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getItem } from '../../../constants/operations'
import Spinner from '../../ui/Spinner'
import EmptyMembers from '../../Common/EmptyMembers'
import { useNavigate } from 'react-router-dom'

const MyArticlesTab = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [articles, setArticles] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
    AuthorId:currentUserData.CurrentUser.UserId
	})
	const api = `articles`
	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getDisucssions = (tempArr) => {
		getData(`${api}?&${jsonToQuery(filters)}`, tempArr, setArticles)
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
		getDisucssions(initialRender ? [] : articles)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (articles.length > 0) hasAnyLeft(`${api}`, articles)
	}, [articles])

	useEffect(() => {
		fetch()
	}, [filters])
	return (
		<div className='bg-system-secondary-bg p-4 lg:py-10 lg:px-12 rounded-b-lg '>
			{isLoading ? (
				<>
					<Spinner />
				</>
			) : (
				<>
					{articles && (
						<>
							{articles.length > 0 ? (
								<>
									<div className='flex flex-col gap-6'>
										{articles.map((article) => {
											return <ArticleItem article={article} key={article.DocId} />
										})}
									</div>
								</>
							) : (
								<>
									<EmptyMembers emptyText={'No articles posted'} />
								</>
							)}
						</>
					)}
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
							className='flex flex-row justify-center mt-6 mb-2'>
							<div className='cursor-pointer flex items-center gap-2'>
								<h4 className='text-sm font-medium text-system-primary-accent'>Load more articles</h4>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}

const ArticleItem = ({ article }) => {
	const navigate = useNavigate()
	return (
		<div
			className='border-b border-system-file-border pb-6 cursor-pointer'
			onClick={() => navigate(`/Articles/${article.DocId}`)}>
			<div className='flex items-start gap-2'>
				<div className='h-20 md:h-28  overflow-hidden rounded-lg'>
					<img className='w-full h-full object-cover' src={article.CoverPicture} alt='Rounded avatar' />
				</div>

				<div className='flex-1'>
					<div className='flex items-start justify-between gap-10'>
						<div>
							<h4 className='font-semibold text-system-primary-text text-md'>{article.ArticleName}</h4>
							<h4 className='text-brand-gray-dim text-sm mt-1 line-clamp-3'>{article.Description}</h4>
						</div>
					</div>
				</div>
				<div className='flex flex-col items-end justify-between gap-6'>
					<h4 className='font-medium text-sm text-brand-gray-dim'>{relativeTime(article.CreatedIndex)}</h4>
					{/* <DropdownMenu /> */}
				</div>
			</div>
		</div>
	)
}

export default MyArticlesTab
