import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import { getItem } from '../../../constants/operations'
import Spinner from '../../ui/Spinner'
import ActivityListComponent from '../ActivityListComponent'
import EmptyMembers from '../../Common/EmptyMembers'
import arrowfor from '../../../assets/icons/arrowfor.svg'
import { useNavigate } from 'react-router-dom'

const SavedActivityTab = () => {
    const navigate = useNavigate()
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
		getData(
			`user/${currentUserData.CurrentUser.UserId}/activities/save?&${jsonToQuery(filters)}`,
			tempActivites,
			setActivitiesData
		)
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
		getAllActivities(initialRender ? [] : activitiesData)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (activitiesData.length > 0)
			hasAnyLeft(`user/${currentUserData.CurrentUser.UserId}/activities/save`, activitiesData)
	}, [activitiesData])

	useEffect(() => {
		fetch()
	}, [filters])

	return (
		<div className='p-5 bg-system-secondary-bg rounded-lg'>
			<div className='flex items-center justify-between gap-2 mb-1'>
				<h4 className='font-medium text-2xl text-system-primary-text'>Saved Posts</h4>
				<img src={arrowfor} alt='' className='h-6 w-6 cursor-pointer' onClick={() => navigate('/Saved')} />

				{/* arrow cursor-pointer */}
			</div>
			<div>
				{isLoading ? (
					<Spinner />
				) : activitiesData.length > 0 ? (
					<>
						<ActivityListComponent
							onSaveRemoveCallback={fetch}
							ShowImage={false}
							className={`p-4 bg-system-secondary-bg rounded-lg border border-system-file-border relative`}
							avatarSize='w-10 h-10'
							titleSize='text-sm'
							descriptionSize='text-xs'
							onDelete={onDelete}
							gapBnTabs={'gap-3'}
							bordered={true}
							activitiesData={activitiesData}
							timeSize='text-xs'
							iconSize={'4'}
						/>
						{/* <EmptyMembers emptyText={`${activitiesData.length} saved posts. But some error occured!`} /> */}
					</>
				) : (
					<EmptyMembers emptyText={'No saved posts'} />
				)}
          
			</div>
		</div>
	)
}

export default SavedActivityTab
