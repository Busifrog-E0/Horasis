import { useNavigate, useParams } from 'react-router-dom'
import cover from '../assets/icons/cover.svg'
import { useEffect, useState } from 'react'
import { getItem, patchItem, postItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'
import { useToast } from '../components/Toast/ToastService'
import arrowback from '../assets/icons/arrowback.svg'
import camera from '../assets/icons/camera.svg'
import close from '../assets/icons/close.svg'
import { getDateInWordsFormat } from '../utils/date'
import Modal from '../components/ui/Modal'
import PictureUpload from '../components/Profile/EditProfile/PictureUpload'

const SingleArticles = () => {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const { articleid } = useParams()
	const [article, setArticle] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()
	const handleGoBack = () => {
		navigate(-1)
	}
	const getArticle = () => {
		setIsLoading(true)
		getItem(
			`articles/${articleid}`,
			(result) => {
				setArticle(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err)
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	useEffect(() => {
		getArticle()
	}, [])

	// cover photo upload logic
	const [isImageUploading, setIsImageUploading] = useState(false)
	const [selectedCoverImage, setSelectedCoverImage] = useState(null)
	const [coverImageToUpload, setCoverImageToUpload] = useState(null)
	const [isCoverPictureOpen, setIsCoverPictureOpen] = useState(false)
	const onCoverImageSelect = (imageData) => {
		setCoverImageToUpload({ ...imageData, Type: 'Articles' })
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
			`articles/${articleid}/coverPicture`,
			{
				CoverPicture: url,
			},
			(result) => {
				if (result === true) {
					setIsCoverPictureOpen(false)
					getArticle()
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
			<div className='p-4 md:px-10 max-w-9xl md:py-10'>
				<div className='overflow-hidden h-80 lg:h-96 relative rounded-t-2xl'>
					{article.CoverPicture ? (
						<>
							<img src={article.CoverPicture} className='object-cover h-full w-full' />
						</>
					) : (
						<>
							<img src={cover} className='object-cover h-full w-full' />
						</>
					)}
					<div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6  h-100 overflow-hidden overflow-y-auto bg-system-black-transparent'>
						<div className='flex w-full items-start justify-between'>
							<div
								className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}
								onClick={handleGoBack}>
								<img src={arrowback} alt='' className='h-6 cursor-pointer' />

								{/* <h4 className='font-medium text-xl text-brand-secondary'>Back</h4> */}
							</div>
							{article?.UserDetails?.DocId === currentUserData.CurrentUser.UserId && (
								<div
									onClick={() => {
										setIsCoverPictureOpen(true)
										if (article.CoverPicture) {
											setSelectedCoverImage(article.CoverPicture)
										} else {
											setSelectedCoverImage(null)
										}
									}}
									className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}>
									<img src={camera} alt='' className='h-6 cursor-pointer' />
								</div>
							)}
						</div>
						<div>
							<h4 className='font-medium shadow-lg text-4xl text-white mb-3'>{article.ArticleName}</h4>
							<div className='flex flex-row flex-wrap gap-3'>
								<h4 className='text-2xl text-white'>{article?.UserDetails?.FullName}</h4>
								<h4 className='text-2xl text-white'>•</h4>
								<h4 className='text-2xl text-white'>{getDateInWordsFormat(new Date(article?.CreatedIndex))}</h4>
							</div>
						</div>
					</div>
				</div>
				<div className='lg:col-span-3 px-10 bg-system-secondary-bg py-10 rounded-b-2xl'>
					<h4 className='text-xl text-brand-gray  leading-8 whitespace-pre-line'>{article.Description}</h4>
				</div>
			</div>
		</>
	)
}

export default SingleArticles
