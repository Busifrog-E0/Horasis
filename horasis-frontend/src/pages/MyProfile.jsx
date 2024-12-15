import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import altmail from '../assets/icons/altmail.svg'
import arrowback from '../assets/icons/arrowback.svg'
import avatar from '../assets/icons/avatar.svg'
import camera from '../assets/icons/camera.svg'
import close from '../assets/icons/close.svg'
import company from '../assets/icons/company.svg'
import cover from '../assets/icons/cover.svg'
import globe from '../assets/icons/globe.svg'
import job from '../assets/icons/job.svg'
import TimeLineTab from '../components/Activities/TimeLineTab'
import MyConnectionsTab from '../components/Connections/MyConnectionsTab'
import PictureUpload from '../components/Profile/EditProfile/PictureUpload'
import AboutTab from '../components/Profile/Tabs/AboutTab'
import DiscussionsTab from '../components/Profile/Tabs/DiscussionsTab'
import DocumentTab from '../components/Profile/Tabs/DocumentTab'
import ImagesTab from '../components/Profile/Tabs/ImagesTab'
import VideosTab from '../components/Profile/Tabs/VideosTab'
import { useToast } from '../components/Toast/ToastService'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import Tab from '../components/ui/Tab'
import { getItem, patchItem, postItem } from '../constants/operations'
import { AuthContext } from '../utils/AuthProvider'
import { MAINTAB, _retrieveData, _storeData } from '../utils/LocalStorage'
import MyArticlesTab from '../components/Profile/Tabs/MyArticlesTab'
import useGetData from '../hooks/useGetData'

const tabs = (user, getUserDetails) => [
	{
		key: 0,
		title: 'Timeline',
		render: () => (
			<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
				<TimeLineTab api={`user/${user?.DocId}/activities`} gapBnTabs='gap-7' classNameForPost='py-5' bordered={true} />
			</div>
		),
	},
	{
		key: 1,
		title: 'About',
		render: () => <AboutTab user={user} getUserDetails={getUserDetails} isCurrentUser={true} />,
	},
	{
		key: 2,
		title: 'Connections',
		render: () => <MyConnectionsTab />,
	},
	// {
	//   key: 3,
	//   title: 'Events',
	//   render: () => (
	//     <div className='bg-system-secondary-bg p-4 lg:p-10 rounded-b-lg '>
	//       <EventsList cols={4} gap='gap-1 lg:gap-x-16 lg:gap-y-10' emptyText="No events" />
	//     </div>
	//   ),
	// },
	{
		key: 3,
		title: 'Videos',
		render: () => <VideosTab />,
	},
	{
		key: 4,
		title: 'Photos',
		render: () => <ImagesTab />,
	},
	{
		key: 5,
		title: 'Discussions',
		render: () => <DiscussionsTab />,
	},
	{
		key: 6,
		title: 'Documents',
		render: () => <DocumentTab />,
	},
	{
		key: 7,
		title: 'Articles',
		render: () => <MyArticlesTab />,
	},
]

