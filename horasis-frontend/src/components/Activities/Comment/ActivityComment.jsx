import { useContext, useEffect, useState } from 'react'
import { relativeTime } from '../../../utils/date'
import ActivityCommentReply from './ActivityCommentReply'
import avatar from '../../../assets/icons/avatar.svg'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import { getItem, postItem } from '../../../constants/operations'
import { AuthContext } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import TextArea from '../../ui/TextArea'
import Spinner from '../../ui/Spinner'
import ActivityCommentReplyList from './ActivityCommentReplyList'

const ActivityComment = ({ comment, activity, commentId, getSingleActivity }) => {
	const { currentUserData, updateCurrentUser } = useContext(AuthContext)
	const toast = useToast()
	const [showReplies, setShowReplies] = useState(false)
	const [repliesData, setRepliesData] = useState([])

	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [isLoadingComment, setIsLoadingComment] = useState(true)
	const [singleComment, setSingleComment] = useState(comment)

	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
	})

	const getSingleComment = () => {
		getComment(`comments/${commentId ? commentId : singleComment.DocId}`, setSingleComment)
	}

	const getComment = (endpoint, setData) => {
		setIsLoadingComment(true)
		getItem(
			`${endpoint}`,
			(data) => {
				setData(data)
				setIsLoadingComment(false)
			},
			(err) => {
				setIsLoadingComment(false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getAllCommentReplies = (tempReplies) => {
		getData(`activities/${comment.DocId}/comments?&${jsonToQuery(filters)}`, tempReplies, setRepliesData)
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
		getAllCommentReplies(initialRender ? [] : repliesData)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (repliesData.length > 0) hasAnyLeft(`activities/${comment.DocId}/comments`, repliesData)
	}, [repliesData])

	useEffect(() => {
		if (showReplies) fetch()
	}, [showReplies])

	useEffect(() => {
		if (commentId) getSingleComment()
		else setIsLoadingComment(false)
	}, [commentId])
	return (
		<div className='flex flex-col w-full bg-system-secondary-bg rounded-lg'>
			<div className='flex items-start gap-2 bg-system-secondary-bg w-full p-4 rounded-lg'>
				{comment?.UserDetails?.ProfilePicture ? (
					<>
						<img className='w-8 h-8 rounded-full' src={comment?.UserDetails?.ProfilePicture} alt='Rounded avatar' />
					</>
				) : (
					<>
						<img className='w-8 h-8 rounded-full' src={avatar} alt='Rounded avatar' />
					</>
				)}

				<div className='flex-1'>
					<div className='flex items-start justify-between gap-10'>
						<div className='flex  flex-col gap-2'>
							<h4 className='font-semibold text-md text-system-primary-accent mt-1'>
								{comment?.UserDetails?.FullName}
							</h4>
							<h4 className='text-system-primary-text text-md'>{comment?.Content}</h4>

							<div className='flex items-center gap-2 cursor-pointer' onClick={() => setShowReplies((prev) => !prev)}>
								{/* <img src={reply} className='h-6 w-6' /> */}
								<p className='text-brand-gray-dim mt-1'>{singleComment.NoOfReplies} replies</p>
							</div>
						</div>
						<h4 className='font-medium text-base text-brand-gray-dim'>{relativeTime(comment.CreatedIndex)}</h4>
					</div>
				</div>
			</div>
			{showReplies && (
				<ActivityCommentReplyList
					activity={activity}
					comment={singleComment}
					replies={repliesData}
					getAllCommentReplies={getAllCommentReplies}
					getSingleComment={getSingleComment}
					getSingleActivity={getSingleActivity}
					isLoading={isLoading}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
					fetchMore={fetchMore}
					setIsLoading={setIsLoading}
				/>
			)}
		</div>
	)
}

export default ActivityComment
