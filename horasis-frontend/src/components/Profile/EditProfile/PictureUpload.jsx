import { useState, useRef } from 'react'
import Spinner from '../../ui/Spinner'
import Button from '../../ui/Button'
import avatar from '../../../assets/icons/avatar.svg'
import cover from '../../../assets/icons/cover.svg'
import change from '../../../assets/icons/change.svg'
import confirm from '../../../assets/icons/confirm.svg'
import deleteIcon from '../../../assets/icons/delete.svg'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../../../utils/cropUtils' // Utility to crop image

import { useToast } from '../../Toast/ToastService'
import { blobToUint8Array } from '../../../utils/utils'

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
	rounded = true,
}) => {
	const fileInputRef = useRef(null)
	const toast = useToast()

	const [imageSrc, setImageSrc] = useState(null)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
	const [cropping, setCropping] = useState(false)

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files)
		const notAllow = files.some((file) => file.size > 3000000)
		if (notAllow) {
			toast.open('error', 'Max File Size', 'File size should be less than 3MB')
		} else {
			const file = files[0]
			const reader = new FileReader()
			reader.onload = () => {
				setImageSrc(reader.result)
				setCropping(true) // Start cropping mode
			}
			reader.readAsDataURL(file)
		}
	}

	const onCropComplete = (croppedArea, croppedPixels) => {
		setCroppedAreaPixels(croppedPixels)
	}

	const handleCropSave = async () => {
		try {
			const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)

			const fileDataUint8Array = await blobToUint8Array(croppedImage)
			const fileDataByteArray = Array.from(fileDataUint8Array)

			// setSelectedImage(croppedImage)
			setCropping(false) // Exit cropping mode
			onImageSelect({
				FileType: 'image/jpeg',
				FileData: fileDataByteArray,
				FileName: 'cropped-image.jpg',
				FileFieldName: fileFieldName,
			})

			return {
				FileType: 'image/jpeg',
				FileData: fileDataByteArray,
				FileName: 'cropped-image.jpg',
				FileFieldName: fileFieldName,
			}
		} catch (e) {
			console.error(e)
			toast.open('error', 'Crop Error', 'An error occurred while cropping')
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
				{cropping ? (
					// Cropping UI
					<div className='flex flex-col w-full gap-2'>
						<div className='w-full lg:w-full h-24 lg:h-60 rounded-md flex items-center justify-center relative'>
							<Cropper
								image={imageSrc}
								crop={crop}
								zoom={zoom}
								aspect={isBanner ? 16 / 5 : 1}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
							/>
						</div>
						{/* <Button onClick={handleCropSave} size='md' variant='black' className='text-md z-50'>
							Save Crop
						</Button> */}
					</div>
				) : selectedImage ? (
					<div className='w-full flex items-center justify-center'>
						{isBanner ? (
							<>
								{isUploading ? (
									<div className='w-full lg:w-full h-24 lg:h-60 rounded-md flex items-center justify-center relative'>
										<Spinner />
										<div className='w-full lg:w-full h-24 lg:h-60 rounded-md flex items-center justify-center bg-black absolute top-0 bottom-0 left-0 right-0 opacity-20'>
											<img
												src={selectedImage}
												alt={altTitle}
												className='w-full lg:w-full h-24 lg:h-60 rounded-md object-cover cursor-pointer'
											/>
										</div>
									</div>
								) : (
									<img
										src={selectedImage}
										alt={altTitle}
										className='w-full lg:w-full h-24 lg:h-60 rounded-md object-cover cursor-pointer'
										onClick={handleClick}
									/>
								)}
							</>
						) : (
							<>
								{isUploading ? (
									<div
										className={`w-52 lg:w-60 h-52 lg:h-60 ${
											rounded ? 'rounded-full' : 'rounded-md'
										} flex items-center justify-center relative`}>
										<Spinner />
										<div
											className={`w-full h-full ${
												rounded ? 'rounded-full' : 'rounded-md'
											} flex items-center justify-center bg-black absolute top-0 bottom-0 left-0 right-0 opacity-20`}>
											<img
												src={selectedImage}
												alt={altTitle}
												className={`w-52 lg:w-60 h-52 lg:h-60 ${
													rounded ? 'rounded-full' : 'rounded-md'
												} object-cover cursor-pointer`}
											/>
										</div>
									</div>
								) : (
									<div
										className={`w-52 lg:w-60 h-52 lg:h-60 ${
											rounded ? 'rounded-full' : 'rounded-md'
										} flex items-center justify-center bg-black`}>
										<img
											src={selectedImage}
											alt={altTitle}
											className={`w-52 lg:w-60 h-52 lg:h-60 ${
												rounded ? 'rounded-full' : 'rounded-md'
											} object-cover cursor-pointer`}
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
									<>
										<img
											className='w-full h-full object-cover cursor-pointer'
											src={cover}
											alt='Upload cover'
											onClick={handleClick}
										/>
									</>
								)}
							</div>
						) : (
							<div
								className={`w-24 lg:w-60 h-24 lg:h-60 ${
									rounded ? 'rounded-full' : 'rounded-md'
								} flex items-center justify-center border-2 border-dashed bg-brand-light-gray`}>
								{isUploading ? (
									<Spinner />
								) : (
									<>
										<img
											className={`w-full h-full ${rounded ? 'rounded-full' : 'rounded-md'} cursor-pointer object-cover`}
											src={avatar}
											alt='Upload avatar'
											onClick={handleClick}
										/>
									</>
								)}
							</div>
						)}
					</div>
				)}
			</div>

			<div className='p-2 flex flex-row items-center gap-4 justify-between w-full'>
				<p
					className='font-medium text-brand-gray-dim text-lg cursor-pointer'
					onClick={onImageDelete}
					disabled={isUploading}>
					<img src={deleteIcon} alt='' className='h-6 sm:hidden' />
					<span className='hidden sm:inline'>Delete Image</span>
				</p>
				<div className='flex gap-2'>
					<Button onClick={handleClick} size='md' variant='outline' className='text-md' disabled={isUploading}>
						<img src={change} alt='' className='h-6 sm:hidden' />
						<span className='hidden sm:inline'>Change Image</span>
					</Button>
					<Button
						onClick={async () => {
							const imageToUpload = await handleCropSave()
							onUploadImage(imageToUpload)
						}}
						size='md'
						variant='black'
						className='text-md'
						disabled={isUploading}>
						<img src={confirm} alt='' className='h-6 sm:hidden' />
						<span className='hidden sm:inline'>Apply</span>
					</Button>
				</div>
			</div>
		</div>
	)
}

export default PictureUpload
