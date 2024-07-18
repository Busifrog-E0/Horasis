import { relativeTime } from '../../utils/date'
import avatar from '../../assets/icons/avatar.svg'
import like from '../../assets/icons/like.svg'
import reply from '../../assets/icons/reply.svg'
import ActivityCarousel from './ActivityCarousel'
import { useContext, useEffect, useState } from 'react'
import ActivityCommentList from './Comment/ActivityCommentList'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { deleteItem, getItem, postItem } from '../../constants/operations'
import { getNextId } from '../../utils/URLParams'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import Spinner from '../ui/Spinner'
import ViewLikedMembers from './Likes/ViewLikedMembers'
import ActivityDropdown from './ActivityDropdown'
const ActivityComponent = ({ bordered, activity, activityId, onDelete }) => {
	const [showComment, setShowComment] = useState(false)
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isDeleting, setIsDeleting] = useState(false)
	const [isLiking, setIsLiking] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [commentsData, setCommentsData] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 3,
		Keyword: '',
	})
	const [isLoadingActivity, setIsLoadingActivity] = useState(true)
	const [singleActivity, setSingleActivity] = useState(activity)

	const onLikeBtnClicked = (api) => {
		setIsLiking(true)
		console.log('onLikeBtnClicked')
		postItem(
			`users/${currentUserData.CurrentUser.UserId}/activities/${singleActivity.DocId}/like`,
			{},
			(result) => {
				console.log(result)
				if (result === true) {
					getSingleActivity()
				}
				setIsLiking(false)
			},
			(err) => {
				setIsLiking(false)
				console.error(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const onDeleteBtnClicked = (api) => {
		setIsDeleting(true)
		console.log('onLikeBtnClicked')
		deleteItem(
			`activities/${singleActivity.DocId}`,
			(result) => {
				setIsDeleting(false)
				console.log(result)
				if (result === true) {
					onDelete(singleActivity.DocId)
				}
			},
			(err) => {
				console.error(err)
				setIsDeleting(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const getSingleActivity = () => {
		getActivity(`activities/${activityId ? activityId : singleActivity.DocId}`, setSingleActivity)
	}
	const getActivity = (endpoint, setData) => {
		setIsLoadingActivity(true)
		getItem(
			`${endpoint}`,
			(data) => {
				setData(data)
				setIsLoadingActivity(false)
			},
			(err) => {
				setIsLoadingActivity(false)
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

	const getAllActivityComments = (tempActivites) => {
		getData(`activities/${singleActivity.DocId}/comments?&${jsonToQuery(filters)}`, tempActivites, setCommentsData)
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
		getAllActivityComments(initialRender ? [] : commentsData)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (commentsData.length > 0) hasAnyLeft(`activities/${singleActivity.DocId}/comments`, commentsData)
	}, [commentsData])

	useEffect(() => {
		if (showComment) fetch()
	}, [showComment])

	useEffect(() => {
		if (activityId) getSingleActivity()
		else setIsLoadingActivity(false)
	}, [activityId])

	// if (isLoadingActivity) {
	// 	return <div className={`p-5 bg-system-secondary-bg rounded-lg ${bordered && 'border border-system-file-border'}`}>
	// 	</div>
	// }
	if (singleActivity)
		return (
			<div className={`p-5 bg-system-secondary-bg rounded-lg ${bordered && 'border border-system-file-border'} relative`}>
				{isLoadingActivity && <div style={{ zIndex: 1000 }} className='absolute top-0 bottom-0 right-0 left-0 flex flex-col justify-center items-center'>
					<Spinner />
				</div>}

				<div className='flex items-start gap-2'>
					{singleActivity.UserDetails?.ProfilePicture ? (
						<>
							<img
								className='w-16 h-16 rounded-full'
								src={singleActivity.UserDetails?.ProfilePicture}
								alt='Rounded avatar'
							/>
						</>
					) : (
						<>
							<img className='w-16 h-16 rounded-full' src={avatar} alt='Rounded avatar' />
						</>
					)}

					<div className='flex-1'>
						<div className='flex items-start justify-between gap-10'>
							<div className='flex  flex-col gap-1'>
								<h4 className='font-semibold text-xl text-system-primary-accent mt-1'>
									{singleActivity.UserDetails?.FullName}
								</h4>
								{/* <h4 className='text-system-primary-text text-md'>Updated their photo</h4> */}
							</div>
							<h4 className='font-medium text-base text-brand-gray-dim'>{relativeTime(activity.CreatedIndex)}</h4>
						</div>
					</div>
				</div>
				<div className='mt-5'>
					<h4 className='text-system-primary-text font-medium text-xl'>{singleActivity.Content}</h4>
				</div>
				{singleActivity?.MediaFiles && singleActivity.MediaFiles.length > 0 && (
					<div>
						<ActivityCarousel slides={singleActivity.MediaFiles} />
					</div>
				)}
				<div className='flex items-center justify-between gap-10 mt-2'>
					<div className='flex flex-wrap items-start justify-between gap-10'>
						{isLiking ? (
							<Spinner />
						) : (
							<div className='flex items-center gap-2'>
								<img src={like} className='h-6 w-6 cursor-pointer' onClick={onLikeBtnClicked} />
								<ViewLikedMembers activity={singleActivity} />
							</div>
						)}
						<div className='flex items-center gap-2 cursor-pointer' onClick={() => setShowComment((prev) => !prev)}>
							<img src={reply} className='h-6 w-6' />
							<p className='text-brand-gray-dim mt-1'>{singleActivity.NoOfComments} replies</p>
						</div>
						{/* {isDeleting ? (
							<Spinner />
						) : (
							<div className='flex items-center gap-2 cursor-pointer' onClick={onDeleteBtnClicked}>
								<p className='text-brand-gray-dim mt-1'>Delete</p>
							</div>
						)} */}

					</div>
					<ActivityDropdown activity={singleActivity} />
				</div>
				{showComment && (
					<ActivityCommentList
						comments={commentsData}
						activity={singleActivity}
						getAllActivityComments={getAllActivityComments}
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

export default ActivityComponent
