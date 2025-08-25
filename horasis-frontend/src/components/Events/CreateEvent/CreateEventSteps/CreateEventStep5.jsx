import { useState } from 'react'
import useGetList from '../../../../hooks/useGetList'
import EmptyMembers from '../../../Common/EmptyMembers'
import InviteMemberTab from '../../../Common/InviteMemberTab'
import SearchComponent from '../../../Search/SearchBox/SearchComponent'
import Button from '../../../ui/Button'
import Spinner from '../../../ui/Spinner'
import InviteSpeakers from '../../InviteSpeakers'

const CreateEventStep5 = ({ changeStep, activeStep, eventId, from = 'create', IsAdmin = false, event }) => {
	const {
		isLoading,
		isLoadingMore,
		isPageDisabled,
		data: invitees,
		filters,
		setFilters,
		getList,
	} = useGetList(`members/${eventId}/members/invite`, {}, true, true, true, [])

	const [showSpeakers, setShowSpeakers] = useState(false)

	return (
		<div className='flex flex-col gap-0'>
			{!showSpeakers ? (
				<>
					<div className='mb-2'>
						<div className='flex-1'>
							<h1 className='text-system-primary-text font-medium text-lg'>Invite Members</h1>
							<p className='text-system-primary-text mt-1 mb-2 text-base'>
								Invite by clicking the 'Invite'. Once done, click 'Done'
							</p>
						</div>
						{from === 'create' && (
							<Button onClick={() => setShowSpeakers(true)} variant='black' className='px-16'>
								Next
							</Button>
						)}
					</div>
					<SearchComponent
						searchKey={filters.Keyword}
						setSearchKey={(value) => setFilters((prev) => ({ ...prev, Keyword: value }))}
						placeholder='Search Members'
					/>
					{isLoading ? (
						<>
							<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
								<Spinner />
							</div>
						</>
					) : (
						<>
							{invitees ? (
								<>
									{invitees.length > 0 ? (
										<>
											{isLoading ? (
												<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
													<Spinner />
												</div>
											) : (
												<>
													{invitees.map((item) => {
														return <InviteMemberTab from='events' invitee={item} key={item.DocId} entityId={eventId} />
													})}
												</>
											)}
										</>
									) : (
										<>
											<EmptyMembers emptyText={'You do not have any connections to invite.'} />
										</>
									)}
								</>
							) : (
								<></>
							)}

							{isLoadingMore && (
								<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
									<Spinner />
								</div>
							)}

							{!isPageDisabled && (
								<div onClick={() => getList(invitees, false)} className='flex flex-row justify-end mt-4 mb-2'>
									<div className='cursor-pointer flex items-center gap-2'>
										<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
									</div>
								</div>
							)}
						</>
					)}
				</>
			) : (
				<InviteSpeakers eventId={eventId} event={event} />
			)}
		</div>
	)
}

export default CreateEventStep5
