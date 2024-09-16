import { useNavigate } from 'react-router-dom'
import { useToast } from '../Toast/ToastService'
import { useAuth } from '../../utils/AuthProvider'
import { useEffect, useState } from 'react'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import { deleteItem, getItem, postItem } from '../../constants/operations'
import Spinner from '../ui/Spinner'
import EmptyMembers from '../Common/EmptyMembers'
import saveFill from '../../assets/icons/graysavefill.svg'
import saveOutline from '../../assets/icons/graysave.svg'
import arrowfor from '../../assets/icons/arrowfor.svg'

const SavedArticlesTab = ({ bordered = false, loadMoreEnabled = false, iconPresent = true }) => {
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

	const getSingleArticle = (id) => {
		setSaving(id)
		getItem(
			`articles/${id}`,
			(result) => {
				setSaving(null)
				setArticles(articles.filter((article) => article.DocId !== result.DocId))
			},
			(err) => {
				setSaving(null)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const [saving, setSaving] = useState(null)
	const saveArticle = (id) => {
		setSaving(id)
		postItem(
			`saves`,
			{ EntityId: id, Type: 'Article' },
			(result) => {
				if (result === true) {
					getSingleArticle(id)
				}
			},
			(err) => {
				setSaving(null)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const removeSaveArticle = (id) => {
		setSaving(id)
		deleteItem(
			`saves/${id}`,
			(result) => {
				if (result === true) {
					getSingleArticle(id)
				}
			},
			(err) => {
				setSaving(null)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	return (
		<div className='p-5 bg-system-secondary-bg rounded-lg'>
			<div className='flex items-center justify-between gap-2 mb-1'>
				<h4 className='font-medium text-2xl text-system-primary-text'>Saved Articles</h4>
				{iconPresent && articles.length>0 && (
					<img src={arrowfor} alt='' className='h-6 w-6 cursor-pointer' onClick={() => navigate('/SavedArticles')} />
				)}
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
									removeSaveArticle={removeSaveArticle}
									saveArticle={saveArticle}
									saving={saving}
								/>
							)
						})}
					</>
				) : (
					<EmptyMembers emptyText={'No saved articles'} />
				)}
				{loadMoreEnabled && (
					<>
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
								className='flex flex-row justify-end mt-4 mb-2'>
								<div className='cursor-pointer flex items-center gap-2'>
									<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

const SavedArticleItem = ({ article, lastItem, navigateToArticle, saving, removeSaveArticle, saveArticle }) => {
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
				{saving === article.DocId ? (
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
									onClick={(e) => {
										e.stopPropagation()
										removeSaveArticle(article.DocId)
									}}
								/>
							</>
						) : (
							<>
								<img
									src={saveOutline}
									alt=''
									className='h-6 cursor-pointer self-end'
									onClick={(e) => {
										e.stopPropagation()
										saveArticle(article.DocId)
									}}
								/>
							</>
						)}
					</>
				)}
			</div>
		</>
	)
}

export default SavedArticlesTab