const MyProfile = () => {
	// const [activeTab, setActiveTab] = useState(
	// 	_retrieveData(MAINTAB) && _retrieveData(MAINTAB)['MyProfile'] ? Number(_retrieveData(MAINTAB)['MyProfile']) : 0
	// )
	const [activeTab, setActiveTab] = useState(0)
	const navigate = useNavigate()
	const handleGoBack = () => {
		navigate(-1)
	}

	const onTabChange = (item) => {
		setActiveTab(item.key)
		// _storeData(MAINTAB, { MyProfile: item.key })
	}
	const { currentUserData, updateCurrentUser } = useContext(AuthContext)
	const toast = useToast()
	const {
		isLoading,
		data: user,
		getData: getUserDetails,
	} = useGetData(`users/${currentUserData.CurrentUser.UserId}`, {
		onSuccess: (result) => {
			if (result.ProfilePicture) {
				setSelectedProfileImage(result.ProfilePicture)
			} else {
				setSelectedProfileImage(null)
			}
		},
	})

	const [isImageUploading, setIsImageUploading] = useState(false)

	// profile image upload logic
	const [selectedProfileImage, setSelectedProfileImage] = useState(null)
	const [profileImageToUpload, setProfileImageToUpload] = useState(null)
	const [isProfilePictureOpen, setIsProfilePictureOpen] = useState(false)
	const onProfileImageSelect = (imageData) => {
		setProfileImageToUpload(imageData)
		const tempUrl = URL.createObjectURL(new Blob([new Uint8Array(imageData.FileData)]))
		setSelectedProfileImage(tempUrl)
	}

	const onProfileImageDelete = () => {
		setProfileImageToUpload(null)
		setSelectedProfileImage(null)
	}

	const onProfileImageSet = (url) => {
		setIsImageUploading(true)
		patchItem(
			`users/${currentUserData.CurrentUser.UserId}/picture`,
			{ ProfilePicture: url },
			(result) => {
				if (result === true) {
					getUserDetails()
					setIsProfilePictureOpen(false)
				}
				setIsImageUploading(false)
			},
			(err) => {
				setIsImageUploading(false)

				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const onProfileImageUpload = () => {
		if (profileImageToUpload) {
			setIsImageUploading(true)
			postItem(
				'files/users',
				profileImageToUpload,
				(result) => {
					onProfileImageSet(result.FileUrl)
				},
				(err) => {
					setIsImageUploading(false)
					console.error(err)
				},
				updateCurrentUser,
				currentUserData,
				toast
			)
		} else {
			onProfileImageSet('')
		}
	}

	// cover photo upload logic
	const [selectedCoverImage, setSelectedCoverImage] = useState(null)
	const [coverImageToUpload, setCoverImageToUpload] = useState(null)
	const [isCoverPictureOpen, setIsCoverPictureOpen] = useState(false)
	const onCoverImageSelect = (imageData) => {
		setCoverImageToUpload(imageData)
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
			`users/${currentUserData.CurrentUser.UserId}/picture`,
			{
				CoverPicture: url,
			},
			(result) => {
				if (result === true) {
					getUserDetails()
					setIsCoverPictureOpen(false)
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
			<div className='p-2 lg:px-10 lg:py-6'>
				<div className='rounded-lg z-20 h-40 lg:h-80 relative'>
					{user ? (
						<>
							{user.CoverPicture ? (
								<>
									<img src={user.CoverPicture} className='object-cover h-full w-full rounded-lg' />
								</>
							) : (
								<>
									<div className='w-full h-full rounded-lg flex items-center justify-center  bg-slate-100'>
										<img src={cover} className='object-cover h-full w-full rounded-lg' />
									</div>
								</>
							)}
						</>
					) : (
						<>
							<div className='w-full h-full rounded-lg flex items-center justify-center bg-slate-100'>
								{isLoading ? <Spinner /> : <></>}
							</div>
						</>
					)}
					{/* <img
            src='https://th.bing.com/th/id/OIP.FFchRAWwk-emGNqgImzwaAHaEK?rs=1&pid=ImgDetMain'
            className='object-cover h-full w-full rounded-lg'
          /> */}
					<div className='absolute z-20 top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6  h-100 overflow-hidden rounded-lg bg-system-black-transparent'>
						<div className='flex w-full items-start justify-between'>
							<div
								className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}
								onClick={handleGoBack}>
								<img src={arrowback} alt='' className='h-6 cursor-pointer' />

								{/* <h4 className='font-medium text-xl text-brand-secondary'>Back</h4> */}
							</div>
							<div
								onClick={() => {
									setIsCoverPictureOpen(true)
									if (user.ProfilePicture) {
										setSelectedCoverImage(user.CoverPicture)
									} else {
										setSelectedCoverImage(null)
									}
								}}
								className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}>
								<img src={camera} alt='' className='h-6 cursor-pointer' />
								{/* 
								<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
									<path
										stroke='currentColor'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
									/>
								</svg> */}
							</div>
						</div>
					</div>
					<div className='flex justify-center items-center cursor-pointer absolute left-5 -bottom-3 lg:left-20 lg:-bottom-8 z-30'>
						{user ? (
							<>
								{user.ProfilePicture ? (
									<>
										<div className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center bg-black'>
											<img
												className='w-24 lg:w-60 h-24 lg:h-60 rounded-full object-cover'
												src={user.ProfilePicture}
												alt='Rounded avatar'
												onClick={() => {
													setIsProfilePictureOpen(true)
													if (user.ProfilePicture) {
														setSelectedProfileImage(user.ProfilePicture)
													} else {
														setSelectedProfileImage(null)
													}
												}}
											/>
										</div>
									</>
								) : (
									<>
										<div
											className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center border-2 border-dashed bg-brand-light-gray'
											onClick={() => {
												setIsProfilePictureOpen(true)
												if (user.ProfilePicture) {
													setSelectedProfileImage(user.ProfilePicture)
												} else {
													setSelectedProfileImage(null)
												}
											}}>
											<img src={avatar} className='object-cover h-full w-full rounded-lg' />
										</div>
									</>
								)}
							</>
						) : (
							<>
								<div className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center border-2 border-dashed bg-slate-100'>
									{isLoading ? <Spinner /> : <></>}
								</div>
							</>
						)}
						{/* <img
              className='w-24 lg:w-60 h-24 lg:h-60 rounded-full'
              src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
              alt='Rounded avatar'
              onClick={() => {
                setIsProfilePictureOpen(true)
              }}
            /> */}
					</div>
				</div>
			</div>
			<Modal isOpen={isProfilePictureOpen} maxWidth='max-w-4xl'>
				<Modal.Header>
					<div className='p-2 flex items-center justify-between w-full'>
						<p className='text-lg font-medium'>Profile Photo</p>
						<button
							onClick={() => {
								setIsProfilePictureOpen(false)
							}}
							disabled={isImageUploading}>
							<img src={close} className='h-6  cursor-pointer' alt='' />
						</button>
					</div>
				</Modal.Header>
				<Modal.Body>
					<p className='text-lg font-medium text-center'>
						Your profile will be used on your profile and through out the site.
					</p>

					<div className=' flex flex-col items-center justify-center pt-10'>
						<PictureUpload
							isBanner={false}
							altTitle='Profile Picture'
							selectedImage={selectedProfileImage}
							setSelectedImage={setSelectedProfileImage}
							onImageSelect={onProfileImageSelect}
							onImageDelete={onProfileImageDelete}
							onUploadImage={onProfileImageUpload}
							fileFieldName={'ProfilePicture'}
							isUploading={isImageUploading}
						/>
					</div>
				</Modal.Body>
			</Modal>
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
			<div className='p-2 lg:px-10 lg:py-6 pt-6'>
				<div className='grid lg:grid-cols-4 gap-3 lg:gap-12 '>
					<div className='py-5 lg:py-8 px-8 lg:px-12 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8 h-max'>
						{isLoading ? (
							<Spinner />
						) : (
							<>
								<h4 className='font-medium text-2xl lg:text-center text-system-primary-text'>
									{user && user.FullName}
								</h4>
								<h4 className='font-medium text-xl text-brand-gray-dim lg:text-center'>@{user && user.Username}</h4>
								{currentUserData.CurrentUser.Role.includes('Admin') && (
									<div className='flex justify-center items-center mt-2 lg:mt-6'>
										<div className='w-full p-3 rounded-full bg-system-secondary-accent text-center inline-block'>
											<span className='text-system-primary-accent text-md font-semibold'>
												{currentUserData.CurrentUser.Role.find((role) => role === 'Admin')}
											</span>
										</div>
									</div>
								)}
								<h4 className='font-semibold text-xl text-system-primary-text mt-3 lg:mt-6'>About</h4>
								<div className='mt-4 flex  flex-col gap-4'>
									<div className='flex items-center gap-2'>
										<div className='justify-end text-system-primary-accent'>
											<img src={altmail} alt='' className='h-6 cursor-pointer' />
										</div>
										<h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.Email}</h4>
									</div>
									<div className='flex items-center gap-2'>
										<div className='justify-end text-system-primary-accent'>
											<img src={globe} alt='' className='h-6 cursor-pointer' />
										</div>
										<h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.Country}</h4>
									</div>
									<div className='flex items-center gap-2'>
										<div className='justify-end text-system-primary-accent'>
											<img src={job} alt='' className='h-6 cursor-pointer' />
										</div>
										<h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.JobTitle}</h4>
									</div>
									<div className='flex items-center gap-2'>
										<div className='justify-end text-system-primary-accent'>
											<img src={company} alt='' className='h-6 cursor-pointer' />
										</div>
										<h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.CompanyName}</h4>
									</div>
								</div>
							</>
						)}
					</div>
					<div className='lg:col-span-3'>
						<Tab
							onTabChange={onTabChange}
							activeTab={activeTab}
							name='MyProfile'
							tabs={tabs(user, getUserDetails)}
							alignment='justify-start'
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default MyProfile
