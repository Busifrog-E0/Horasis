import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import { getItem } from '../../../constants/operations'
import Spinner from '../../ui/Spinner'
import EmptyMembers from '../../Common/EmptyMembers'
import { useNavigate } from 'react-router-dom'

const SavedPodcastTab = ({ bordered = false }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [discussions, setDiscussions] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 5,
		Keyword: '',
		Type: 'Discussion',
	})

	const onDelete = (DocId) => {
		console.log(DocId)
		setDiscussions(discussions.filter((d) => d.DocId !== DocId))
	}

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const api = 'saves'

	const getDiscussions = (tempActivites) => {
		getData(`${api}?&${jsonToQuery(filters)}`, tempActivites, setDiscussions)
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
		getDiscussions(initialRender ? [] : discussions)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	const navigateToDiscussion = (id) => {
		navigate(`/Discussions/${id}`)
	}

	useEffect(() => {
		if (discussions.length > 0) hasAnyLeft(`${api}`, discussions)
	}, [discussions])

	useEffect(() => {
		fetch()
	}, [filters])

	return (
		<div className='p-5 bg-system-secondary-bg rounded-lg'>
			<div className='flex items-center justify-between gap-2 mb-1'>
				<h4 className='font-medium text-2xl text-system-primary-text'>Saved Discussions</h4>
				{/* arrow cursor-pointer */}
			</div>
			<div>
				{isLoading ? (
					<Spinner />
				) : discussions.length > 0 ? (
					<>
						{discussions.map((discussion, index) => {
							let lastItem = discussions.length - 1 === index
							return (
								<SavedDiscussionItem
									discussion={discussion}
									lastItem={lastItem}
									navigateToDiscussion={navigateToDiscussion}
									key={discussion.DocId}
								/>
							)
						})}
					</>
				) : (
					<EmptyMembers emptyText={'No saved discussions'} />
				)}
			</div>
		</div>
	)
}

const SavedDiscussionItem = ({ discussion, lastItem, navigateToDiscussion }) => {
	return (
		<>
			<div
				className={`mt-4 flex flex-row gap-2 cursor-pointer ${
					!lastItem ? 'border-b' : ''
				} pb-4 border-system-file-border`}
				onClick={() => navigateToDiscussion(discussion.DocId)}>
				<div className='h-16 w-28  overflow-hidden rounded-lg'>
					<img src={discussion.CoverPicture} className='object-cover h-full w-full' />
				</div>
				<div className='flex-1'>
					<h4 className='font-semibold text-sm text-system-primary-text'>{discussion.DiscussionName}</h4>
					<div className='flex flex-row gap-3'>
						<p className='text-xs text-brand-gray-dim mt-1 line-clamp-1'>{discussion.Description}</p>
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

export default SavedPodcastTab
