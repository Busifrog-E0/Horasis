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
import useTranslation from '../hooks/useTranslation'
import useGetData from '../hooks/useGetData'
import usePostData from '../hooks/usePostData'
import useDeleteData from '../hooks/useDeleteData'
import useUpdateData from '../hooks/useUpdateData'
import usePatchItem from '../hooks/useUpdateData'
import useEntitySaveManager from '../hooks/useEntitySaveManager'
import useEntityMembershipManager from '../hooks/useEntityMembershipManager'
import Settings from '../components/Common/PermissionsManagement/Settings'

const SingleDiscussion = () => {
	const [activeTab, setActiveTab] = useState(0)
	const { updateCurrentUser, currentUserData, scrollToTop } = useContext(AuthContext)
	const toast = useToast()
	const { discussionid } = useParams()
	const {
		isLoading: isLoadingDiscussion,
		data: discussion,
		getData: getDiscussion,
		setData: setDiscussion,
	} = useGetData(`discussions/${discussionid}`)

	const navigate = useNavigate()
	const handleGoBack = () => {
		navigate(-1)
	}

	const onTabChange = (item) => {
		setActiveTab(item.key)
	}

	const { isSaving, isUnsaving, saveEntity, unsaveEntity } = useEntitySaveManager({
		EntityId: discussion?.DocId,
		Type: 'Discussion',
		successCallback: getDiscussion,
		errorCallback: () => {},
	})

	const tabs = (discussion) => {
		const { Privacy, IsMember, MembershipStatus, Permissions, DocId } = discussion
		const isPrivate = Privacy === 'Private'
		const isMember = IsMember && MembershipStatus === 'Accepted'
		const isAdmin = Permissions?.IsAdmin
		const canInvite = Permissions?.CanInviteOthers

		const getAboutTab = (key) => ({
			key: key,
			title: 'About',
			render: () => (
				<DiscussionAbout
					discussion={discussion}
					saveDiscussion={saveEntity}
					removeDiscussion={unsaveEntity}
					isSaving={isSaving || isUnsaving || isLoading}
				/>
			),
		})

		const getActivitiesTab = (key) => ({
			key: key,
			title: 'Activities',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					<TimeLineTab
						api={`activities`}
						gapBnTabs='gap-7'
						classNameForPost='py-5'
						bordered={true}
						permissions={Permissions}
						type='Discussion'
						entId={DocId}
					/>
				</div>
			),
		})

		const getMembersTab = (key) => ({
			key: key,
			title: 'Members',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					{canInvite && <CreateDiscussionStep3 discussionId={DocId} from='tab' />}
					<div className='my-4 flex flex-col gap-2'>
						<h1 className='text-system-primary-text font-medium text-lg'>Current Members</h1>
						<DiscussionMembers discussionId={DocId} />
					</div>
				</div>
			),
		})

		const getJoinRequestsTab = (key) => ({
			key: key,
			title: 'Join Requests',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					<DiscussionJoinRequest discussionId={DocId} />
				</div>
			),
		})

		const getSettingsTab = (key) => ({
			key: key,
			title: 'Settings',
			render: () => (
				<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
					<Settings EntityId={DocId} Entity={discussion} Type='Discussion' />
				</div>
			),
		})

		// Tabs logic based on the user's permissions and privacy
		if (isAdmin && isPrivate) {
			return [getAboutTab(0), getActivitiesTab(1), getMembersTab(2), getJoinRequestsTab(3), getSettingsTab(4)]
		} else if (isAdmin && !isPrivate) {
			return [getAboutTab(0), getActivitiesTab(1), getMembersTab(2), getSettingsTab(3)]
		} else if (!isPrivate || isMember) {
			return [getAboutTab(0), getActivitiesTab(1), getMembersTab(2)]
		} else {
			return [getAboutTab(0)]
		}
	}

	const successCallback = () => {
		getDiscussion()
		onTabChange(tabs(discussion)[0])
	}

	const {
		isLoading,
		subscribeEntityMembership: joinDiscussion,
		unsubscribeEntityMembership: unFollowDiscussion,
		cancelEntityMembershipSubscription: cancelJoinRequest,
		acceptEntityMembershipInvitation: acceptInvite,
		rejectEntityMembershipInvitation: rejectInvite,
	} = useEntityMembershipManager({
		EntityId: discussion?.DocId,
		Type: 'Discussion',
		successCallback: successCallback,
		errorCallback: () => {},
	})

	// cover photo upload logic
	const [selectedCoverImage, setSelectedCoverImage] = useState(null)
	const [coverImageToUpload, setCoverImageToUpload] = useState(null)
	const [isCoverPictureOpen, setIsCoverPictureOpen] = useState(false)

	const { isLoading: isCoverUploading, postData: postCoverUpload } = usePostData({
		onSuccess: (result) => {
			onCoverImageSet(result.FileUrl)
		},
	})
	const { isLoading: isCoverPatching, updateData: updateCoverUpload } = useUpdateData({
		onSuccess: (result) => {
			if (result === true) {
				setIsCoverPictureOpen(false)
				getDiscussion()
			}
		},
	})

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
		return updateCoverUpload({
			endpoint: `discussions/${discussionid}/coverPicture`,
			payload: { CoverPicture: url },
		})
	}
	const onCoverImageUpload = () => {
		if (coverImageToUpload) {
			postCoverUpload({
				endpoint: 'files/users',
				payload: coverImageToUpload,
			})
		} else {
			onCoverImageSet('')
		}
	}

	const {
		isTranslated: translated,
		isTranslating: translating,
		translate: translateDiscussion,
		showOriginal,
		homeLanguage,
	} = useTranslation({ data: discussion, setData: setDiscussion, Type: 'Discussion' })

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
							disabled={isCoverPatching || isCoverUploading}>
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
							altTitle='Cover Picture'
							selectedImage={selectedCoverImage}
							setSelectedImage={setSelectedCoverImage}
							onImageSelect={onCoverImageSelect}
							onImageDelete={onCoverImageDelete}
							onUploadImage={onCoverImageUpload}
							fileFieldName={'CoverPicture'}
							isUploading={isCoverPatching || isCoverUploading}
						/>
					</div>
				</Modal.Body>
			</Modal>
			<div className='overflow-hidden h-80 lg:h-96 relative'>
				{discussion?.CoverPicture ? (
					<img src={discussion?.CoverPicture} className='object-cover h-full w-full' />
				) : (
					<img src={cover} className='object-cover h-full w-full' />
				)}

				<div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6  h-100 overflow-hidden overflow-y-auto bg-system-black-transparent'>
					<div className='flex w-full items-start justify-between'>
						<div
							className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}
							onClick={handleGoBack}>
							<img src={arrowback} alt='' className='h-6 cursor-pointer' />
						</div>
						{discussion?.Permissions?.IsAdmin && (
							<div
								onClick={() => {
									setIsCoverPictureOpen(true)
									if (discussion?.CoverPicture) {
										setSelectedCoverImage(discussion?.CoverPicture)
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
						<h4 className='font-medium shadow-lg text-4xl text-white mb-3'>{discussion?.DiscussionName}</h4>
						<div className='flex flex-row flex-wrap gap-3'>
							<h4 className='text-2xl text-white'>{discussion?.NoOfMembers} Participants</h4>
							<h4 className='text-2xl text-white'>•</h4>
							<h4 className='text-2xl text-white'>{discussion?.Privacy}</h4>
							{discussion?.OriginalLanguage !== homeLanguage && (
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
												<h4 className='text-2xl text-white  cursor-pointer' onClick={translateDiscussion}>
													Translate this discussion
												</h4>
											)}
										</>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			<div>
				{isLoading || isLoadingDiscussion ? (
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
								<h4 className='text-xl text-brand-gray mt-2 mb-12 leading-8 whitespace-pre-line'>
									{discussion?.Brief}
								</h4>
								<div className='flex gap-2'>
									{discussion?.IsMember ? (
										<>
											{currentUserData.CurrentUser.UserId !== discussion?.OrganiserId && (
												<Button variant='outline' onClick={() => unFollowDiscussion()}>
													Unfollow
												</Button>
											)}
										</>
									) : discussion?.MembershipStatus === undefined ? (
										<Button variant='black' onClick={() => joinDiscussion()}>
											Follow
										</Button>
									) : discussion?.MembershipStatus === 'Requested' ? (
										<Button variant='outline' onClick={() => cancelJoinRequest()}>
											Cancel Request
										</Button>
									) : discussion?.MembershipStatus === 'Invited' ? (
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
