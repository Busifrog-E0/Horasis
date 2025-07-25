import React, { useEffect, useState } from 'react'
import SearchComponent from '../Search/SearchBox/SearchComponent'
import ArticlesList from './ArticlesList'
import { useAuth } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import { deleteItem, getItem, postItem } from '../../constants/operations'
import Spinner from '../ui/Spinner'

const ArticlesSection = ({ handleRefresh }) => {
	const { currentUserData, updateCurrentUser } = useAuth()
	const toast = useToast()

	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [articles, setArticles] = useState([])

	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
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

	const getSingleArticle = (id, setLoader) => {
		setLoader(id)
		getItem(
			`articles/${id}`,
			(result) => {
				setLoader(null)
				setArticles(articles.map((article) => (article.DocId === result.DocId ? result : article)))
			},
			(err) => {
				setLoader(null)
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
					getSingleArticle(id, setSaving)
					handleRefresh()
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
					getSingleArticle(id, setSaving)
					handleRefresh()
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
	const [liking, setLiking] = useState(null)
	const likeArticle = (EntId, callback) => {
		postItem(
			`likes/${EntId}`,
			{ Type: 'Article' },
			(result) => {
				if (result === true) {
					getSingleArticle(EntId, setLiking)
				}
			},
			(err) => {
				setLiking(null)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const unLikeArticle = (EntId) => {
		deleteItem(
			`likes/${EntId}`,
			(result) => {
				if (result === true) {
					getSingleArticle(EntId, setLiking)
				}
			},
			(err) => {
				setLiking(null)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	return (
		<>
			<div className='mb-3 lg:mb-5'>
				<SearchComponent
					searchKey={filters.Keyword}
					setSearchKey={(value) => setFilters({ ...filters, Keyword: value })}
					placeholder='Search Articles'
				/>
			</div>
			<h4 className='font-medium text-2xl text-system-primary-accent mt-4 mb-3 lg:mb-6'>Articles</h4>
			{isLoading ? (
				<>
					<Spinner />
				</>
			) : (
				<>
					<div className='rounded-lg'>
						<ArticlesList
						handleRefresh={handleRefresh}
							data={articles}
							emptyText={'No articles'}
							saveArticle={saveArticle}
							removeSaveArticle={removeSaveArticle}
							saving={saving}
							likeArticle={likeArticle}
							unLikeArticle={unLikeArticle}
							liking={liking}
						/>
					</div>
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
					className='flex flex-row justify-start mt-4 mb-2'>
					<div className='cursor-pointer flex items-center gap-2'>
						<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
						{/* <svg className="text-system-primary-accent h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg> */}
					</div>
				</div>
			)}
		</>
	)
}

export default ArticlesSection
