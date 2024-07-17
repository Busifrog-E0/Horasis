import { relativeTime } from '../../utils/date'
import DropdownMenu from '../ui/DropdownMenu'
import avatar from '../../assets/icons/avatar.svg'
import like from '../../assets/icons/like.svg'
import reply from '../../assets/icons/reply.svg'
import ActivityCarousel from './ActivityCarousel'
import ActivityComment from './Comment/ActivityComment'
import { useContext, useEffect, useState } from 'react'
import ActivityCommentList from './Comment/ActivityCommentList'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { getItem } from '../../constants/operations'
import { getNextId } from '../../utils/URLParams'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
const ActivityComponent = ({ activity, activityId }) => {
	const [showComment, setShowComment] = useState(false)
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [commentsData, setCommentsData] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Keyword: '',
		Limit: 10,
		Keyword: '',

	})
	const [isLoadingActivity, setIsLoadingActivity] = useState(true)
	const [singleActivity, setSingleActivity] = useState(activity)

	const getSingleActivity = () => {
		getActivity(`activities/${activityId}`, setSingleActivity)
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
		if (showComment)
			fetch()
	}, [showComment])

	useEffect(() => {
		if (activityId)
			getSingleActivity()
		else setIsLoadingActivity(false)
	}, [activityId])



	if (singleActivity)
		return (
			<div className='p-5 bg-system-secondary-bg rounded-lg'>
				<div className='flex items-start gap-2'>
					{singleActivity.UserDetails?.ProfilePicture ? (
						<>
							<img className='w-16 h-16 rounded-full' src={singleActivity.UserDetails?.ProfilePicture} alt='Rounded avatar' />
						</>
					) : (
						<>
							<img className='w-16 h-16 rounded-full' src={avatar} alt='Rounded avatar' />
						</>
					)}

					<div className='flex-1'>
						<div className='flex items-start justify-between gap-10'>
							<div className='flex  flex-col gap-1'>
								<h4 className='font-semibold text-xl text-system-primary-accent mt-1'>{singleActivity.UserDetails?.FullName}</h4>
								{/* <h4 className='text-system-primary-text text-md'>Updated their photo</h4> */}
							</div>
							<h4 className='font-medium text-base text-brand-gray-dim'>{relativeTime(new Date().getTime())}</h4>
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
						<div className='flex items-center gap-2 cursor-pointer'>
							<img src={like} className='h-6 w-6' />
							<p className='text-brand-gray-dim mt-1'>{singleActivity.NoOfLikes} likes</p>
						</div>
						<div className='flex items-center gap-2 cursor-pointer' onClick={() => setShowComment((prev) => !prev)}>
							<img src={reply} className='h-6 w-6' />
							<p className='text-brand-gray-dim mt-1'>{singleActivity.NoOfComments} replies</p>
						</div>
					</div>
					<DropdownMenu />
				</div>
				{showComment && <ActivityCommentList comments={commentsData} activity={singleActivity} />}
			</div>
		)
}

export default ActivityComponent
