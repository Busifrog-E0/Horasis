import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TimeLineTab from '../components/Activities/TimeLineTab'
import PodcastSettings from '../components/Podcasts/SinglePodcastTabs/PodcastSettings'
import { useToast } from '../components/Toast/ToastService'
import Button from '../components/ui/Button'
import Tab from '../components/ui/Tab'
import useDeleteData from '../hooks/useDeleteData'
import useGetData from '../hooks/useGetData'
import usePostData from '../hooks/usePostData'
import { useAuth } from '../utils/AuthProvider'
import Spinner from '../components/ui/Spinner'
import useTranslation from '../hooks/useTranslation'

const SinglePodcast = () => {
	const [activeTab, setActiveTab] = useState(0)
	const { currentUserData } = useAuth()
	const toast = useToast()
	const { podcastid } = useParams()
	const { isLoading, data: podcast, getData: getPodcast, setData: setPodcast } = useGetData(`podcasts/${podcastid}`)

	const navigate = useNavigate()
	const handleGoBack = () => navigate(-1)

	const onTabChange = (item) => {
		setActiveTab(item.key)
	}

	const tabs = (podcast) => {
		const { Privacy, IsMember, MembershipStatus, Permissions, DocId } = podcast
		const isPrivate = Privacy === 'Private'
		const isMember = IsMember && MembershipStatus === 'Accepted'
		const isAdmin = Permissions?.IsAdmin
		const canInvite = Permissions?.CanInviteOthers

		const getActivitiesTab = (key) => ({
			key: key,
			title: 'Episodes',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					<TimeLineTab
						api={`activities`}
						gapBnTabs='gap-7'
						classNameForPost='py-5'
						bordered={true}
						permissions={Permissions}
						entId={DocId}
						type='Podcast'
						from='podcast'
					/>
				</div>
			),
		})

		const getSettingsTab = (key) => ({
			key: key,
			title: 'Settings',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					<PodcastSettings podcastId={DocId} podcast={podcast} />
				</div>
			),
		})

		const getEmptyTab = (key) => ({
			key: key,
			title: 'Join Podcast',
			render: () => {
				return <div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'></div>
			},
		})

		if (isAdmin && isPrivate) {
			return [getActivitiesTab(0), getSettingsTab(1)]
		} else if (isAdmin && !isPrivate) {
			return [getActivitiesTab(0), getSettingsTab(1)]
		} else if (!isPrivate || isMember) {
			return [getActivitiesTab(0)]
		} else {
			return [getEmptyTab(0)]
		}
	}

	const { postData: postFn, isLoading: isPostLoading } = usePostData()
	const { deleteData: deleteFn, isLoading: isDeleteLoading } = useDeleteData('', {})

	const followPodcast = (podcast) => {
		postFn({
			endpoint: `members/${podcast.DocId}/join`,
			payload: { Type: 'Podcast' },
			onsuccess: (result) => {
				if (result === true) {
					getPodcast()
				} else if (typeof result === 'object') {
					getPodcast()
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
					getPodcast()
				} else if (typeof result === 'object') {
					getPodcast()
				}
			},
		})
	}

	const {
		isTranslated: translated,
		isTranslating: translating,
		translate: translatePodcast,
		showOriginal,
		homeLanguage,
	} = useTranslation({ data: podcast, setData: setPodcast, Type: 'Podcast' })

	return (
		<>
		
			<div className=' col-span-3 bg-system-primary-bg rounded-lg  my-2 p-4 flex flex-col gap-2'>
			{/* {podcast?.OriginalLanguage !== homeLanguage && (
				<>
					<h4 className='text-2xl text-white'>•</h4>
					{translating ? (
						<h4 className='text-2xl text-white  cursor-pointer'>Translating...</h4>
					) : (
						<>
							{translated ? (
								<h4 className='text-2xl text-white  cursor-pointer' onClick={showOriginal}>
									Show Original
								</h4>
							) : (
								<h4 className='text-2xl text-white  cursor-pointer' onClick={translatePodcast}>
									Translate this podcast
								</h4>
							)}
						</>
					)}
				</>
			)} */}
				{/* Podcast Cover Image */}
				<div className='flex items-start gap-6 bg-system-secondary-bg p-4'>
					<img
						src={podcast?.CoverPicture}
						alt='Podcast Cover'
						className='h-64 aspect-square object-cover rounded-lg' // Make image full width with rounded top corners
					/>

					<div className='flex flex-col justify-between  flex-1 gap-10'>
						<div>
							{/* Podcast Title */}
							<h1 className='text-4xl font-bold text-system-primary-text'>{podcast?.PodcastName}</h1>

							{/* Podcast Description */}
							<p className='text-lg text-system-secondary-text leading-relaxed'>{podcast?.Description}</p>
							<p className='text-md text-system-primary-text mt-4 italic'>{podcast?.Brief}</p>
						</div>
						<div>
							<div className='flex items-center justify-start my-2 gap-2'>
								{isPostLoading || isDeleteLoading || isLoading ? (
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
				</div>
				<div className='lg:col-span-3'>
					{podcast && (
						<Tab
							onTabChange={onTabChange}
							activeTab={activeTab}
							name='SinglePodcast'
							tabs={tabs(podcast)}
							alignment='justify-start'
						/>
					)}
				</div>
			</div>
		</>
	)
}

export default SinglePodcast
