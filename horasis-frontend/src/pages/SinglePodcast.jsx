import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TimeLineTab from '../components/Activities/TimeLineTab'
import PodcastSettings from '../components/Podcasts/SinglePodcastTabs/PodcastSettings'
import { useToast } from '../components/Toast/ToastService'
import Button from '../components/ui/Button'
import Tab from '../components/ui/Tab'
import useDeleteData from '../hooks/useDeleteData'
import useGetData from '../hooks/useGetData'
import usePostData from '../hooks/usePostData'
import { defaultPostData, useAuth } from '../utils/AuthProvider'
import Spinner from '../components/ui/Spinner'
import useTranslation from '../hooks/useTranslation'
import Modal from '../components/ui/Modal'
import close from '../assets/icons/close.svg'
import deleteIcon from '../assets/icons/delete.svg'
import TextArea from '../components/ui/TextArea'
import { activityValidation } from '../utils/schema/users/activityValidation'
import { postItem } from '../constants/operations'
import useEntitySaveManager from '../hooks/useEntitySaveManager'
import saved from '../assets/icons/graysavefill.svg'
import save from '../assets/icons/graysave.svg'
import useEntityMembershipManager from '../hooks/useEntityMembershipManager'
import Settings from '../components/Common/PermissionsManagement/Settings'

