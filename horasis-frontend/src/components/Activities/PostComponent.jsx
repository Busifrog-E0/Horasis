import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext, defaultPostData } from '../../utils/AuthProvider'
import { getItem, postItem } from '../../constants/operations'
import avatar from '../../assets/icons/avatar.svg'
import Input from '../ui/Input'
import { useToast } from '../Toast/ToastService'
import Spinner from '../ui/Spinner'
import MentionTextarea from './Mentions/MentionTextarea'
import { activityValidation } from '../../utils/schema/users/activityValidation'
import attach from '../../assets/icons/attach.svg'
import camera from '../../assets/icons/camera.svg'
import send from '../../assets/icons/send.svg'
import sendwhite from '../../assets/icons/send-white.svg'
import deleteIcon from '../../assets/icons/delete.svg'
import document from '../../assets/icons/document.svg'

const PostComponent = ({
	onSuccess,
	className = '',
	permissions = {
		IsAdmin: true,
		CanInviteOthers: true,
		CanPostActivity: true,
		CanUploadPhoto: true,
		CanUploadVideo: true,
		CanCreateAlbum: true,
	},
	api = 'feed',
	type = '',
	entId = '',
	from = '',
}) => {
	const { currentUserData, updateCurrentUser, scrollToTop } = useContext(AuthContext)
	const imageFileInputRef = useRef(null)
	const docFileInputRef = useRef(null)
	const [newPost, setNewPost] = useState(defaultPostData(currentUserData.CurrentUser.UserId))
	const toast = useToast()
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

	const getUserDetails = () => {
		getItem(
			`users/${currentUserData.CurrentUser.UserId}`,
			(result) => {
				setUser(result)
			},
			(err) => {
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const handleImageOrVideoChange = (e, isAlbum, isImageAllowed, isVideoAllowed) => {
		const files = Array.from(e.target.files)

		// Determine file types that are not allowed
		const imagesNotAllowed = files.filter((file) => file.type.startsWith('image/') && !isImageAllowed)
		const videosNotAllowed = files.filter((file) => file.type.startsWith('video/') && !isVideoAllowed)

		if (imagesNotAllowed.length > 0) {
			toast.open('error', 'Image Not Allowed', `You don't have permissions to upload images.`)
		}

		if (videosNotAllowed.length > 0) {
			toast.open('error', 'Video Not Allowed', `You don't have permissions to upload videos.`)
		}

		// Filter files based on allowed types
		const filteredFiles = files.filter((file) => {
			if (file.type.startsWith('image/') && isImageAllowed) return true
			if (file.type.startsWith('video/') && isVideoAllowed) return true
			return false
		})

		// Check if any filtered file exceeds the size limit
		const notAllow = filteredFiles.some((file) => file.size > 20000000)
		if (notAllow) {
			toast.open('error', 'Max File Size', 'File size should be less than 20MB')
			return
		}

		// Process each allowed file
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
					// If isAlbum flag is true, append files to the existing MediaFiles array
					newMediaFiles = [...newPost['MediaFiles'], ...results]
				} else {
					// If isAlbum flag is false, replace MediaFiles with the new files
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

	const handleDocumentChange = (e) => {
		const files = Array.from(e.target.files)

		const notAllow = files.some((file) => file.size > 3000000)
		if (notAllow) {
			toast.open('error', 'Max File Size', 'File size should be less than 3MB')
		} else {
			const promises = files.map((file) => {
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
			})

			Promise.all(promises)
				.then((arr) => {
					if (arr.length === 1) {
						setNewPost({ ...newPost, ['Documents']: [...newPost['Documents'], arr[0]] })
					}
				})
				.catch((error) => {
					console.error('An error occurred:', error)
				})
		}
	}

	const onSendBtnClicked = () => {
		const dataToPost = type !== '' ? { ...newPost, Type: type, EntityId: entId } : { ...newPost }
		setIsLoading(true)
		postItem(
			api,
			dataToPost,
			(result) => {
				console.log(result)
				if (result === true) {
					setNewPost(defaultPostData(currentUserData.CurrentUser.UserId))
					onSuccess()
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

	const handleImageDeleteClick = (index) => {
		const newFiles = newPost?.MediaFiles.filter((_, i) => i !== index)
		setNewPost({ ...newPost, MediaFiles: newFiles })
	}

	const handleDocumentDeleteClick = (index) => {
		const newFiles = newPost?.Documents.filter((_, i) => i !== index)
		setNewPost({ ...newPost, Documents: newFiles })
	}

	const handleImageUploadClick = () => {
		imageFileInputRef.current.click()
	}

	const handleDocumentUploadClick = () => {
		docFileInputRef.current.click()
	}

	const handleContentChange = (e) => {
		setNewPost({
			...newPost,
			Content: e,
		})
	}

	useEffect(() => {
		getUserDetails()
	}, [])
	if (!permissions.IsAdmin && !permissions.CanPostActivity) {
		return <></>
	}

	return (
		<div className={`flex flex-col gap-3 p-4 bg-system-secondary-bg rounded-lg shadow-sm relative ${className}`}>
			{isLoading && (
				<div className='absolute z-20 top-0 right-0 left-0 bottom-0 flex flex-col justify-center items-center h-100 overflow-hidden rounded-xl'>
					<Spinner />
				</div>
			)}
			<div className={`flex items-start gap-2  bg-white  border-b ${Object.values(errorOj).some((error) => error) ? 'border-system-error' : 'border-system-secondary-accent'
				} pb-4`}>
				<input
					type='file'
					accept='application/pdf'
					onChange={handleDocumentChange}
					style={{ display: 'none' }}
					ref={docFileInputRef}
				/>
				{(permissions.CanCreateAlbum || permissions.CanUploadPhoto || permissions.CanUploadVideo) && (
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

							// Only call handleImageOrVideoChange if any permissions allow uploading
							if (isImageAllowed || isVideoAllowed) {
								handleImageOrVideoChange(e, isAlbum, isImageAllowed, isVideoAllowed)
							}
						}}
						style={{ display: 'none' }}
						ref={imageFileInputRef}
					/>
				)}

				{/* Avatar */}
				{user?.ProfilePicture ? (
					<img src={user.ProfilePicture} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
				) : (
					<div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-semibold">
						{user?.FirstName?.charAt(0)?.toUpperCase() || 'U'}
					</div>
				)}

				{/* Input Field */}
				<div className="flex-1">
					<MentionTextarea
						placeholder="Share what’s on your mind..."
						errorOj={errorOj}
						user={user}
						handleContentChange={(e) => validateSingle({ Content: e }, 'Content')}
						newPost={newPost}
					/>

				</div>


			</div>
			{Object.values(errorOj).find((error) => error) && (
				<p className='m-0 text-system-error'>{Object.values(errorOj).find((error) => error)}</p>
			)}
			<div className='flex gap-2 mt-2 flex-wrap'>
				{newPost?.MediaFiles.length > 0 && (
					newPost?.MediaFiles.map((file, index) => {
						if (file.FileType !== 'video/mp4')
							return (
								<div className='relative w-20 h-20' key={index}>
									<div
										className='absolute bottom-1 right-1'
										onClick={() => {
											handleImageDeleteClick(index)
										}}>
										<img src={deleteIcon} alt='' className='h-5 cursor-pointer' />
									</div>
									<div className='w-20 h-20 bg-system-secondary-bg rounded-md border border-system-secondary-accent overflow-hidden'>
										<img className='w-full h-full object-cover' src={file.FileUrl} alt='Rounded avatar' />
									</div>
								</div>
							)
						else
							return (
								<div className='relative w-20 h-20' key={index}>
									<div
										className='absolute bottom-1 right-1'
										style={{ zIndex: 10000 }}
										onClick={() => {
											handleImageDeleteClick(index)
										}}>
										<img src={deleteIcon} alt='' className='h-5 cursor-pointer' />
									</div>
									<div className='w-20 h-20 bg-system-secondary-bg rounded-md border border-system-secondary-accent overflow-hidden flex flex-col justify-center items-center'>
										<video controls style={{ display: 'block', marginTop: '10px', maxWidth: '200px' }}>
											<source
												src={URL.createObjectURL(new Blob([new Uint8Array(file.FileData)]))}
												type={file.FileType}
											/>
											Your browser does not support the video tag.
										</video>
									</div>
								</div>
							)
					})
				)}
				{newPost?.Documents.length > 0 && (
					newPost?.Documents.map((file, index) => {
						return (
							<div className='relative w-20 h-20' key={index}>
								<div
									className='absolute bottom-1 right-1'
									onClick={() => {
										handleDocumentDeleteClick(index)
									}}>
									<img src={deleteIcon} alt='' className='h-5 cursor-pointer' />
								</div>
								<div className='w-20 h-20 bg-system-secondary-bg rounded-md border border-system-secondary-accent overflow-hidden flex flex-col justify-center items-center'>
									<img src={document} alt='' className='h-8 cursor-pointer' />

								</div>
							</div>
						)
					})
				)}
			</div>
			{/* Action Buttons */}
			<div className="flex items-center justify-between gap-1">
				<div className="flex items-center gap-1">
					{from !== 'podcast' && (
						<button onClick={handleDocumentUploadClick} className="p-2 bg-gray-100 rounded-md">
							<img src={attach} alt="Attach" className="h-5 w-5" />
						</button>
					)}
					{(permissions.CanCreateAlbum || permissions.CanUploadPhoto || permissions.CanUploadVideo) && (

						<button onClick={handleImageUploadClick} className="p-2 bg-gray-100 rounded-md">
							<img src={camera} alt="Upload" className="h-5 w-5" />
						</button>
					)}

				</div>
				<button onClick={() => validate(onSendBtnClicked)} className="p-2 bg-green-700 rounded-full">
					<img src={sendwhite} alt="Send" className="h-5 w-5" />
				</button>
			</div>
		</div>
	)

}

export default PostComponent
