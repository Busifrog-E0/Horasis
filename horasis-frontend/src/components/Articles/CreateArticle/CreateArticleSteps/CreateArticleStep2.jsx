import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import Cropper from 'react-easy-crop'
import { useToast } from '../../../Toast/ToastService'
import { getCroppedImg } from '../../../../utils/cropUtils'
import { blobToUint8Array } from '../../../../utils/utils'
import Button from '../../../ui/Button'
import edit from '../../../../assets/icons/edit.svg'

const CreateArticleStep2 = forwardRef(({ selectedImage, onImageSelect, fileFieldName, cropping, setCropping }, ref) => {
	const toast = useToast()
	const fileInputRef = useRef(null)

	const [imageSrc, setImageSrc] = useState(null)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

	// Handle image change (selecting a new image)
	const handleImageChange = (e) => {
		const files = Array.from(e.target.files)
		const notAllow = files.some((file) => file.size > 6000000)

		if (notAllow) {
			toast.open('error', 'Max File Size', 'File size should be less than 6MB')
		} else {
			const file = files[0]
			const reader = new FileReader()

			// Load image for cropping
			reader.onload = () => {
				setImageSrc(reader.result)
				setCropping(true) // Enable cropping mode
			}

			reader.readAsDataURL(file)
		}
	}

	// Handle crop completion
	const onCropComplete = (croppedArea, croppedPixels) => {
		setCroppedAreaPixels(croppedPixels)
	}

	// Save the cropped image – this function is both used internally and exposed imperatively.
	const handleCropSave = async () => {
		try {
			const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
			const fileDataUint8Array = await blobToUint8Array(croppedImage)
			const fileDataByteArray = Array.from(fileDataUint8Array)

			onImageSelect({
				FileType: 'image/jpeg',
				FileData: fileDataByteArray,
				FileName: 'cropped-article-image.jpg',
				FileFieldName: fileFieldName,
			})

			setImageSrc(null)
			setCropping(false) // Exit cropping mode

			return {
				FileType: 'image/jpeg',
				FileData: fileDataByteArray,
				FileName: 'cropped-article-image.jpg',
				FileFieldName: fileFieldName,
			}
		} catch (e) {
			console.error(e)
			toast.open('error', 'Crop Error', 'An error occurred while cropping the image')
		}
	}

	// Open file picker
	const handleClick = () => {
		fileInputRef.current.click()
	}

	// Expose handleCropSave imperatively to parent components
	useImperativeHandle(
		ref,
		() => ({
			handleCropSave,
		}),
		[handleCropSave]
	)

	return (
		<div className='flex flex-col gap-4'>
			<div>
				<input
					onChange={handleImageChange}
					ref={fileInputRef}
					type='file'
					id='createArticleCoverPhotoPicker'
					className='hidden'
				/>

				{cropping ? (
					// Cropping UI
					<div className='flex flex-col w-full gap-2'>
						<div className='w-full h-60 rounded-md flex items-center justify-center relative'>
							<Cropper
								image={imageSrc}
								crop={crop}
								zoom={zoom}
								aspect={13 / 3} // Aspect ratio for cover photo (1950x450)
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
							/>
						</div>
						{/* <Button onClick={handleCropSave} variant='black' width='full' className='text-white py-2 px-4 rounded-md'>
							Save Crop
						</Button> */}
					</div>
				) : (
					<div className='flex flex-row items-center justify-center mb-8'>
						{selectedImage ? (
							<label htmlFor='createArticleCoverPhotoPicker' className='w-full cursor-pointer'>
								<div className='h-36 w-full bg-system-file-border rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden'>
									<img src={selectedImage} className='object-cover h-full w-full' />
								</div>
							</label>
						) : (
							<label htmlFor='createArticleCoverPhotoPicker' className='w-full cursor-pointer'>
								<div className='h-36 w-full bg-system-file-border rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden'>
								<svg
											className='text-brand-secondary h-8 w-8'
											aria-hidden='true'
											xmlns='http://www.w3.org/2000/svg'
											fill='currentColor'
											viewBox='0 0 24 24'>
											<path d='M0 0h24v24H0z' fill='none' />
											<path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
										</svg>
								</div>
							</label>
						)}
					</div>
				)}

				<h1 className='text-system-primary-text font-medium text-lg'>Upload Cover Photo</h1>
				<p className='text-brand-gray mt-1 mb-2 text-base'>
					The cover photo will be used to communicate the header of your article.
				</p>
				<p className='text-brand-gray mt-2 mb-2 text-base'>
					For best result, upload an image that is 1950px by 450px or larger.
				</p>
			</div>
			{imageSrc && (
				<div className='flex gap-2'>
					<Button
						onClick={handleClick}
						size='md'
						variant='outline'
						className='text-sm outline-0 border-0 ring-0 shadow-none hover:bg-transparent p-0'>
						<img src={edit} alt='' className='h-5 ' />
						<span className='inline'>Change Image</span>
					</Button>
				</div>
			)}
		</div>
	)
})

export default CreateArticleStep2
