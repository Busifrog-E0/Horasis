import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useEntityMembershipManager from '../../hooks/useEntityMembershipManager'
import useGetData from '../../hooks/useGetData'
import useGetList from '../../hooks/useGetList'
import { useAuth } from '../../utils/AuthProvider'
import EmptyMembers from '../Common/EmptyMembers'
import SearchComponent from '../Search/SearchBox/SearchComponent'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'

const PodcastsSection = () => {
	const {
		data: podcasts,
		isLoading,
		isLoadingMore,
		isPageDisabled,
		filters,
		setFilters,
		getList,
	} = useGetList('podcasts', {}, true, true, true, [])

	return (
		<>
			<SearchComponent
				searchKey={filters.Keyword}
				setSearchKey={(value) => setFilters({ ...filters, Keyword: value })}
				placeholder='Search Podcasts'
			/>
			<h4 className='font-bold text-2xl text-system-primary-accent mt-4 mb-2'>Podcasts</h4>
			<h4 className=' text-base text-system-primary-text mb-2'>
				Explore a wide variety of podcasts on various topics.
			</h4>
			<div className='max-w-6xl col-span-2 my-4'>
				{isLoading ? (
					<Spinner />
				) : podcasts.length > 0 ? (
					<>
						<div className='flex flex-col gap-8'>
							{podcasts.map((podcast) => (
								<PodcastItem key={podcast.DocId} podcast={podcast} />
							))}
						</div>

						{/* Load More Section */}
						<div className='my-4'>
							{isLoadingMore && (
								<div className='bg-system-primary-bg p-4  '>
									<Spinner />
								</div>
							)}
							{!isPageDisabled && (
								<div onClick={() => getList(podcasts, false)} className='flex flex-row justify-end mt-4 mb-2'>
									<div className='cursor-pointer flex items-center gap-2'>
										<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
									</div>
								</div>
							)}
						</div>
					</>
				) : (
					<EmptyMembers emptyText={'No podcasts available.'} />
				)}
			</div>
		</>
	)
}

export default PodcastsSection

const PodcastItem = ({ podcast }) => {
	const navigate = useNavigate()
	const { currentUserData } = useAuth()
	const [singlePodcast, setSinglePodcast] = useState(podcast)

	const { isLoading: isLoadingPodcast, getData: getPodcast } = useGetData(
		`podcasts/${podcast.DocId}`,
		{ onSuccess: (result) => setSinglePodcast(result) },
		false
	)

	const {
		isLoading,
		subscribeEntityMembership: followPodcast,
		unsubscribeEntityMembership: unFollowPodcast,
		cancelEntityMembershipSubscription,
		acceptEntityMembershipInvitation,
		rejectEntityMembershipInvitation,
	} = useEntityMembershipManager({
		EntityId: podcast?.DocId,
		Type: 'Podcast',
		successCallback: getPodcast,
		errorCallback: () => {},
	})

	if (singlePodcast) {
		return (
			<div
				onClick={() => navigate(`/Podcasts/${singlePodcast?.DocId}`)}
				className='bg-system-secondary-bg rounded-lg shadow-sm cursor-pointer transition relative overflow-hidden flex items-center'>
				<div className='w-48 h-48 flex-shrink-0'>
					<img src={singlePodcast?.CoverPicture} alt='Podcast Cover' className='w-full h-full object-cover ' />
				</div>

				<div className='p-4 flex-grow'>
					<h2 className='text-2xl font-semibold text-system-primary-text'>{singlePodcast?.PodcastName}</h2>
					<p className='text-system-secondary-text my-2 line-clamp-2'>{singlePodcast?.Description}</p>
					<div className='flex items-center justify-start my-2 gap-2'>
						{isLoading || isLoadingPodcast ? (
							<Spinner />
						) : (
							<>
								{singlePodcast?.IsMember ? (
									<>
										{currentUserData.CurrentUser.UserId !== singlePodcast?.OrganiserId && (
											<Button
												variant='outline'
												onClick={(e) => {
													e.stopPropagation()
													unFollowPodcast()
												}}>
												Unfollow
											</Button>
										)}
									</>
								) : (
									<>
										{singlePodcast?.MembershipStatus === undefined && (
											<Button
												variant='black'
												onClick={(e) => {
													e.stopPropagation()
													followPodcast()
												}}>
												Follow
											</Button>
										)}
										{/* {singlePodcast?.MembershipStatus === 'Requested' && (
									<Button variant='outline' onClick={() => cancelJoinRequest()}>
										Cancel Request
									</Button>
								)} */}
										{/* {singlePodcast?.MembershipStatus === 'Invited' && (
									<div className='flex flex-col items-center gap-2 px-4 '>
										<p className='text-system-secondary-text text-center text-xs'>
											You have been invited to this discussion
										</p>
										<div className='flex gap-2'>
											<Button variant='black' onClick={() => acceptInvite()}>
												Accept
											</Button>
											<Button variant='outline' onClick={() => rejectInvite()}>
												Reject
											</Button>
										</div>
									</div>
								)} */}
									</>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		)
	}
}
