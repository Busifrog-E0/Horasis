import { useNavigate } from 'react-router-dom'
import { useToast } from '../Toast/ToastService'
import { useAuth } from '../../utils/AuthProvider'
import { useEffect, useState } from 'react'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import { getItem } from '../../constants/operations'
import Spinner from '../ui/Spinner'
import EmptyMembers from '../Common/EmptyMembers'

const SavedArticlesTab = ({ bordered = false }) => {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [articles, setArticles] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 5,
		Keyword: '',
		Type: 'Article',
	})

	const onDelete = (DocId) => {
		console.log(DocId)
		setArticles(articles.filter((d) => d.DocId !== DocId))
	}

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const api = 'saves'

	const getArticles = (tempActivites) => {
		getData(`${api}?&${jsonToQuery(filters)}`, tempActivites, setArticles)
	}
	const getData = (endpoint, tempData, setData) => {
		setLoadingCom(tempData, true)
		getItem(
			`${endpoint}&NextId=${getNextId(tempData)}`,
			(data) => {
				if (Array.isArray(data)) {
					setData([...tempData, ...data])
				}
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

	const navigateToArticle = (id) => {
		navigate(`/Articles/${id}`)
	}

	useEffect(() => {
		if (articles.length > 0) hasAnyLeft(`${api}`, articles)
	}, [articles])

	useEffect(() => {
		fetch()
	}, [filters])

	return (
		<div className='p-5 bg-system-secondary-bg rounded-lg'>
			<div className='flex items-center justify-between gap-2 mb-1'>
				<h4 className='font-medium text-2xl text-system-primary-text'>Saved Articles</h4>
				{/* arrow cursor-pointer */}
			</div>
			<div>
				{isLoading ? (
					<Spinner />
				) : articles.length > 0 ? (
					<>
						{articles.map((article, index) => {
							let lastItem = articles.length - 1 === index
							return (
								<SavedArticleItem
									article={article}
									lastItem={lastItem}
									navigateToArticle={navigateToArticle}
									key={article.DocId}
								/>
							)
						})}
					</>
				) : (
					<EmptyMembers emptyText={'No saved articles'} />
				)}
			</div>
		</div>
	)
}

const SavedArticleItem = ({ article, lastItem, navigateToArticle }) => {
	return (
		<>
			<div
				className={`mt-4 flex flex-row gap-2 cursor-pointer ${
					!lastItem ? 'border-b' : ''
				} pb-4 border-system-file-border`}
				onClick={() => navigateToArticle(article.DocId)}>
				<div className='h-16 w-28  overflow-hidden rounded-lg'>
					<img src={article.CoverPicture} className='object-cover h-full w-full' />
				</div>
				<div className='flex-1'>
					<h4 className='font-semibold text-sm text-system-primary-text'>{article.ArticleName}</h4>
					<div className='flex flex-row gap-3'>
						<p className='text-xs text-brand-gray-dim mt-1 line-clamp-1'>{article.Description}</p>
					</div>
				</div>
				{/* {saving === article.DocId ? (
					<div className=' self-end'>
						<Spinner />
					</div>
				) : (
					<>
						{article.HasSaved ? (
							<>
								<img
									src={saveFill}
									alt=''
									className='h-6 cursor-pointer self-end'
									onClick={() => removeSaveArticle(article.DocId)}
								/>
							</>
						) : (
							<>
								<img
									src={saveOutline}
									alt=''
									className='h-6 cursor-pointer self-end'
									onClick={() => saveArticle(article.DocId)}
								/>
							</>
						)}
					</>
				)} */}
			</div>
		</>
	)
}

export default SavedArticlesTab
