import { relativeTime } from '../../utils/date'
import avatar from '../../assets/icons/avatar.svg'
import like from '../../assets/icons/like.svg'
import liked from '../../assets/icons/liked.svg'
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
import MentionTextLink from './Mentions/MentionTextLink'
import ActivityDocuments from './ActivityDocuments'
const ActivityComponent = ({
	titleSize,
	bordered,
	activity,
	activityId,
	onDelete,
	className,
	avatarSize,
	descriptionSize,
	timeSize = 'text-base',
	ShowImage = true,
	iconSize = '6',
	openComment = false,
	onSaveRemoveCallback = () => {},
}) => {
	const [showComment, setShowComment] = useState(openComment)
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isDeleting, setIsDeleting] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [isLiking, setIsLiking] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [commentsData, setCommentsData] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
	})
	const [isLoadingActivity, setIsLoadingActivity] = useState(true)
	const [singleActivity, setSingleActivity] = useState(activity)

	const onLikeBtnClicked = () => {
		const actId = singleActivity ? singleActivity.DocId : activityId

		setIsLiking(true)
		postItem(
			`users/${currentUserData.CurrentUser.UserId}/activities/${actId}/like`,
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

	const onSaveClicked = () => {
		const actId = singleActivity ? singleActivity.DocId : activityId

		setIsSaving(true)
		postItem(
			`saves`,
			{
				EntityId: actId,
				Type: 'Activity',
			},
			(result) => {
				console.log(result)
				if (result === true) {
					getSingleActivity()
				}
				setIsSaving(false)
			},
			(err) => {
				setIsSaving(false)
				console.error(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const OnRemoveClicked = () => {
		const actId = singleActivity ? singleActivity.DocId : activityId

		setIsSaving(true)
		deleteItem(
			`saves/${actId}`,
			(result) => {
				console.log(result)
				if (result === true) {
					getSingleActivity()
					onSaveRemoveCallback()
				}
				setIsSaving(false)
			},
			(err) => {
				setIsSaving(false)
				console.error(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const onUnLikeBtnClicked = () => {
		const actId = singleActivity ? singleActivity.DocId : activityId

		setIsLiking(true)
		deleteItem(
			`users/${currentUserData.CurrentUser.UserId}/activities/${actId}/disLike`,
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
	const onDeleteBtnClicked = () => {
		const actId = singleActivity ? singleActivity.DocId : activityId

		setIsDeleting(true)
		deleteItem(
			`activities/${actId}`,
			(result) => {
				setIsDeleting(false)
				console.log(result)
				if (result === true) {
					onDelete(actId)
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
		const actId = singleActivity ? singleActivity.DocId : activityId
		getData(`activities/${actId}/comments?&${jsonToQuery(filters)}`, tempActivites, setCommentsData)
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
		const actId = singleActivity ? singleActivity.DocId : activityId
		if (commentsData.length > 0) hasAnyLeft(`activities/${actId}/comments`, commentsData)
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
			<div className={className}>
				{isLoadingActivity && (
					<div
						style={{ zIndex: 1000 }}
						className='absolute top-0 bottom-0 right-0 left-0 flex flex-col justify-center items-center'>
						<Spinner />
					</div>
				)}

				<div className='flex items-start gap-2'>
					{singleActivity.UserDetails?.ProfilePicture ? (
						<>
							<img
								className={`${avatarSize} rounded-full object-cover`}
								src={singleActivity.UserDetails?.ProfilePicture}
								alt='Rounded avatar'
							/>
						</>
					) : (
						<>
							<img className={`${avatarSize} rounded-full object-cover`} src={avatar} alt='Rounded avatar' />
						</>
					)}

					<div className='flex-1'>
						<div className='flex items-start justify-between gap-10'>
							<div className='flex  flex-col gap-1'>
								<h1 className={`font-semibold ${titleSize} text-system-primary-accent mt-1`}>
									{singleActivity.UserDetails?.FullName}
								</h1>
								{/* <h4 className='text-system-primary-text text-md'>Updated their photo</h4> */}
							</div>
							<h4 className={`font-medium ${timeSize} text-brand-gray-dim`}>
								{relativeTime(singleActivity.CreatedIndex)}
							</h4>
						</div>
					</div>
				</div>
				<div className='mt-5'>
					<MentionTextLink descriptionSize={descriptionSize} singleActivity={singleActivity} />
				</div>
				{/* {
					singleActivity.Mentions?.length > 0 &&
					<div className='mb-2 mt-1'>
						<p className='text-system-primary-text font-normal text-xs m-0'>{singleActivity.Mentions?.length} Mentions</p>
					</div>
				} */}
				{}
				{ShowImage && singleActivity?.MediaFiles && singleActivity.MediaFiles.length > 0 && (
					<div>
						<ActivityCarousel slides={singleActivity.MediaFiles} />
					</div>
				)}

				{ShowImage && singleActivity?.Documents && singleActivity.Documents.length > 0 && (
					<div>
						<ActivityDocuments documents={singleActivity.Documents} />
					</div>
				)}
				<div className='flex items-center justify-between gap-10 mt-2'>
					<div className='flex flex-wrap items-start justify-between gap-10'>
						{isLiking ? (
							<Spinner />
						) : (
							<div className='flex items-center gap-2'>
								{singleActivity.HasLiked ? (
									<img
										src={liked}
										className={`h-${iconSize} w-${iconSize} cursor-pointer text-system-error`}
										onClick={onUnLikeBtnClicked}
									/>
								) : (
									<img src={like} className={`h-${iconSize} w-${iconSize} cursor-pointer`} onClick={onLikeBtnClicked} />
								)}
								<ViewLikedMembers activity={singleActivity} timeSize={timeSize} />
							</div>
						)}
						<div className='flex items-center gap-2 cursor-pointer' onClick={() => setShowComment((prev) => !prev)}>
							<img src={reply} className={`h-${iconSize} w-${iconSize} `} />
							<p className={`text-brand-gray-dim mt-1 ${timeSize}`}>{singleActivity.NoOfComments} replies</p>
						</div>
						{/* {isDeleting ? (
							<Spinner />
						) : (
							<div className='flex items-center gap-2 cursor-pointer' onClick={onDeleteBtnClicked}>
								<p className='text-brand-gray-dim mt-1'>Delete</p>
							</div>
						)} */}
					</div>
					<ActivityDropdown
						onRemoveClicked={OnRemoveClicked}
						onSaveClicked={onSaveClicked}
						activity={singleActivity}
						isSaving={isSaving}
					/>
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
						timeSize={timeSize}
						titleSize={titleSize}
						iconSize={iconSize}
						descriptionSize={descriptionSize}
					/>
				)}
			</div>
		)
}

export default ActivityComponent
