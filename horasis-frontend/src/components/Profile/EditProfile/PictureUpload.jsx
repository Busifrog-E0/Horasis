import { useRef } from 'react'
import Spinner from '../../ui/Spinner'
import Button from '../../ui/Button'
import avatar from '../../../assets/icons/avatar.svg'
import cover from '../../../assets/icons/cover.svg'
import change from '../../../assets/icons/change.svg'
import confirm from '../../../assets/icons/confirm.svg'
import deleteIcon from '../../../assets/icons/delete.svg'

import { useToast } from '../../Toast/ToastService'

const PictureUpload = ({
	onImageSelect,
	onImageDelete,
	onUploadImage,
	selectedImage,
	setSelectedImage,
	isBanner = true,
	isUploading = false,
	altTitle,
	fileFieldName,
	rounded=true
}) => {
	const fileInputRef = useRef(null)
	const toast = useToast()

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
							FileFieldName: fileFieldName,
						})
					}

					reader.readAsArrayBuffer(file)
				})
			})

			Promise.all(promises)
				.then((arr) => {
					if (arr.length === 1) {
						onImageSelect(arr[0])
					}
				})
				.catch((error) => {
					console.error('An error occurred:', error)
				})
		}
	}

	const handleClick = () => {
		fileInputRef.current.click()
	}

	return (
		<div className='w-full flex flex-col gap-6'>
			<div className='w-full flex items-center justify-center'>
				<input
					type='file'
					accept='image/*'
					onChange={handleImageChange}
					style={{ display: 'none' }}
					ref={fileInputRef}
				/>
				{selectedImage ? (
					<div className=' w-full flex items-center justify-center'>
						{isBanner ? (
							<>
								{isUploading ? (
									<div className='w-full lg:w-full h-24 lg:h-60 rounded-md flex items-center justify-center relative '>
										<Spinner />
										<div className='w-full lg:w-full h-24 lg:h-60 rounded-md flex items-center justify-center bg-black absolute top-0 bottom-0 left-0 right-0 opacity-20'>
											<img
												src={selectedImage}
												alt={altTitle}
												// className='h-[150px] w-[320px] rounded-md object-cover'
												className='w-full lg:w-full h-24 lg:h-60 rounded-md object-cover cursor-pointer'
											/>
										</div>
									</div>
								) : (
									<img
										src={selectedImage}
										alt={altTitle}
										// className='h-[150px] w-[320px] rounded-md object-cover'
										className='w-full lg:w-full h-24 lg:h-60 rounded-md object-cover cursor-pointer'
										onClick={handleClick}
									/>
								)}
							</>
						) : (
							<>
								{isUploading ? (
									<div className={`w-52 lg:w-60 h-52 lg:h-60 ${rounded?'rounded-full':'rounded-md'} flex items-center justify-center relative`}>
										<Spinner />
										<div className={`w-full h-full ${rounded?'rounded-full':'rounded-md'} flex items-center justify-center bg-black absolute top-0 bottom-0 left-0 right-0 opacity-20`}>
											<img
												src={selectedImage}
												alt={altTitle}
												// className='h-32 w-32 ${rounded?'rounded-full':'rounded-md'} object-cover'
												className={`w-52 lg:w-60 h-52 lg:h-60 ${rounded?'rounded-full':'rounded-md'} object-cover cursor-pointer`}
											/>
										</div>
									</div>
								) : (
									<div className={`w-52 lg:w-60 h-52 lg:h-60 ${rounded?'rounded-full':'rounded-md'} flex items-center justify-center bg-black`}>
										<img
											src={selectedImage}
											alt={altTitle}
											// className='h-32 w-32 ${rounded?'rounded-full':'rounded-md'} object-cover'
											className={`w-52 lg:w-60 h-52 lg:h-60 ${rounded?'rounded-full':'rounded-md'} object-cover cursor-pointer`}
											onClick={handleClick}
										/>
									</div>
								)}
							</>
						)}
					</div>
				) : (
					<div className='w-full flex items-center justify-center'>
						{isBanner ? (
							<div className='w-full lg:w-full h-24 lg:h-60 rounded-md flex items-center justify-center border-2 border-dashed bg-brand-light-gray'>
								{isUploading ? (
									<Spinner />
								) : (
									// <ImagePlus className='text-border h-16 w-16' />
									<>
										<img
											className='w-full h-full object-cover cursor-pointer'
											src={cover}
											alt='Rounded avatar'
											onClick={handleClick}
										/>
									</>
								)}
							</div>
						) : (
							<div className={`w-24 lg:w-60 h-24 lg:h-60 ${rounded?'rounded-full':'rounded-md'} flex items-center justify-center border-2 border-dashed bg-brand-light-gray`}>
								{isUploading ? (
									<Spinner />
								) : (
									// <UserPlus2 className='text-border h-12 w-12' />
									<>
										<img
											className={`w-full h-full ${rounded?'rounded-full':'rounded-md'} cursor-pointer object-cover`}
											src={avatar}
											alt='Rounded avatar'
											onClick={handleClick}
										/>
									</>
								)}
							</div>
						)}
					</div>
				)}
			</div>

			<div className='p-2 flex  flex-row items-center gap-4 justify-between w-full'>
				<p
					className='font-medium text-brand-gray-dim text-lg cursor-pointer'
					onClick={onImageDelete}
					disabled={isUploading}>
					<img src={deleteIcon} alt='' className='h-6 sm:hidden' />

					<span className='hidden  sm:inline'>Delete Image</span>
				</p>
				<div className='flex gap-2'>
					<Button onClick={handleClick} size='md' variant='outline' className='text-md' disabled={isUploading}>
						<img src={change} alt='' className='h-6 sm:hidden' />

						<span className='hidden  sm:inline'>Change Image</span>
					</Button>
					<Button
						onClick={() => {
							onUploadImage()
						}}
						size='md'
						variant='black'
						className='text-md'
						disabled={isUploading}>
						<img src={confirm} alt='' className='h-6 sm:hidden' />
						<span className='hidden  sm:inline'>Apply</span>
					</Button>
				</div>
			</div>
		</div>
	)
}

export default PictureUpload
