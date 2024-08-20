import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../utils/AuthProvider'
import { useNavigate, useParams } from 'react-router-dom'
import MiniTab from '../components/ui/MiniTab'
import SpeakerProfileTab from '../components/Events/SpeakerProfileTab'
import DropdownMenu from '../components/ui/DropdownMenu'
import { relativeTime } from '../utils/date'
import Button from '../components/ui/Button'
import { useToast } from '../components/Toast/ToastService'
import { deleteItem, getItem, patchItem, postItem } from '../constants/operations'
import cover from '../assets/icons/cover.svg'
import { _retrieveData, _storeData, MAINTAB } from '../utils/LocalStorage'
import Tab from '../components/ui/Tab'
import Spinner from '../components/ui/Spinner'
import DiscussionActivities from '../components/Discussions/SingleDiscussionTabs/DiscussionActivities'
import TimeLineTab from '../components/Activities/TimeLineTab'
import DiscussionMembers from '../components/Discussions/SingleDiscussionTabs/DiscussionMembers'
import DiscussionSettings from '../components/Discussions/SingleDiscussionTabs/DiscussionSettings'
import CreateDiscussionStep3 from '../components/Discussions/CreateDiscussion/CreateDiscussionSteps/CreateDiscussionStep3'
import DiscussionAbout from '../components/Discussions/SingleDiscussionTabs/DiscussionAbout'
import DiscussionJoinRequest from '../components/Discussions/SingleDiscussionTabs/DiscussionJoinRequest'
import arrowback from '../assets/icons/arrowback.svg'
import camera from '../assets/icons/camera.svg'
import Modal from '../components/ui/Modal'
import PictureUpload from '../components/Profile/EditProfile/PictureUpload'
import close from '../assets/icons/close.svg'

