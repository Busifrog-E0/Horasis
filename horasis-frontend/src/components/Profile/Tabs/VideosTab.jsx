import { useContext, useEffect, useState } from 'react'
import VideoPlayer from '../../ui/VideoPlayer'
import { AuthContext } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import { getItem } from '../../../constants/operations'
import EmptyMembers from '../../Common/EmptyMembers'
import Spinner from '../../ui/Spinner'

const VideosTab = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [videos, setVideos] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
		Type: 'video',
	})
	const api = `users/${currentUserData.CurrentUser.UserId}/media`
	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getVideos = (tempArr) => {
		getData(`${api}?&${jsonToQuery(filters)}`, tempArr, setVideos)
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
		getVideos(initialRender ? [] : videos)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (videos.length > 0) hasAnyLeft(`${api}`, videos)
	}, [videos])

	useEffect(() => {
		fetch()
	}, [filters])

	return (
		<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<div className='grid grid-cols-2 gap-4 p-4'>
						{videos && (
							<>
								{videos.length > 0 ? (
									<>
										{videos.map((video) => {
											return <VideoPlayer key={video.DocId} url={video.FileUrl} />
										})}
									</>
								) : (
									<div className='col-span-2'>
										<EmptyMembers emptyText={'No videos uploaded'} />
									</div>
								)}
							</>
						)}
					</div>
            
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
							className='flex flex-row justify-center mt-2 mb-2'>
							<div className='cursor-pointer flex items-center gap-2'>
								<h4 className='text-sm font-medium text-system-primary-accent'>Load more videos</h4>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}

export default VideosTab
