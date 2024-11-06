import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import { AuthContext } from '../../utils/AuthProvider'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import { getItem } from '../../constants/operations'
import ActivityListComponent from './ActivityListComponent'
import Spinner from '../ui/Spinner'
import EmptyMembers from '../Common/EmptyMembers'
import { useToast } from '../Toast/ToastService'
import ActivityComponent from './ActivityComponent'
import PostComponent from './PostComponent'

const TimeLineTab = ({
	gapBnTabs = '',
	bordered = false,
	header,
	classNameForPost = '',
	api = 'feed',
	permissions = {
		IsAdmin: true,
		CanInviteOthers: true,
		CanPostActivity: true,
		CanUploadPhoto: true,
		CanUploadVideo: true,
		CanCreateAlbum: true,
	},
	type = '',
	entId = '',
}) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [activitiesData, setActivitiesData] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
	})

	const onDelete = (DocId) => {
		console.log(DocId)
		setActivitiesData(activitiesData.filter((d) => d.DocId !== DocId))
	}

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getAllActivities = (tempActivites) => {
		getData(`${api}?&${jsonToQuery({ ...filters, Type: type, EntityId: entId })}`, tempActivites, setActivitiesData)
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
			`${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...filters, Limit: 1, Type: type, EntityId: entId })}`,
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
		getAllActivities(initialRender ? [] : activitiesData)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (activitiesData.length > 0) hasAnyLeft(`${api}`, activitiesData)
	}, [activitiesData])

	useEffect(() => {
		fetch()
	}, [filters])

	return (
		<div>
			<PostComponent
				className={classNameForPost}
				onSuccess={fetch}
				permissions={permissions}
				api={api}
				type={type}
				entId={entId}
			/>

			{header && <h4 className='font-medium text-2xl text-system-primary-text mt-3 lg:mt-9 mb-4'>All Updates</h4>}

			{isLoading ? (
				<Spinner />
			) : activitiesData.length > 0 ? (
				<>
					<ActivityListComponent
						avatarSize={'w-16 h-16'}
						ShowImage={true}
						className={`p-5 bg-system-secondary-bg rounded-lg ${
							bordered && 'border border-system-file-border'
						} relative`}
						onDelete={onDelete}
						gapBnTabs={gapBnTabs}
						bordered={bordered}
						activitiesData={activitiesData}
					/>
					{isLoadingMore && (
						<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
							<Spinner />
						</div>
					)}
					{!pageDisabled && (
						<div onClick={fetchMore} className='flex flex-row justify-end mt-4 mb-2'>
							<div className='cursor-pointer flex items-center gap-2'>
								<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
								{/* <svg className="text-system-primary-accent h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg> */}
							</div>
						</div>
					)}
				</>
			) : (
				<EmptyMembers emptyText={"You don't have any updates."} />
			)}
		</div>
	)
}

export default TimeLineTab
