import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../../../../utils/cropUtils'
import { blobToUint8Array } from '../../../../utils/utils'
import { useToast } from '../../../Toast/ToastService'
import Button from '../../../ui/Button'
import imageIcon from '../../../../assets/icons/image.svg'
import edit from '../../../../assets/icons/edit.svg'

const CreateEventStep3 = forwardRef(({ selectedImage, onImageSelect, fileFieldName,cropping,setCropping }, ref) => {
	const toast = useToast()
	const fileInputRef = useRef(null)

	const [imageSrc, setImageSrc] = useState(selectedImage ? selectedImage : null)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

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

			onImageSelect({
				FileType: 'image/jpeg',
				FileData: fileDataByteArray,
				FileName: 'cropped-image.jpg',
				FileFieldName: fileFieldName,
			})
			setImageSrc(null)
			setCropping(false) // Exit cropping mode
			return {
				FileType: 'image/jpeg',
				FileData: fileDataByteArray,
				FileName: 'cropped-image.jpg',
				FileFieldName: fileFieldName,
			}
		} catch (e) {
			console.error(e)
			toast.open('error', 'Crop Error', 'An error occurred while cropping the image')
		}
	}

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
					id='createEventPhotoPicker'
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
								aspect={1} // Assuming square crop for this case
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
							/>
						</div>
						{/* <Button onClick={handleCropSave} variant='black' width='full' className='py-2 px-4 rounded-md'>
								Save Crop
							</Button> */}
					</div>
				) : (
					<div className='flex flex-row items-center justify-center mb-8'>
						{selectedImage ? (
							<label htmlFor='createEventPhotoPicker' className='cursor-pointer'>
								<div className='h-36 w-36 bg-brand-black-transparent rounded-lg flex flex-col items-center justify-center overflow-hidden'>
									<img src={selectedImage} className='object-cover h-full w-full' />
								</div>
							</label>
						) : (
							<label htmlFor='createEventPhotoPicker' className='cursor-pointer'>
								<div className='h-36 w-36 bg-brand-black-transparent rounded-lg flex flex-col items-center justify-center overflow-hidden'>
									<img src={imageIcon} alt='' />
									{/* <svg
											className='text-brand-secondary h-8 w-8'
											aria-hidden='true'
											xmlns='http://www.w3.org/2000/svg'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
										</svg> */}
								</div>
							</label>
						)}
					</div>
				)}

				<h1 className='text-system-primary-text font-medium text-lg'>Upload Photo</h1>
				<p className='text-brand-gray mt-1 mb-2 text-base'>
					Upload a photo that represents this group. This image will be shown on the main group page and in search
					results.
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

export default CreateEventStep3
