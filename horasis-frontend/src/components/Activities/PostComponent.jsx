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
	// const handleImageOrVideoChange = (e) => {
	// 	const files = Array.from(e.target.files)

	// 	const notAllow = files.some((file) => file.size > 3000000)
	// 	if (notAllow) {
	// 		toast.open('error', 'Max File Size', 'File size should be less than 3MB')
	// 	} else {
	// 		const promises = files.map((file) => {

	// 			return new Promise((resolve) => {
	// 				const reader = new FileReader()

	// 				reader.onload = (event) => {
	// 					const arrayBuffer = event.target.result
	// 					const fileDataUint8Array = new Uint8Array(arrayBuffer)
	// 					const fileDataByteArray = Array.from(fileDataUint8Array)
	// 					const isVideo = file.type.startsWith('video/')
	// 					resolve({
	// 						FileType: file.type,
	// 						FileData: fileDataByteArray,
	// 						FileName: file.name,
	// 						FileUrl: URL.createObjectURL(new Blob([new Uint8Array(fileDataByteArray)])),
	// 					})
	// 				}

	// 				reader.readAsArrayBuffer(file)
	// 			})
	// 		})

	// 		Promise.all(promises)
	// 			.then((arr) => {
	// 				if (arr.length === 1) {
	// 					setNewPost({ ...newPost, ['MediaFiles']: [...newPost['MediaFiles'], arr[0]] })
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				console.error('An error occurred:', error)
	// 			})
	// 	}
	// }

	// const handleImageOrVideoChange = (e, isAlbum) => {
	// 	const files = Array.from(e.target.files)

	// 	// Check if any file exceeds the size limit
	// 	const notAllow = files.some((file) => file.size > 3000000)
	// 	if (notAllow) {
	// 		toast.open('error', 'Max File Size', 'File size should be less than 3MB')
	// 		return
	// 	}

	// 	// Separate images and videos
	// 	const images = files.filter((file) => file.type.startsWith('image/'))
	// 	const videos = files.filter((file) => file.type.startsWith('video/'))

	// 	const processFile = (file) => {
	// 		return new Promise((resolve) => {
	// 			const reader = new FileReader()

	// 			reader.onload = (event) => {
	// 				const arrayBuffer = event.target.result
	// 				const fileDataUint8Array = new Uint8Array(arrayBuffer)
	// 				const fileDataByteArray = Array.from(fileDataUint8Array)
	// 				resolve({
	// 					FileType: file.type,
	// 					FileData: fileDataByteArray,
	// 					FileName: file.name,
	// 					FileUrl: URL.createObjectURL(new Blob([new Uint8Array(fileDataByteArray)])),
	// 				})
	// 			}

	// 			reader.readAsArrayBuffer(file)
	// 		})
	// 	}

	// 	const processFiles = (files) => {
	// 		const promises = files.map(processFile)

	// 		return Promise.all(promises)
	// 	}

	// 	Promise.all([processFiles(images), processFiles(videos)])
	// 		.then(([imageResults, videoResults]) => {
	// 			let newMediaFiles = []

	// 			if (isAlbum) {
	// 				// If isAlbum flag is true, append files to the existing MediaFiles array
	// 				newMediaFiles = [...newPost['MediaFiles']]
	// 				if (images.length > 0) newMediaFiles = [...newMediaFiles, ...imageResults]
	// 				if (videos.length > 0) newMediaFiles = [...newMediaFiles, ...videoResults]
	// 			} else {
	// 				// If isAlbum flag is false, replace MediaFiles with the new files
	// 				if (images.length > 0) newMediaFiles = [...imageResults]
	// 				if (videos.length > 0) newMediaFiles = [...videoResults]
	// 			}

	// 			setNewPost((prevState) => ({
	// 				...prevState,
	// 				['MediaFiles']: newMediaFiles,
	// 			}))
	// 		})
	// 		.catch((error) => {
	// 			console.error('An error occurred:', error)
	// 		})
	// }

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
		const notAllow = filteredFiles.some((file) => file.size > 3000000)
		if (notAllow) {
			toast.open('error', 'Max File Size', 'File size should be less than 3MB')
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
		<div className={`bg-system-secondary-bg rounded-xl relative ${className}`}>
			{isLoading && (
				<div className='absolute z-20 top-0 right-0 left-0 bottom-0 flex flex-col justify-center items-center h-100 overflow-hidden rounded-xl'>
					<Spinner />
				</div>
			)}
			<div className='flex items-start gap-5'>
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

				{user?.ProfilePicture ? (
					<div className='w-12 h-12 mt-2 md:mt-0 md:w-16 md:h-16 rounded-full bg-black block'>
						<img
							className='w-12 h-12  md:w-16 md:h-16  rounded-full object-cover'
							src={user?.ProfilePicture}
							alt='avatar'
						/>
					</div>
				) : (
					<>
						<div className='w-12 h-12 mt-2 md:mt-0 md:w-16 md:h-16 rounded-full bg-brand-light-gray block'>
							<img src={avatar} className='object-cover h-full w-full rounded-lg' alt='No avatar' />
						</div>
					</>
				)}

				<div className='flex-1'>
					<div
						className={`flex-1 mt-2 rounded-lg p-2 px-3 border ${
							Object.values(errorOj).some((error) => error) ? 'border-system-error' : 'border-system-secondary-accent'
						} bg-system-secondary-bg flex flex-col gap-4`}>
						<div className='flex items-start justify-between gap-2'>
							<MentionTextarea
								errorOj={errorOj}
								user={user}
								handleContentChange={(e) => validateSingle({ Content: e }, 'Content')}
								newPost={newPost}
							/>
							{from !== 'podcast' && (
								<img src={attach} alt='' className='h-6 cursor-pointer' onClick={handleDocumentUploadClick} />
							)}
							{/* <svg
								onClick={handleDocumentUploadClick}
								xmlns='http://www.w3.org/2000/svg'
								aria-hidden='true'
								className='w-6 h-6 text-brand-gray cursor-pointer'
								viewBox='0 -960 960 960'>
								<path
									className='text-brand-gray '
									d='M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z'
								/>
							</svg> */}
							{(permissions.CanCreateAlbum || permissions.CanUploadPhoto || permissions.CanUploadVideo) && (
								<>
									<img src={camera} alt='' className='h-6 cursor-pointer' onClick={handleImageUploadClick} />

									{/* <svg
									onClick={handleImageUploadClick}
									xmlns='http://www.w3.org/2000/svg'
									aria-hidden='true'
									className='w-6 h-6 text-brand-gray cursor-pointer'
									viewBox='0 -960 960 960'>
									<path d='M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z' />
								</svg> */}
								</>
							)}
							<img src={send} alt='' className='h-6 cursor-pointer' onClick={() => validate(onSendBtnClicked)} />

							{/* <svg
								className='w-6 h-6 text-system-primary-accent cursor-pointer'
								onClick={() => validate(onSendBtnClicked)}
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 -960 960 960'
								fill='blue'>
								<path d='M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z' />
							</svg> */}
						</div>
						{newPost?.MediaFiles.length > 0 && (
							<div className='flex flex-row flex-wrap gap-2'>
								{newPost?.MediaFiles.map((file, index) => {
									if (file.FileType !== 'video/mp4')
										return (
											<div className='relative w-20 h-20' key={index}>
												<div
													className='absolute bottom-1 right-1'
													onClick={() => {
														handleImageDeleteClick(index)
													}}>
													<img src={deleteIcon} alt='' className='h-5 cursor-pointer' />

													{/* <svg
														aria-hidden='true'
														className='w-4 h-4 text-system-error cursor-pointer'
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 20 20'>
														<path
															stroke='currentColor'
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth='2'
															d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
														/>
													</svg> */}
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

													{/* <svg
														aria-hidden='true'
														className='w-4 h-4 text-system-error cursor-pointer'
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 20 20'>
														<path
															stroke='currentColor'
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth='2'
															d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
														/>
													</svg> */}
												</div>
												<div className='w-20 h-20 bg-system-secondary-bg rounded-md border border-system-secondary-accent overflow-hidden flex flex-col justify-center items-center'>
													{/* <svg aria-hidden='true' className="w-6 h-6" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
												<path
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
												/>
											</svg> */}
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
								})}
							</div>
						)}
						{newPost?.Documents.length > 0 && (
							<div className='flex flex-row flex-wrap gap-2'>
								{newPost?.Documents.map((file, index) => {
									return (
										<div className='relative w-20 h-20' key={index}>
											<div
												className='absolute bottom-1 right-1'
												onClick={() => {
													handleDocumentDeleteClick(index)
												}}>
												<img src={deleteIcon} alt='' className='h-5 cursor-pointer' />

												{/* <svg
													aria-hidden='true'
													className='w-4 h-4 text-system-error cursor-pointer'
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 20 20'>
													<path
														stroke='currentColor'
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth='2'
														d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
													/>
												</svg> */}
											</div>
											<div className='w-20 h-20 bg-system-secondary-bg rounded-md border border-system-secondary-accent overflow-hidden flex flex-col justify-center items-center'>
												<img src={document} alt='' className='h-8 cursor-pointer' />

												{/* <svg
													xmlns='http://www.w3.org/2000/svg'
													aria-hidden='true'
													className='w-6 h-6 text-brand-gray cursor-pointer'
													viewBox='0 -960 960 960'>
													<path
														className='text-brand-gray '
														d='M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z'
													/>
												</svg> */}
											</div>
										</div>
									)
								})}
							</div>
						)}
					</div>
					{Object.values(errorOj).find((error) => error) && (
						<p className='m-0 text-system-error'>{Object.values(errorOj).find((error) => error)}</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default PostComponent
