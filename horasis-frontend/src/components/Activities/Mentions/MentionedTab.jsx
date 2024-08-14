import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import { getItem } from '../../../constants/operations'
import Spinner from '../../ui/Spinner'
import ActivityListComponent from '../ActivityListComponent'
import EmptyMembers from '../../Common/EmptyMembers'
import arrowfor from  '../../../assets/icons/arrowfor.svg'
import { useNavigate } from 'react-router-dom'

const MentionedTab = ({ bordered = false }) => {
	const  navigate =useNavigate()
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
			`user/${currentUserData.CurrentUser.UserId}/mentions/activities?&${jsonToQuery(filters)}`,
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
			hasAnyLeft(`user/${currentUserData.CurrentUser.UserId}/mentions/activities`, activitiesData)
	}, [activitiesData])

	useEffect(() => {
		fetch()
	}, [filters])

	return (
		<div className='p-5 bg-system-secondary-bg rounded-lg '>
			<div className='flex items-center justify-between gap-2 mb-5'>
				<h4 className='font-medium text-2xl text-system-primary-text'>Mentions</h4>
					<img src={arrowfor} alt='' className='h-6 w-6 cursor-pointer' onClick={()=>navigate('/Mentions')} />
					{/* arrow cursor-pointer */}
			</div>
			<div>
				{/* {header && <h4 className='font-medium text-2xl text-system-primary-text mb-4'>All Mentions</h4>} */}

				{isLoading ? (
					<Spinner />
				) : activitiesData.length > 0 ? (
					<>
						<ActivityListComponent
							ShowImage={false}
							className={`relative`}
							avatarSize='w-8 h-8'
							onDelete={onDelete}
							gapBnTabs={'gap-3'}
							titleSize='text-base'
							descriptionSize="text-sm"
							bordered={bordered}
							activitiesData={activitiesData}
							border={true}
							iconSize={'4'}
							timeSize={'text-xs'}
						/>
					</>
				) : (
					<EmptyMembers emptyText={'No mentions'} />
				)}
			</div>
		</div>
	)
}

export default MentionedTab
