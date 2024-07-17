import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext, defaultPostData } from "../../utils/AuthProvider"
import { getItem, postItem } from "../../constants/operations"
import avatar from '../../assets/icons/avatar.svg'
import Input from "../ui/Input"
import { useToast } from "../Toast/ToastService"
import Spinner from "../ui/Spinner"

const PostComponent = ({ onSuccess, className = "" }) => {
	const { currentUserData, updateCurrentUser, scrollToTop } = useContext(AuthContext)
	const imageFileInputRef = useRef(null)
	const docFileInputRef = useRef(null)
	const [newPost, setNewPost] = useState(defaultPostData(currentUserData.CurrentUser.UserId))
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(false)
	const [user, setUser] = useState()
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
	const handleImageChange = (e) => {
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
						setNewPost({ ...newPost, ["MediaFiles"]: [...newPost["MediaFiles"], arr[0]] })
					}
				})
				.catch((error) => {
					console.error('An error occurred:', error)
				})
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
				<div className='absolute z-20 top-0 right-0 left-0 bottom-0 flex flex-col justify-center items-center h-100 bg-brand-orange-transparent overflow-hidden rounded-xl'>
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
					accept='image/jpeg, image/png'
					onChange={handleImageChange}
					style={{ display: 'none' }}
					ref={imageFileInputRef}
				/>
				{user?.ProfilePicture ? (
					<div className='w-16 h-16 rounded-full bg-black'>
						<img className='w-16 h-16  rounded-full object-cover' src={user?.ProfilePicture} alt='avatar' />
					</div>
				) : (
					<>
						<div className='w-16 h-16 rounded-full bg-brand-light-gray'>
							<img src={avatar} className='object-cover h-full w-full rounded-lg' alt='No avatar' />
						</div>
					</>
				)}

				<div className="flex-1 mt-2 rounded-md p-2 px-3 border border-system-secondary-accent bg-system-secondary-bg flex flex-col gap-4">
					{/* <h4 className="font-medium text-xl text-brand-gray-dim italic ">Share what's on your mind, Frank</h4> */}
					<div className="flex items-center justify-between gap-2">
						<Input
							setValue={handleContentChange}
							width={'full'} value={newPost.Content}
							className='p-0 border-none rounded-none hover:shadow-none'
							placeholder={`Share what's on  your mind, ${user && user.FullName}`}

						/>
						<svg onClick={handleDocumentUploadClick} aria-hidden='true' className="w-6 h-6 text-brand-gray cursor-pointer" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
							<path
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
							/>
						</svg>
						<svg onClick={handleImageUploadClick} aria-hidden='true' className="w-6 h-6 text-brand-gray cursor-pointer" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
							<path
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
							/>
						</svg>
						<svg onClick={onSendBtnClicked} aria-hidden='true' className="w-6 h-6 text-system-primary-accent cursor-pointer" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
							<path
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
							/>
						</svg>
					</div>
					{newPost?.MediaFiles.length > 0 &&
						<div className="flex flex-row flex-wrap gap-2">
							{newPost?.MediaFiles.map((file, index) => {
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
										<svg aria-hidden='true' className="w-6 h-6" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
											<path
												stroke='currentColor'
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
											/>
										</svg>

									</div>
								</div>
							})

							}

						</div>
					}

				</div>
			</div>
		</div>
		// <div className='p-5 pr-10 bg-system-secondary-bg rounded-lg'>
		// 	<div className='flex items-center gap-5'>
		// 		{user ? (
		// 			<>
		// 				{user.ProfilePicture ? (
		// 					<div className='w-16 h-16 rounded-full bg-black'>
		// 						<img className='w-16 h-16  rounded-full object-cover' src={user.ProfilePicture} alt='avatar' />
		// 					</div>
		// 				) : (
		// 					<>
		// 						<div className='w-16 h-16 rounded-full bg-brand-light-gray'>
		// 							<img src={avatar} className='object-cover h-full w-full rounded-lg' alt='No avatar' />
		// 						</div>
		// 					</>
		// 				)}
		// 			</>
		// 		) : (
		// 			<></>
		// 		)}
		// 		<div className="flex-1">
		// 			<Input
		// 				width={'full'}
		// 				className='py-3 rounded-xl border-2 border-system-secondary-accent'
		// 				placeholder={`Share what's on  your mind, ${user && user.FullName}`}

		// 			/>
		// 		</div>

		// 	</div>
		// </div>
	)
}

export default PostComponent