const tabs = (podcast) => {
	const { Privacy, IsMember, MembershipStatus, Permissions, DocId } = podcast
	const isPrivate = Privacy === 'Private'
	const isMember = IsMember && MembershipStatus === 'Accepted'
	const isAdmin = Permissions?.IsAdmin
	const canInvite = Permissions?.CanInviteOthers

	const getActivitiesTab = (key) => ({
		key: key,
		title: 'Episodes',
		render: () => {
			const [refresh, setRefresh] = useState(true)
			useEffect(() => {}, [refresh])
			return (
				<div className='bg-system-secondary-bg p-4 rounded-b-lg overflow-hidden'>
					{Permissions.IsAdmin && (
						<UploadEpisodeModal
							permissions={Permissions}
							entId={DocId}
							type='Podcast'
							reloadFn={() => setRefresh((prev) => !prev)}
						/>
					)}
					<TimeLineTab
						api={`activities`}
						gapBnTabs='gap-7'
						classNameForPost='py-5'
						bordered={false}
						// permissions={Permissions}
						entId={DocId}
						type='Podcast'
						from='podcast'
					/>
				</div>
			)
		},
	})

	const getSettingsTab = (key) => ({
		key: key,
		title: 'Settings',
		render: () => (
			<div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
				<Settings
					EntityId={DocId}
					from='settings'
					Type='Podcast'
					Entity={podcast}
					permissionsToShow={{
						Invitation: false,
						Activity: true,
						Photo: false,
						Album: false,
						Video: true,
						Admin: true,
					}}
				/>
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

const SinglePodcast = () => {
	const [activeTab, setActiveTab] = useState(0)
	const { currentUserData } = useAuth()
	const { podcastid } = useParams()
	const {
		isLoading: isLoadingPodcast,
		data: podcast,
		getData: getPodcast,
		setData: setPodcast,
	} = useGetData(`podcasts/${podcastid}`)

	const navigate = useNavigate()
	const handleGoBack = () => navigate(-1)

	const onTabChange = (item) => {
		setActiveTab(item.key)
	}

	const { isSaving, isUnsaving, saveEntity, unsaveEntity } = useEntitySaveManager({
		EntityId: podcast?.DocId,
		Type: 'Podcast',
		successCallback: getPodcast,
		errorCallback: () => {},
	})

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

	const {
		isTranslated: translated,
		isTranslating: translating,
		translate: translatePodcast,
		showOriginal,
		homeLanguage,
	} = useTranslation({ data: podcast, setData: setPodcast, Type: 'Podcast' })

	return (
		<>
			<div className='lg:col-span-3 bg-system-primary-bg rounded-lg  my-2 lg:p-4 flex flex-col gap-2'>
				{/* Podcast Cover Image */}
				<div className='flex flex-col sm:flex-row items-start gap-6 bg-system-secondary-bg rounded-md p-4'>
					<img
						src={podcast?.CoverPicture}
						alt='Podcast Cover'
						className='h-64 aspect-square object-cover rounded-lg' // Make image full width with rounded top corners
					/>

					<div className='flex flex-col justify-between  flex-1 gap-10'>
						<div className='flex flex-col justify-between gap-6 h-full'>
							<div>
								{/* Podcast Title */}
								<h1 className='text-4xl font-bold text-system-primary-text'>{podcast?.PodcastName}</h1>

								{/* Podcast Description */}
								<p className='text-lg text-system-secondary-text leading-relaxed'>{podcast?.Description}</p>
								{/* <p className='text-md text-system-primary-text italic'>{podcast?.Brief}</p> */}
							</div>
							<div>
								{podcast?.OriginalLanguage !== homeLanguage && (
									<>
										{/* <h4 className='text-sm text-system-secondary-text'>•</h4> */}
										{translating ? (
											<h4 className='text-sm text-system-secondary-text  cursor-pointer'>Translating...</h4>
										) : (
											<>
												{translated ? (
													<h4 className='text-sm text-system-secondary-text  cursor-pointer' onClick={showOriginal}>
														Show Original
													</h4>
												) : (
													<h4 className='text-sm text-system-secondary-text  cursor-pointer' onClick={translatePodcast}>
														Translate this podcast
													</h4>
												)}
											</>
										)}
									</>
								)}
							</div>
						</div>
						<div>
							<div className='flex items-center justify-start my-2 gap-2'>
								{isLoadingPodcast || isLoading ? (
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

					{isSaving || isUnsaving ? (
						<div className='self-end'>
							<Spinner />
						</div>
					) : (
						<>
							{podcast?.HasSaved ? (
								<>
									<img src={saved} alt='' className='h-8 self-end cursor-pointer' onClick={unsaveEntity} />
								</>
							) : (
								<>
									<img src={save} alt='' className='h-8 self-end cursor-pointer' onClick={saveEntity} />
								</>
							)}
						</>
					)}
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

const UploadEpisodeModal = ({
	permissions = {
		IsAdmin: true,
		CanInviteOthers: true,
		CanPostActivity: true,
		CanUploadPhoto: true,
		CanUploadVideo: true,
		CanCreateAlbum: true,
	},
	from = 'podcast',
	type,
	entId,
	reloadFn = () => {},
}) => {
	const { currentUserData, updateCurrentUser } = useAuth()
	const toast = useToast()
	const [isModalOpen, setIsModalOpen] = useState(false)

	// Open Modal
	const openModal = () => {
		setIsModalOpen(true)
	}

	// Close Modal
	const closeModal = () => {
		setIsModalOpen(false)
	}

	const imageFileInputRef = useRef(null)
	const [newPost, setNewPost] = useState(defaultPostData(currentUserData.CurrentUser.UserId))
	const [isLoading, setIsLoading] = useState(false)
	const [user, setUser] = useState()
	const [errorOj, setErrorObj] = useState({})

	const validate = (callback) => {
		const { error, warning } = activityValidation.validate(newPost, {
			abortEarly: false,
			stripUnknown: true,
		})
		if (error && error.details) {
			let obj = {}
			error.details.forEach((val) => (obj[val.context.key] = val.message))
			setErrorObj(obj)
		} else {
			setErrorObj({})
			if (callback) {
				callback()
			}
		}
	}
	const validateSingle = (value, key, callback) => {
		setNewPost({ ...newPost, ...value })
		const { error, warning } = activityValidation
			.extract(key)
			.validate(value[key], { abortEarly: false, stripUnknown: true })
		if (error && error.details) {
			let obj = {}
			error.details.forEach((val) => (obj[key] = val.message))
			setErrorObj(obj)
		} else {
			setErrorObj({})
			if (callback) {
				callback()
			}
		}
	}

	const onSendBtnClicked = () => {
		const dataToPost = { ...newPost, Type: type, EntityId: entId }
		setIsLoading(true)
		postItem(
			'activities',
			dataToPost,
			(result) => {
				console.log(result)
				if (result === true) {
					setNewPost(defaultPostData(currentUserData.CurrentUser.UserId))
					reloadFn()
					closeModal()
				}
				setIsLoading(false)
			},
			(err) => {
				setIsLoading(false)
				console.error(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const handleImageUploadClick = () => {
		imageFileInputRef.current.click()
	}

	const handleImageOrVideoChange = (e, isAlbum, isImageAllowed, isVideoAllowed) => {
		const files = Array.from(e.target.files || e.dataTransfer.files)

		const imagesNotAllowed = files.filter((file) => file.type.startsWith('image/') && !isImageAllowed)
		const videosNotAllowed = files.filter((file) => file.type.startsWith('video/') && !isVideoAllowed)

		if (imagesNotAllowed.length > 0) {
			toast.open('error', 'Image Not Allowed', `You don't have permissions to upload images.`)
		}

		if (videosNotAllowed.length > 0) {
			toast.open('error', 'Video Not Allowed', `You don't have permissions to upload videos.`)
		}

		const filteredFiles = files.filter((file) => {
			if (file.type.startsWith('image/') && isImageAllowed) return true
			if (file.type.startsWith('video/') && isVideoAllowed) return true
			return false
		})

		const notAllow = filteredFiles.some((file) => file.size > 3000000)
		if (notAllow) {
			toast.open('error', 'Max File Size', 'File size should be less than 3MB')
			return
		}

		const processFile = (file) => {
			return new Promise((resolve) => {
				const reader = new FileReader()

				reader.onload = (event) => {
					const arrayBuffer = event.target.result
					const fileDataUint8Array = new Uint8Array(arrayBuffer)
					const fileDataByteArray = Array.from(fileDataUint8Array)
					resolve({
						FileType: file.type,
						FileData: fileDataByteArray,
						FileName: file.name,
						FileUrl: URL.createObjectURL(new Blob([new Uint8Array(fileDataByteArray)])),
					})
				}

				reader.readAsArrayBuffer(file)
			})
		}

		const promises = filteredFiles.map(processFile)

		Promise.all(promises)
			.then((results) => {
				let newMediaFiles = []

				if (isAlbum) {
					newMediaFiles = [...newPost['MediaFiles'], ...results]
				} else {
					newMediaFiles = results
				}

				setNewPost((prevState) => ({
					...prevState,
					['MediaFiles']: newMediaFiles,
				}))
			})
			.catch((error) => {
				console.error('An error occurred:', error)
			})
	}

	const handleImageDeleteClick = (index) => {
		const newFiles = newPost?.MediaFiles.filter((_, i) => i !== index)
		setNewPost({ ...newPost, MediaFiles: newFiles })
	}

	const handleDragOver = (e) => {
		e.preventDefault()
	}

	const handleDrop = (e) => {
		e.preventDefault()
		let isAlbum = false
		let isImageAllowed = false
		let isVideoAllowed = false

		if (from === 'podcast') {
			isAlbum = false
			isImageAllowed = false
			isVideoAllowed = permissions?.CanUploadVideo
		} else {
			if (permissions.IsAdmin || permissions.CanCreateAlbum) {
				isAlbum = true
				isImageAllowed = true
				isVideoAllowed = true
			} else {
				isImageAllowed = permissions.CanUploadPhoto
				isVideoAllowed = permissions.CanUploadVideo
			}
		}

		handleImageOrVideoChange(e, isAlbum, isImageAllowed, isVideoAllowed)
	}

	return (
		<div className='flex justify-end items-center h-max my-4'>
			<Button onClick={openModal} variant='black' size='md'>
				Upload New Episode
			</Button>

			<Modal isOpen={isModalOpen}>
				<Modal.Header>
					<h2 className='text-2xl font-semibold'>Upload New Episode</h2>
					<button onClick={closeModal}>
						<img src={close} className='h-6 cursor-pointer' alt='' />
					</button>
				</Modal.Header>
				<Modal.Body>
					<>
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>
								Episode Description<span className='text-brand-red'>*</span>
							</h1>
							<TextArea
								rows={3}
								placeholder='Episode Description'
								width='full'
								variant='primary_outlined'
								value={newPost.Content}
								onChange={(e) => validateSingle({ Content: e.target.value }, 'Content')}
							/>
							{errorOj['Content'] != undefined && <p className='text-brand-red m-0'>{errorOj['Content']}</p>}
						</div>

						{newPost?.MediaFiles.length === 0 && (
							<div
								className='border-dashed border-2 rounded-md border-gray-300 p-4 my-4 flex items-center justify-center flex-col cursor-pointer h-60'
								onClick={handleImageUploadClick}
								onDragOver={handleDragOver}
								onDrop={handleDrop}>
								<h1 className='text-system-primary-text font-medium text-lg'>
									Upload Episode<span className='text-brand-red'>*</span>
								</h1>
								<p className='text-gray-500'>Click or drag and drop a video file</p>
								{/* <Button onClick={handleImageUploadClick}>Upload Episode</Button> */}
							</div>
						)}
						<input
							type='file'
							accept='image/jpeg, image/png, video/mp4'
							onChange={(e) => {
								let isAlbum = false
								let isImageAllowed = false
								let isVideoAllowed = false
								if (from === 'podcast') {
									isAlbum = false
									isImageAllowed = false
									isVideoAllowed = permissions?.CanUploadVideo
								} else {
									if (permissions.IsAdmin || permissions.CanCreateAlbum) {
										isAlbum = true
										isImageAllowed = true
										isVideoAllowed = true
									} else {
										isImageAllowed = permissions.CanUploadPhoto
										isVideoAllowed = permissions.CanUploadVideo
									}
								}

								if (isImageAllowed || isVideoAllowed) {
									handleImageOrVideoChange(e, isAlbum, isImageAllowed, isVideoAllowed)
								}
							}}
							style={{ display: 'none' }}
							ref={imageFileInputRef}
						/>

						{newPost?.MediaFiles.length > 0 && (
							<div className='flex flex-row flex-wrap gap-2 py-4'>
								{newPost?.MediaFiles.map((file, index) => {
									if (file.FileType !== 'video/mp4') return <></>
									else
										return (
											<div className='relative w-full' key={index}>
												<div
													className='absolute top-4 right-4 bg-system-secondary-bg p-2 rounded-lg'
													style={{ zIndex: 10000 }}
													onClick={() => {
														handleImageDeleteClick(index)
													}}>
													<img src={deleteIcon} alt='' className='h-5 cursor-pointer' />
												</div>
												<div className='w-full bg-system-secondary-bg rounded-md overflow-hidden flex flex-col justify-center items-center'>
													<video controls style={{ display: 'block', maxWidth: '100%' }}>
														<source
															src={URL.createObjectURL(new Blob([new Uint8Array(file.FileData)]))}
															type={file.FileType}
														/>
														Your browser does not support the video tag.
													</video>
												</div>
											</div>
										)
								})}
							</div>
						)}

						{/* Buttons */}
						<div className='flex items-end justify-end gap-4 px-4'>
							<Button variant='outline' className='px-8 py-3' onClick={closeModal}>
								Cancel
							</Button>
							<Button
								disabled={isLoading || Object.keys(errorOj).length !== 0}
								variant='black'
								className='px-8 py-3'
								onClick={() => validate(onSendBtnClicked)}>
								{isLoading ? 'Uploading...' : 'Upload Episode'}
							</Button>
						</div>
					</>
				</Modal.Body>
			</Modal>
		</div>
	)
}

export default SinglePodcast
