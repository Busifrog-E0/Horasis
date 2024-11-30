import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import arrowback from '../assets/icons/arrowback.svg'
import camera from '../assets/icons/camera.svg'
import close from '../assets/icons/close.svg'
import cover from '../assets/icons/cover.svg'
import graysave from '../assets/icons/graysave.svg'
import graysavefill from '../assets/icons/graysavefill.svg'
import { useToast } from '../components/Toast/ToastService'
import { useAuth } from '../utils/AuthProvider'

import PictureUpload from '../components/Profile/EditProfile/PictureUpload'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import useDeleteData from '../hooks/useDeleteData'
import useGetData from '../hooks/useGetData'
import usePostData from '../hooks/usePostData'
import useTranslation from '../hooks/useTranslation'
import useUpdateData from '../hooks/useUpdateData'
import { getDateInWordsFormat } from '../utils/date'
import useEntitySaveManager from '../hooks/useEntitySaveManager'
import TagsList from '../components/Tags/TagsList'

const SingleArticles = () => {
	const navigate = useNavigate()
	const { articleid } = useParams()
	const { currentUserData } = useAuth()

	const { isLoading, data: article, getData: getArticle, setData: setArticle } = useGetData(`articles/${articleid}`)

	// cover photo upload logic
	const [selectedCoverImage, setSelectedCoverImage] = useState(null)
	const [coverImageToUpload, setCoverImageToUpload] = useState(null)
	const [isCoverPictureOpen, setIsCoverPictureOpen] = useState(false)

	const { isLoading: isCoverUploading, postData: postCoverUpload } = usePostData({
		onSuccess: (result) => {
			onCoverImageSet(result.FileUrl)
		},
	})
	const { isLoading: isCoverPatching, updateData: updateCoverUpload } = useUpdateData({
		onSuccess: (result) => {
			if (result === true) {
				setIsCoverPictureOpen(false)
				getArticle()
			}
		},
	})
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
		return updateCoverUpload({
			endpoint: `articles/${articleid}/coverPicture`,
			payload: { CoverPicture: url },
		})
	}
	const onCoverImageUpload = () => {
		if (coverImageToUpload) {
			postCoverUpload({
				endpoint: 'files/users',
				payload: coverImageToUpload,
			})
		} else {
			onCoverImageSet('')
		}
	}

	const { isSaving, isUnsaving, saveEntity, unsaveEntity } = useEntitySaveManager({
		EntityId: article?.DocId,
		Type: 'Article',
		successCallback: getArticle,
		errorCallback: () => {},
	})

	const {
		isTranslated: translated,
		isTranslating: translating,
		translate: translateArticle,
		showOriginal,
		homeLanguage,
	} = useTranslation({ data: article, setData: setArticle, Type: 'Article' })
	if (isLoading) {
		return <Spinner />
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
							disabled={isCoverPatching || isCoverUploading}>
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
							altTitle='Cover Picture'
							selectedImage={selectedCoverImage}
							setSelectedImage={setSelectedCoverImage}
							onImageSelect={onCoverImageSelect}
							onImageDelete={onCoverImageDelete}
							onUploadImage={onCoverImageUpload}
							fileFieldName={'CoverPicture'}
							isUploading={isCoverPatching || isCoverUploading}
						/>
					</div>
				</Modal.Body>
			</Modal>
			<div className='p-4 md:px-10 max-w-9xl md:py-10'>
				<div className='overflow-hidden h-80 lg:h-96 relative rounded-t-2xl'>
					{article?.CoverPicture ? (
						<img src={article?.CoverPicture} className='object-cover h-full w-full' />
					) : (
						<img src={cover} className='object-cover h-full w-full' />
					)}
					<div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6  h-100 overflow-hidden overflow-y-auto bg-system-black-transparent'>
						<div className='flex w-full items-start justify-between'>
							<div
								className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}
								onClick={() => navigate(-1)}>
								<img src={arrowback} alt='' className='h-6 cursor-pointer' />
							</div>
							<div className='flex gap-2'>
								{article?.UserDetails?.DocId === currentUserData.CurrentUser.UserId && (
									<div
										onClick={() => {
											setIsCoverPictureOpen(true)
											if (article?.CoverPicture) {
												setSelectedCoverImage(article?.CoverPicture)
											} else {
												setSelectedCoverImage(null)
											}
										}}
										className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}>
										<img src={camera} alt='' className='h-6 cursor-pointer' />
									</div>
								)}
								<div
									className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer `}>
									{isSaving || isUnsaving ? (
										<div className=' self-end'>
											<Spinner />
										</div>
									) : (
										<>
											{article?.HasSaved ? (
												<img src={graysavefill} alt='' className='h-6 cursor-pointer' onClick={unsaveEntity} />
											) : (
												<img src={graysave} alt='' className='h-6 cursor-pointer' onClick={saveEntity} />
											)}
										</>
									)}
								</div>
							</div>
						</div>
						<div>
							<h4 className='font-medium shadow-lg text-4xl text-white mb-3'>{article?.ArticleName}</h4>
							<div className='flex flex-row flex-wrap gap-3'>
								<h4 className='text-2xl text-white'>{article?.UserDetails?.FullName}</h4>
								<h4 className='text-2xl text-white'>•</h4>
								<h4 className='text-2xl text-white'>{getDateInWordsFormat(new Date(article?.CreatedIndex))}</h4>
								{article?.OriginalLanguage !== homeLanguage && (
									<>
										<h4 className='text-2xl text-white'>•</h4>
										{translating ? (
											<h4 className='text-2xl text-white  cursor-pointer'>Translating...</h4>
										) : (
											<>
												{translated ? (
													<h4 className='text-2xl text-white  cursor-pointer' onClick={showOriginal}>
														Show Original
													</h4>
												) : (
													<h4 className='text-2xl text-white  cursor-pointer' onClick={translateArticle}>
														Translate this article
													</h4>
												)}
											</>
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className='lg:col-span-3 px-10 bg-system-secondary-bg py-10 rounded-b-2xl'>
					{article?.Tags && article?.Tags.length > 0 && (
						<div className='flex  gap-2 mb-6 flex-wrap'>
							<TagsList tags={article?.Tags} />
						</div>
					)}
					<h4 className='text-xl text-brand-gray  leading-8 whitespace-pre-line'>{article?.Description}</h4>
				</div>
			</div>
		</>
	)
}

export default SingleArticles
