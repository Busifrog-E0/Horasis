import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext, defaultPostData } from "../../utils/AuthProvider"
import { getItem, postItem } from "../../constants/operations"
import avatar from '../../assets/icons/avatar.svg'
import Input from "../ui/Input"
import { useToast } from "../Toast/ToastService"
import Spinner from "../ui/Spinner"
import MentionTextarea from "./Mentions/MentionTextarea"
import { activityValidation } from "../../utils/schema/users/activityValidation"

const PostComponent = ({ onSuccess, className = "" }) => {
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
			currentUserData, toast
		)
	}
	const handleImageOrVideoChange = (e) => {
		const files = Array.from(e.target.files);

		const notAllow = files.some((file) => file.size > 3000000);
		if (notAllow) {
			toast.open('error', 'Max File Size', 'File size should be less than 3MB');
		} else {
			const promises = files.map((file) => {
				return new Promise((resolve) => {
					const reader = new FileReader();

					reader.onload = (event) => {
						const arrayBuffer = event.target.result;
						const fileDataUint8Array = new Uint8Array(arrayBuffer);
						const fileDataByteArray = Array.from(fileDataUint8Array);
						const isVideo = file.type.startsWith('video/');
						resolve({
							FileType: file.type,
							FileData: fileDataByteArray,
							FileName: file.name,
							FileUrl: URL.createObjectURL(new Blob([new Uint8Array(fileDataByteArray)]))
						});
					};

					reader.readAsArrayBuffer(file);
				});
			});

			Promise.all(promises)
				.then((arr) => {
					if (arr.length === 1) {
						setNewPost({ ...newPost, ["MediaFiles"]: [...newPost["MediaFiles"], arr[0]] });
					}
				})
				.catch((error) => {
					console.error('An error occurred:', error);
				});
		}
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
							FileUrl: URL.createObjectURL(new Blob([new Uint8Array(fileDataByteArray)]))
						})
					}

					reader.readAsArrayBuffer(file)
				})
			})

			Promise.all(promises)
				.then((arr) => {
					if (arr.length === 1) {
						setNewPost({ ...newPost, ["Documents"]: [...newPost["Documents"], arr[0]] })
					}
				})
				.catch((error) => {
					console.error('An error occurred:', error)
				})
		}
	}


	const onSendBtnClicked = () => {
		setIsLoading(true)
		postItem(
			'activities',
			newPost,
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
		const newFiles = newPost?.MediaFiles.filter((_, i) => i !== index);
		setNewPost({ ...newPost, MediaFiles: newFiles });
	}

	const handleDocumentDeleteClick = (index) => {
		const newFiles = newPost?.Documents.filter((_, i) => i !== index);
		setNewPost({ ...newPost, Documents: newFiles });
	}

	const handleImageUploadClick = () => {
		imageFileInputRef.current.click()
	}


	const handleDocumentUploadClick = () => {
		docFileInputRef.current.click()
	}

	const handleContentChange = (e) => {
		setNewPost({
			...newPost, Content: e
		})
	}

	useEffect(() => {
		getUserDetails()
	}, [])
	return (
		<div className={`bg-system-secondary-bg rounded-xl relative ${className}`}>
			{isLoading &&
				<div className='absolute z-20 top-0 right-0 left-0 bottom-0 flex flex-col justify-center items-center h-100 overflow-hidden rounded-xl'>
					<Spinner />
				</div>
			}
			<div className='flex items-start gap-5'>
				<input
					type='file'
					accept='application/pdf'
					onChange={handleDocumentChange}
					style={{ display: 'none' }}
					ref={docFileInputRef}
				/>
				<input
					type='file'
					accept='image/jpeg, image/png, video/mp4'
					onChange={handleImageOrVideoChange}
					style={{ display: 'none' }}
					ref={imageFileInputRef}
				/>
				{user?.ProfilePicture ? (
					<div className='w-16 h-16 rounded-full bg-black hidden md:block'>
						<img className='w-16 h-16  rounded-full object-cover' src={user?.ProfilePicture} alt='avatar' />
					</div>
				) : (
					<>
						<div className='w-16 h-16 rounded-full bg-brand-light-gray hidden md:block'>
							<img src={avatar} className='object-cover h-full w-full rounded-lg' alt='No avatar' />
						</div>
					</>
				)}

				<div className="flex-1">
					<div className={`flex-1 mt-2 rounded-lg p-2 px-3 border ${Object.values(errorOj).some(error => error) ? "border-system-error" : "border-system-secondary-accent"} bg-system-secondary-bg flex flex-col gap-4`}>
						<div className="flex items-center justify-between gap-2">
							<MentionTextarea errorOj={errorOj} user={user} handleContentChange={(e) => validateSingle({ Content: e }, 'Content')} newPost={newPost} />
							<svg onClick={handleDocumentUploadClick} xmlns="http://www.w3.org/2000/svg" aria-hidden='true' className="w-6 h-6 text-brand-gray cursor-pointer" viewBox="0 -960 960 960" >
								<path className="text-brand-gray " d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
							</svg>

							<svg onClick={handleImageUploadClick} xmlns="http://www.w3.org/2000/svg" aria-hidden='true' className="w-6 h-6 text-brand-gray cursor-pointer" viewBox="0 -960 960 960" >
								<path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z" />
							</svg>

							<svg className="w-6 h-6 text-system-primary-accent cursor-pointer" onClick={() => validate(onSendBtnClicked)} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="blue">
								<path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
							</svg>
						</div>
						{newPost?.MediaFiles.length > 0 &&
							<div className="flex flex-row flex-wrap gap-2">
								{newPost?.MediaFiles.map((file, index) => {
									if (file.FileType !== "video/mp4")
										return <div className="relative w-20 h-20" key={index}>

											<div className="absolute bottom-1 right-1" onClick={() => {
												handleImageDeleteClick(index)
											}}>
												<svg aria-hidden='true' className="w-4 h-4 text-system-error cursor-pointer" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
													<path
														stroke='currentColor'
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth='2'
														d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
													/>
												</svg>
											</div>
											<div className="w-20 h-20 bg-system-secondary-bg rounded-md border border-system-secondary-accent overflow-hidden">
												<img
													className='w-full h-full object-cover'
													src={file.FileUrl}
													alt='Rounded avatar'
												/>
											</div>
										</div>
									else return <div className="relative w-20 h-20" key={index}>

										<div className="absolute bottom-1 right-1" style={{ zIndex: 10000 }} onClick={() => {
											handleImageDeleteClick(index)
										}}>
											<svg aria-hidden='true' className="w-4 h-4 text-system-error cursor-pointer" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
												<path
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
												/>
											</svg>
										</div>
										<div className="w-20 h-20 bg-system-secondary-bg rounded-md border border-system-secondary-accent overflow-hidden flex flex-col justify-center items-center">
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
												<source src={URL.createObjectURL(new Blob([new Uint8Array(file.FileData)]))} type={file.FileType} />
												Your browser does not support the video tag.
											</video>

										</div>
									</div>
								})

								}

							</div>
						}
						{newPost?.Documents.length > 0 &&
							<div className="flex flex-row flex-wrap gap-2">
								{newPost?.Documents.map((file, index) => {
									return <div className="relative w-20 h-20" key={index}>
										<div className="absolute bottom-1 right-1" onClick={() => {
											handleDocumentDeleteClick(index)
										}}>
											<svg aria-hidden='true' className="w-4 h-4 text-system-error cursor-pointer" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
												<path
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
												/>
											</svg>
										</div>
										<div className="w-20 h-20 bg-system-secondary-bg rounded-md border border-system-secondary-accent overflow-hidden flex flex-col justify-center items-center">
											<svg xmlns="http://www.w3.org/2000/svg" aria-hidden='true' className="w-6 h-6 text-brand-gray cursor-pointer" viewBox="0 -960 960 960" >
												<path className="text-brand-gray " d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
											</svg>
										</div>
									</div>
								})

								}

							</div>
						}

					</div>
					{Object.values(errorOj).find(error => error) && (
						<p className="m-0 text-system-error">
							{Object.values(errorOj).find(error => error)}
						</p>
					)}
				</div>


			</div>
		</div>
	)
}

export default PostComponent