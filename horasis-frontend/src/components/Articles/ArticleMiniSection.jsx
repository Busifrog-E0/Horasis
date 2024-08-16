import { useEffect, useState } from 'react'
import { useAuth } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { getNextId } from '../../utils/URLParams'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getItem, postItem } from '../../constants/operations'
import Spinner from '../ui/Spinner'
import EmptyMembers from '../Common/EmptyMembers'
import arrowfor from '../../assets/icons/arrowfor.svg'
import saveFill from '../../assets/icons/graysavefill.svg'
import saveOutline from '../../assets/icons/graysave.svg'
import { useNavigate } from 'react-router-dom'

const ArticleMiniSection = () => {
	const navigate = useNavigate()
	const { currentUserData, updateCurrentUser } = useAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [articles, setArticles] = useState([])

	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 3,
		Keyword: '',
	})

	const api = `articles`

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getArticles = (tempArr) => {
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
		getArticles(initialRender ? [] : articles)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (articles.length > 0) hasAnyLeft(`${api}`, articles)
	}, [articles])

	useEffect(() => {
		fetch()
	}, [filters])

	const [saving, setSaving] = useState(false)
	const saveArticle = (id) => {
		postItem(
			`saves`,
			{ EntityId: id, Type: 'Article' },
			(result) => {
				console.log(result)
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	return (
		<div className='p-5 bg-system-secondary-bg rounded-lg'>
			<div className='flex items-center justify-between gap-2 mb-1'>
				<h4 className='font-semibold text-2xl text-system-primary-text'>Latest Articles</h4>
				{/* arrow cursor-pointer */}
				<img src={arrowfor} alt='' className='h-8 cursor-pointer' onClick={() => navigate('/Articles')} />
			</div>
			{isLoading ? (
				<>
					<Spinner />
				</>
			) : (
				<>
					{articles && articles.length > 0 ? (
						<>
							{articles.map((article, index) => {
								let lastItem = articles.length - 1 === index
								return (
									<ArticleMiniTab article={article} key={article.DocId} lastItem={lastItem} saveArticle={saveArticle} />
								)
							})}
						</>
					) : (
						<>
							<EmptyMembers emptyText='No new articles' />
						</>
					)}
				</>
			)}
		</div>
	)
}

const ArticleMiniTab = ({ article, lastItem, saveArticle }) => {
	return (
		<>
			<div className={`mt-4 flex flex-row gap-2 ${!lastItem && 'border-b'} pb-4 border-system-file-border`}>
				<div className='h-16 w-28  overflow-hidden rounded-lg'>
					<img src={article.CoverPicture} className='object-cover h-full w-full' />
				</div>
				<div className='flex-1'>
					<h4 className='font-semibold text-sm text-system-primary-text'>{article.ArticleName}</h4>
					<div className='flex flex-row gap-3'>
						<p className='text-xs text-brand-gray-dim mt-1 line-clamp-1'>{article.Description}</p>
						{/* <svg
							className='cursor-pointer w-12 h-12 text-system-primary-text'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='currentColor'
							viewBox='0 0 20 20'>
							<path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
              </svg> */}
					</div>
				</div>
				{/* <img
					src={saveOutline}
					alt=''
					className='h-6 cursor-pointer self-end'
					onClick={() => saveArticle(article.DocId)}
				/> */}
			</div>
		</>
	)
}

export default ArticleMiniSection
