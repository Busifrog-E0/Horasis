import { forwardRef, useContext, useEffect, useState } from 'react'
import people from '../../assets/tempimages/people.jpg'
import { getNextId } from '../../utils/URLParams'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { relativeTime } from '../../utils/date'
import { useNavigate } from 'react-router-dom'

const HomeDiscussionSec = (props, ref) => {
	const navigate = useNavigate()
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [guestDiscussions, setGuestDiscussions] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 3,
		Keyword: '',
	})

	const api = `guest/discussions`

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getDiscussions = (tempArr) => {
		getData(`${api}?&${jsonToQuery(filters)}`, tempArr, setGuestDiscussions)
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
		getDiscussions(initialRender ? [] : guestDiscussions)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (guestDiscussions.length > 0) hasAnyLeft(`${api}`, guestDiscussions)
	}, [guestDiscussions])

	useEffect(() => {
		fetch()
	}, [filters])

	return (
		<div className='bg-sky-200 h-max flex flex-col items-center ' ref={ref}>
			<div className='flex items-center justify-center my-20 max-w-screen-2xl w-full'>
				<div className='w-11/12  md:w-8/12 flex flex-col gap-10'>
					<div className='flex flex-col items-center justify-between gap-1'>
						<h1 className='text-3xl text-system-primary-accent'>Community Discussions</h1>
						<p className='text-system-secondary-text'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{guestDiscussions &&
							guestDiscussions.length > 0 &&
							guestDiscussions.map((discussion) => {
								return <HomeDiscussionItem discussion={discussion} key={discussion.DocId} />
							})}
					</div>
					<div className=' w-full  flex items-center justify-center'>
						<button
							className='border border-system-primary-accent bg-system-secondary-bg text-system-primary-accent px-8 py-3 rounded-full cursor-pointer'
							onClick={() => {
								if (currentUserData) {
									navigate('/Discussions')
								} else {
									navigate('/Login')
								}
							}}>
							View More
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

const HomeDiscussionItem = ({ discussion }) => {
	return (
		<div className='flex flex-col gap-4'>
			<div className='rounded-xl overflow-hidden min-h-44 max-h-44 '>
				{discussion.CoverPicture && <img src={discussion.CoverPicture} className='object-cover' alt='' />}
			</div>
			{discussion.DiscussionName && (
				<p className='font-bold text-lg text-system-primary-accent'>{discussion.DiscussionName}</p>
			)}
			{discussion.Description && <p className='text-sm line-clamp-3 flex-1'>{discussion.Description}</p>}
			{discussion.UserDetails && (
				<p className='text-system-secondary-text text-sm'>
					{relativeTime(discussion.CreatedIndex)}- {discussion.UserDetails.FullName}
				</p>
			)}
		</div>
	)
}

const HomeDiscussionsSection = forwardRef(HomeDiscussionSec)

export default HomeDiscussionsSection
