import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import Spinner from '../../ui/Spinner'
import { getItem } from '../../../constants/operations'
import EmptyMembers from '../../Common/EmptyMembers'
import DiscussionMembersTab from './DiscussionMembersTab'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import DiscussionJoinMembers from './DiscussionJoinMembers'

const DiscussionJoinRequest = ({ discussionId }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [members, setMembers] = useState([])
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
	})
	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}
	const getAllMembers = (tempMembers) => {
		getData(`discussions/${discussionId}/members/requested?&${jsonToQuery(filters)}`, tempMembers, setMembers)
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
		getAllMembers(initialRender ? [] : members)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (members.length > 0) hasAnyLeft(`discussions/${discussionId}/members/requested`, members)
	}, [members])

	useEffect(() => {
		fetch()
	}, [])

	if (isLoading) {
		return (
			<div>
				<Spinner />
			</div>
		)
	}

	return (
		<>
			<div className='flex flex-col gap-5'>
				{members ? (
					<>
						{members.length > 0 ? (
							<>
								{members.map((item, index) => {
									return <DiscussionJoinMembers profile={item} key={item.DocId} discussionId={discussionId} fetch={fetch} />
								})}
							</>
						) : (
							<>
								<EmptyMembers emptyText={'No join requests'} />
							</>
						)}
					</>
				) : (
					<></>
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
					className='flex flex-row justify-end mt-4 mb-2'>
					<div className='cursor-pointer flex items-center gap-2'>
						<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
					</div>
				</div>
			)}
		</>
	)
}

export default DiscussionJoinRequest
