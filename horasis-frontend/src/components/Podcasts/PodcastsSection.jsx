import { useNavigate } from 'react-router-dom'
import useGetList from '../../hooks/useGetList'
import EmptyMembers from '../Common/EmptyMembers'
import SearchComponent from '../Search/SearchBox/SearchComponent'
import Spinner from '../ui/Spinner'
import Button from '../ui/Button'
import usePostData from '../../hooks/usePostData'
import useGetData from '../../hooks/useGetData'
import useDeleteData from '../../hooks/useDeleteData'
import { useAuth } from '../../utils/AuthProvider'
import { useState } from 'react'

const PodcastsSection = () => {
	const { currentUserData } = useAuth()
	const navigate = useNavigate()
	const [loading, setLoading] = useState(null)
	const {
		data: podcasts,
		isLoading,
		isLoadingMore,
		isPageDisabled,
		filters,
		setFilters,
		getList,
		setData: setPodcasts,
	} = useGetList('podcasts', {}, true, true, true, [])

	const { getData: getPodcast, isLoading: isLoadingPodcast } = useGetData(`podcasts`, {}, false)

	const getSinglePodcast = (podcastId) => {
		getPodcast(`podcasts/${podcastId}`, (result) => {
			setLoading(null)
			setPodcasts(
				podcasts.map((podcast) => (podcast.DocId === podcastId ? { NextId: podcast.NextId, ...result } : podcast))
			)
		})
	}

	const { postData: postFn, isLoading: isPostLoading } = usePostData()
	const { deleteData: deleteFn, isLoading: isDeleteLoading } = useDeleteData('', {})

	const followPodcast = (podcast) => {
		postFn({
			endpoint: `members/${podcast.DocId}/join`,
			payload: { Type: 'Podcast' },
			onsuccess: (result) => {
				if (result === true) {
					getSinglePodcast(podcast.DocId)
				} else if (typeof result === 'object') {
					getSinglePodcast(podcast.DocId)
				}
			},
		})
	}

	const unFollowPodcast = (podcast) => {
		deleteFn({
			endPoint: `members/${podcast.DocId}/leave`,
			payload: {},
			onsuccess: (result) => {
				if (result === true) {
					getSinglePodcast(podcast.DocId)
				} else if (typeof result === 'object') {
					getSinglePodcast(podcast.DocId)
				}
			},
		})
	}

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
			{/* <h4 className='font-bold my-3 text-xl text-system-primary-text'>Trending Podcasts</h4> */}
			<div className='max-w-6xl col-span-2 my-4'>
				{isLoading ? (
					<Spinner />
				) : podcasts.length > 0 ? (
					<>
						<div className='flex flex-col gap-8'>
							{podcasts.map((podcast) => (
								<div
									onClick={() => navigate(`/Podcasts/${podcast.DocId}`)}
									key={podcast.DocId}
									className='bg-system-secondary-bg rounded-lg shadow-sm cursor-pointer transition relative overflow-hidden flex items-center'>
									{/* Image container */}
									<div className='w-48 h-48 flex-shrink-0'>
										<img
											src={podcast?.CoverPicture}
											alt='Podcast Cover'
											className='w-full h-full object-cover ' // Image with 1:1 ratio and rounded left corners
										/>
									</div>

									{/* Text container */}
									<div className='p-4 flex-grow'>
										<h2 className='text-2xl font-semibold text-system-primary-text'>{podcast.PodcastName}</h2>
										<p className='text-system-secondary-text my-2 line-clamp-2'>{podcast.Description}</p>
										{/* <p
											className='text-system-secondary-text my-2 line-clamp-2'
										>
											{podcast.Brief}
										</p> */}
										<div className='flex items-center justify-start my-2 gap-2'>
											{loading === podcast.DocId ? (
												<Spinner />
											) : (
												<>
													{podcast.IsMember ? (
														<>
															{currentUserData.CurrentUser.UserId !== podcast.OrganiserId && (
																<Button
																	variant='outline'
																	onClick={(e) => {
																		e.stopPropagation()
																		setLoading(podcast.DocId)
																		unFollowPodcast(podcast)
																	}}>
																	Unfollow
																</Button>
															)}
														</>
													) : (
														<>
															{podcast.MembershipStatus === undefined && (
																<Button
																	variant='black'
																	onClick={(e) => {
																		e.stopPropagation()
																		setLoading(podcast.DocId)
																		followPodcast(podcast)
																	}}>
																	Follow
																</Button>
															)}
															{/* {podcast.MembershipStatus === 'Requested' && (
																<Button variant='outline' onClick={() => cancelJoinRequest()}>
																	Cancel Request
																</Button>
															)} */}
															{/* {podcast.MembershipStatus === 'Invited' && (
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
