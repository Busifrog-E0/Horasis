import { useContext, useState } from 'react'
import { getItem } from '../../../../constants/operations'
import EmptyMembers from '../../../Common/EmptyMembers'
import Spinner from '../../../ui/Spinner'
import { AuthContext } from '../../../../utils/AuthProvider'
import { useToast } from '../../../Toast/ToastService'
import MemberSearchSectionTab from './MemberSearchSectionTab'

const MembersSearchSection = ({
	members,
	emptyText,
	updateList,
	whichTime,
	isLoadingMore,
	pageDisabled,
	fetchMore,
	tabName,
}) => {
	console.log(pageDisabled)
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [updatingId, setUpdatingId] = useState(null)
	const updateSingleData = (profile, actionType) => {
		setUpdatingId(profile.DocId)
		getItem(
			`users/${profile.DocId}`,
			(result) => {
				if (actionType === 'REMOVE') {
					updateList(members.filter((member) => member.DocId !== profile.DocId))
				} else if (actionType === 'UPDATE') {
					updateList(members.map((member) => (member.DocId === profile.DocId ? { ...member, ...result } : member)))
				}
				setUpdatingId(null)
			},
			(err) => {
				setUpdatingId(null)
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	/*
	UPDATE FUNCTION:
	  ALL MEMBERS : UPDATE LIST
	  CONNECTIONS : REMOVE FROM LIST - UNCONNECT / UPDATE LIST - FOLLOW - UNFOLLOW
	  RECEIVED    : REMOVE FROM LIST - ACCEPT - REJECT / UPDATE LIST - FOLLOW - UNFOLLOW
	  SENT        : REMOVE FROM LIST - CANCEL  / UPDATE LIST - FOLLOW - UNFOLLOW
	  FOLLOWING   : REMOVE FROM LIST - UNFOLLOW / UPDATE LIST - CONNECT UNCONNECT ACCEPT REJECT
	  FOLLOWERS   : UPDATE LIST 
  */
	return (
		<>
			<div className='flex flex-col gap-5'>
				{members ? (
					<>
						{members.length > 0 ? (
							<>
								{members.map((item, index) => {
									let lastElement = members.length === index + 1
									return (
										<MemberSearchSectionTab
											key={index}
											profile={item}
											lastElement={lastElement}
											updateList={(actionType) => {
												updateSingleData(item, actionType)
											}}
											whichTime={whichTime}
											updatingId={updatingId}
											tabName={tabName}
										/>
									)
								})}
							</>
						) : (
							<>
								<EmptyMembers emptyText={emptyText} />
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
						{/* <svg className="text-system-primary-accent h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg> */}
					</div>
				</div>
			)}
		</>
	)
}

export default MembersSearchSection