const SingleDiscussion = () => {
	const [activeTab, setActiveTab] = useState(0)
	const { updateCurrentUser, currentUserData, scrollToTop } = useContext(AuthContext)
	const toast = useToast()
	const { discussionid } = useParams()
	const [discussion, setDiscussion] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()
	const OnClickFollow = () => {}
	const handleGoBack = () => {
		navigate(-1)
	}

	const onTabChange = (item) => {
		setActiveTab(item.key)
	}

	const getDiscussion = () => {
		setIsLoading(true)
		getItem(
			`discussions/${discussionid}`,
			(result) => {
				setDiscussion(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err)
				navigate('/NotFound', { replace: true })
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	useEffect(() => {
		getDiscussion()
	}, [])

	const [isSaving, setIsSaving] = useState(false)
	const getDiscussionUpdate = () => {
		setIsSaving(true)

		getItem(
			`discussions/${discussionid}`,
			(result) => {
				setIsSaving(false)

				setDiscussion(result)
			},
			(err) => {
				setIsSaving(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const saveDiscussion = (id) => {
		setIsSaving(true)
		postItem(
			`saves`,
			{
				EntityId: id,
				Type: 'Discussion',
			},
			(result) => {
				if (result === true) {
					getDiscussionUpdate()
				}
			},
			(err) => {
				setIsSaving(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const removeDiscussion = (id) => {
		setIsSaving(true)
		deleteItem(
			`saves/${id}`,
			(result) => {
				if (result === true) {
					getDiscussionUpdate()
				}
			},
			(err) => {
				setIsSaving(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const tabs = (discussion) => {
		const isPrivate = discussion.Privacy === 'Private'
		const isMember = discussion.IsMember
		const isAccepted = discussion.MembershipStatus === 'Accepted'
		const isAdmin = discussion?.Permissions?.IsAdmin
		if (isAdmin && isPrivate) {
			return [
				{
					key: 0,
					title: 'About',
					render: () => (
						<DiscussionAbout
							discussion={discussion}
							saveDiscussion={saveDiscussion}
							removeDiscussion={removeDiscussion}
							isSaving={isSaving}
						/>
					),
				},
				{
					key: 1,
					title: 'Activities',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<TimeLineTab
								api={`discussions/${discussion?.DocId}/activities`}
								gapBnTabs='gap-7'
								classNameForPost='py-5'
								bordered={true}
							/>
						</div>
					),
				},
				{
					key: 2,
					title: 'Members',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<div>
								<CreateDiscussionStep3 discussionId={discussion.DocId} from='tab' />
							</div>
							<div className='my-4 flex flex-col gap-2'>
								<h1 className='text-system-primary-text font-medium text-lg'>Current Members</h1>

								<DiscussionMembers discussionId={discussion.DocId} />
							</div>
						</div>
					),
				},
				{
					key: 3,
					title: 'Join Requests',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<DiscussionJoinRequest discussionId={discussion.DocId} />
						</div>
					),
				},

				{
					key: 4,
					title: 'Settings',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<DiscussionSettings discussionId={discussion.DocId} discussion={discussion} />
						</div>
					),
				},
			]
		} else if (isAdmin && !isPrivate) {
			return [
				{
					key: 0,
					title: 'About',
					render: () => (
						<DiscussionAbout
							discussion={discussion}
							saveDiscussion={saveDiscussion}
							removeDiscussion={removeDiscussion}
							isSaving={isSaving}
						/>
					),
				},
				{
					key: 1,
					title: 'Activities',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<TimeLineTab
								api={`discussions/${discussion?.DocId}/activities`}
								gapBnTabs='gap-7'
								classNameForPost='py-5'
								bordered={true}
							/>
						</div>
					),
				},
				{
					key: 2,
					title: 'Members',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<div>
								<CreateDiscussionStep3 discussionId={discussion.DocId} from='tab' />
							</div>
							<div className='my-4 flex flex-col gap-2'>
								<h1 className='text-system-primary-text font-medium text-lg'>Current Members</h1>

								<DiscussionMembers discussionId={discussion.DocId} />
							</div>
						</div>
					),
				},

				{
					key: 3,
					title: 'Settings',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<DiscussionSettings discussionId={discussion.DocId} discussion={discussion} />
						</div>
					),
				},
			]
		} else if (!isPrivate || (isMember && isAccepted)) {
			return [
				{
					key: 0,
					title: 'About',
					render: () => (
						<DiscussionAbout
							discussion={discussion}
							saveDiscussion={saveDiscussion}
							removeDiscussion={removeDiscussion}
							isSaving={isSaving}
						/>
					),
				},
				{
					key: 1,
					title: 'Activities',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							<TimeLineTab
								api={`discussions/${discussion?.DocId}/activities`}
								gapBnTabs='gap-7'
								classNameForPost='py-5'
								bordered={true}
								permissions={discussion.Permissions}
							/>
						</div>
					),
				},
				{
					key: 2,
					title: 'Members',
					render: () => (
						<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
							{discussion.Permissions.CanInviteOthers && (
								<div>
									<CreateDiscussionStep3 discussionId={discussion.DocId} from='tab' />
								</div>
							)}
							<div className='my-4 flex flex-col gap-2'>
								<h1 className='text-system-primary-text font-medium text-lg'>Current Members</h1>

								<DiscussionMembers discussionId={discussion.DocId} />
							</div>
						</div>
					),
				},
			]
		} else {
			return [
				{
					key: 0,
					title: 'About',
					render: () => (
						<DiscussionAbout
							discussion={discussion}
							saveDiscussion={saveDiscussion}
							removeDiscussion={removeDiscussion}
							isSaving={isSaving}
						/>
					),
				},
			]
		}
	}

	const acceptInvite = () => {
		patchItem(
			`discussions/${discussion.DocId}/invite/accept`,
			{},
			(result) => {
				if (result === true) {
					getDiscussion()
					onTabChange(tabs(discussion)[0])
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const joinDiscussion = () => {
		postItem(
			`discussions/${discussion.DocId}/join`,
			{},
			(result) => {
				if (result === true) {
					getDiscussion()
					onTabChange(tabs(discussion)[0])
				} else if (typeof result === 'object') {
					getDiscussion()
					onTabChange(tabs(discussion)[0])
				}
			},
			(err) => console.log(err),
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const unFollowDiscussion = () => {
		deleteItem(
			`discussions/${discussion.DocId}/leave`,
			(result) => {
				if (result === true) {
					getDiscussion()
					onTabChange(tabs(discussion)[0])
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const rejectInvite = () => {
		deleteItem(
			`discussions/${discussion.DocId}/invite/${currentUserData.CurrentUser.UserId}/reject`,
			(result) => {
				if (result === true) {
					getDiscussion()
					onTabChange(tabs(discussion)[0])
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const cancelJoinRequest = () => {
		deleteItem(
			`discussions/${discussion.DocId}/join/${currentUserData.CurrentUser.UserId}/cancel`,
			(result) => {
				if (result === true) {
					getDiscussion()
					onTabChange(tabs(discussion)[0])
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	// cover photo upload logic
	const [isImageUploading, setIsImageUploading] = useState(false)
	const [selectedCoverImage, setSelectedCoverImage] = useState(null)
	const [coverImageToUpload, setCoverImageToUpload] = useState(null)
	const [isCoverPictureOpen, setIsCoverPictureOpen] = useState(false)
	const onCoverImageSelect = (imageData) => {
		setCoverImageToUpload({ ...imageData, Type: 'Discussions' })
		const tempUrl = URL.createObjectURL(new Blob([new Uint8Array(imageData.FileData)]))
		setSelectedCoverImage(tempUrl)
	}
	const onCoverImageDelete = () => {
		setCoverImageToUpload(null)
		setSelectedCoverImage(null)
	}
	const onCoverImageSet = (url) => {
		setIsImageUploading(true)

		patchItem(
			`discussions/${discussionid}/coverPicture`,
			{
				CoverPicture: url,
			},
			(result) => {
				if (result === true) {
					setIsCoverPictureOpen(false)
					getDiscussion()
				}
				setIsImageUploading(false)
			},
			(err) => {
				// console.log(err)
				setIsImageUploading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const onCoverImageUpload = () => {
		if (coverImageToUpload) {
			setIsImageUploading(true)

			postItem(
				'files/users',
				coverImageToUpload,
				(result) => {
					onCoverImageSet(result.FileUrl)
				},
				(err) => {
					// console.log(err)
					setIsImageUploading(false)
				},
				updateCurrentUser,
				currentUserData,
				toast
			)
		} else {
			onCoverImageSet('')
		}
	}

	return (
		<>
			<Modal isOpen={isCoverPictureOpen} maxWidth='max-w-4xl'>
				<Modal.Header>
					<div className='p-2 flex items-center justify-between w-full'>
						<p className='text-lg font-medium'>Cover Photo</p>
						<button
							onClick={() => {
								setIsCoverPictureOpen(false)
							}}
							disabled={isImageUploading}>
							<img src={close} className='h-6  cursor-pointer' alt='' />
						</button>
					</div>
				</Modal.Header>
				<Modal.Body>
					<p className='text-lg font-medium text-center'>
						Your cover photo will be used to customize the header of your profile.
					</p>
					<div className=' flex flex-col items-center justify-center pt-10'>
						<PictureUpload
							// isBanner={false}
							altTitle='Cover Picture'
							selectedImage={selectedCoverImage}
							setSelectedImage={setSelectedCoverImage}
							onImageSelect={onCoverImageSelect}
							onImageDelete={onCoverImageDelete}
							onUploadImage={onCoverImageUpload}
							fileFieldName={'CoverPicture'}
							isUploading={isImageUploading}
						/>
					</div>
				</Modal.Body>
			</Modal>
			<div className='overflow-hidden h-80 lg:h-96 relative'>
				{discussion.CoverPicture ? (
					<>
						<img src={discussion.CoverPicture} className='object-cover h-full w-full' />
					</>
				) : (
					<>
						<img src={cover} className='object-cover h-full w-full' />
					</>
				)}

				<div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6  h-100 overflow-hidden overflow-y-auto bg-system-black-transparent'>
					<div className='flex w-full items-start justify-between'>
						<div
							className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}
							onClick={handleGoBack}>
							<img src={arrowback} alt='' className='h-6 cursor-pointer' />

							{/* <h4 className='font-medium text-xl text-brand-secondary'>Back</h4> */}
						</div>
						{discussion?.Permissions?.IsAdmin && (
							<div
								onClick={() => {
									setIsCoverPictureOpen(true)
									if (discussion.CoverPicture) {
										setSelectedCoverImage(discussion.CoverPicture)
									} else {
										setSelectedCoverImage(null)
									}
								}}
								className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}>
								<img src={camera} alt='' className='h-6 cursor-pointer' />
							</div>
						)}
					</div>
					<div>
						<h4 className='font-medium shadow-lg text-4xl text-white mb-3'>{discussion.DiscussionName}</h4>
						<div className='flex flex-row flex-wrap gap-3'>
							{/* <h4 className='text-2xl text-white'>Virtual Event</h4>
							<h4 className='text-2xl text-white'>•</h4> */}
							<h4 className='text-2xl text-white'>{discussion.NoOfMembers} Participants</h4>
							<h4 className='text-2xl text-white'>•</h4>
							<h4 className='text-2xl text-white'>{discussion.Privacy}</h4>
						</div>
					</div>
				</div>
			</div>
			<div>
				{isLoading ? (
					<div className='h-20 w-full flex items-center justify-center'>
						<Spinner />
					</div>
				) : (
					<div className='grid lg:grid-cols-4 gap-2 bg-system-primary-bg p-2'>
						<div className=''>
							<div className='p-5 lg:px-12 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8'>
								<div className='flex flex-row justify-between mt-1 lg:mt-3'>
									<h4 className='font-semibold text-2xl text-system-primary-text'>Brief</h4>
								</div>
								<h4 className='text-xl text-brand-gray mt-2 mb-12 leading-8 whitespace-pre-line'>{discussion.Brief}</h4>
								<div className='flex gap-2'>
									{discussion.IsMember ? (
										<>
											{currentUserData.CurrentUser.UserId !== discussion.OrganiserId && (
												<Button variant='outline' onClick={() => unFollowDiscussion()}>
													Unfollow
												</Button>
											)}
										</>
									) : discussion.MembershipStatus === undefined ? (
										<Button variant='black' onClick={() => joinDiscussion()}>
											Follow
										</Button>
									) : discussion.MembershipStatus === 'Requested' ? (
										<Button variant='outline' onClick={() => cancelJoinRequest()}>
											Cancel Request
										</Button>
									) : discussion.MembershipStatus === 'Invited' ? (
										<div className='flex flex-col items-start gap-2'>
											<p className='text-system-secondary-text'>You have been invited to this discussion</p>
											<div className='flex gap-2'>
												<Button variant='outline' onClick={() => rejectInvite()}>
													Reject
												</Button>
												<Button variant='black' onClick={() => acceptInvite()}>
													Accept
												</Button>
											</div>
										</div>
									) : null}
								</div>
								{/* {discussion.Privacy === 'Private' ? (
									<>
										{discussion.Status === 'Invited' ? (
											<>
												<Button onClick={() => acceptInvite()} width='full' variant='black'>
													Accept invite
												</Button>
											</>
										) : (
											<>
												<Button
													onClick={() => unFollowDiscussion()}
													width='full'
													variant='black'
													className='bg-system-secondary-text border-system-secondary-text'>
													Unfollow
												</Button>
											</>
										)}
									</>
								) : (
									<>
										{!discussion.IsMember ? (
											<Button onClick={() => joinDiscussion()} width='full' variant='black'>
												Follow
											</Button>
										) : (
											<Button
												onClick={() => unFollowDiscussion()}
												width='full'
												variant='black'
												className='bg-system-secondary-text border-system-secondary-text'>
												Unfollow
											</Button>
										)}
									</>
								)} */}
							</div>
						</div>
						<div className='lg:col-span-3'>
							{discussion && (
								<Tab
									onTabChange={onTabChange}
									activeTab={activeTab}
									name='SingleDiscussion'
									tabs={tabs(discussion)}
									alignment='justify-start'
								/>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default SingleDiscussion

// UNUSED PREVIOUS CODE

// const miniEventTabs = () => [
// 	{
// 		title: "Speakers' Profile",
// 		render: () => (
// 			<div className='py-3 pt-6 flex flex-col gap-8'>
// 				<SpeakerProfileTab />
// 				<SpeakerProfileTab />
// 			</div>
// 		),
// 	},
// 	{
// 		title: 'Event Agenda',
// 		render: () => <div className='py-3 pt-6'></div>,
// 	},
// ]
