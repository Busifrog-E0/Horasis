import { useState } from 'react'
import TodaysEventTab from '../components/Events/TodaysEventTab'
import RecentlyActiveMemebrsTab from '../components/Members/RecentlyActiveMemebrsTab'
import CurrentProfileTab from '../components/Profile/CurrentProfileTab'
import Button from '../components/ui/Button'
import Steps from '../components/ui/Steps'
import { useNavigate } from 'react-router-dom'
import CreateArticleStep1 from '../components/Articles/CreateArticle/CreateArticleSteps/CreateArticleStep1'
import CreateArticleStep2 from '../components/Articles/CreateArticle/CreateArticleSteps/CreateArticleStep2'
import ArticleMiniTab from '../components/Articles/ArticleMiniTab'
import { useAuth } from '../utils/AuthProvider'
import { useToast } from '../components/Toast/ToastService'
import Modal from '../components/ui/Modal'
import { PostArticleSchema } from '../utils/schema/articles/articleValidation'
import { postItem } from '../constants/operations'
import ArticleMiniSection from '../components/Articles/ArticleMiniSection'
import Spinner from '../components/ui/Spinner'

const CreateArticle = () => {
	const [activeStep, setActiveStep] = useState(1)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const navigate = useNavigate()

	const changeStep = (step) => {
		console.log(step)
		if (step >= 1 && step <= 2) {
			setActiveStep(step)
		}
		if (step === 3) {
			navigate(`/Articles/${123}`)
		}
	}

	const steps = [
		{ title: 'Details', no: 1 },
		{ title: 'Cover', no: 2 },
	]

	const isFirstStep = activeStep === 1
	const isSecondStep = activeStep === 2

	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [errorObj, setErrorObj] = useState({})
	const [postArticleData, setPostArticleData] = useState({
		ArticleName: '',
		Description: '',
		AuthorId: currentUserData.CurrentUser.UserId,
		CoverPicture: '',
		Tags: [],
	})

	const postArticle = () => {
		setIsModalOpen(false)
		onCoverImageUpload()
	}

	const [isImageUploading, setIsImageUploading] = useState(false)
	const [selectedCoverImage, setSelectedCoverImage] = useState(null)
	const [coverImageToUpload, setCoverImageToUpload] = useState(null)
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
		postItem(
			'articles',
			{ ...postArticleData, CoverPicture: url },
			(result) => {
				if (result) {
					setIsModalOpen(false)
					navigate(`/Articles/${result}`)
				}
				setIsImageUploading(false)
			},
			(err) => {
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

	const validate = (callback) => {
		const { error, warning } = PostArticleSchema.validate(postArticleData, {
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
		setPostArticleData({ ...postArticleData, ...value })
		const { error, warning } = PostArticleSchema.extract(key).validate(value[key], {
			abortEarly: false,
			stripUnknown: true,
		})
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

	return (
		<>
			<Modal isOpen={isModalOpen}>
				<Modal.Header>
					<p className='font-medium text-lg'>Are you sure to publish article ?</p>
				</Modal.Header>
				<Modal.Body>
					<div className='flex items-center gap-2 justify-end'>
						<Button variant='outline' size='md' onClick={() => setIsModalOpen(false)}>
							Cancel
						</Button>
						<Button variant='black' size='md' onClick={() => postArticle()}>
							Confirm
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			{/* <div className='p-2 lg:px-10 lg:py-6'>
				<div className='grid lg:grid-cols-4 gap-3 lg:gap-12'>
					<div className='hidden lg:block'>
						<CurrentProfileTab />
						<h4 className='font-medium text-xl text-system-primary-text mt-3 lg:mt-5'>Today's Event</h4>
						<TodaysEventTab />

						<div className='p-6 bg-system-secondary-bg rounded-lg mt-3 lg:mt-5'>
							<h4 className='font-medium text-md text-system-primary-text mb-4'>Recently Active Members</h4>
							<RecentlyActiveMemebrsTab />
						</div>
					</div>
				
				</div>
			</div> */}
			<div className='lg:col-span-2'>
				<Steps changeStep={changeStep} activeStep={activeStep} steps={steps} />
				<h4 className='font-medium text-2xl text-system-primary-accent mt-5 mb-4'>Create an Article</h4>
				<div className='p-6 bg-system-secondary-bg rounded-lg'>
				{isImageUploading && (
						<div className='absolute top-0 left-0 bg-system-secondary-bg-transparent w-full h-full flex items-center justify-center'>
							<Spinner />
						</div>
					)}
					{activeStep === 1 && (
						<CreateArticleStep1
							postArticleData={postArticleData}
							setPostArticleData={setPostArticleData}
							validateSingle={validateSingle}
							errorObj={errorObj}
						/>
					)}
					{activeStep === 2 && (
						<CreateArticleStep2
							selectedImage={selectedCoverImage}
							onImageSelect={onCoverImageSelect}
							fileFieldName='CoverPicture'
						/>
					)}

					{/* {activeStep !== 2 && */}
					<div className='grid grid-cols-2 lg:grid-cols-3 gap-4 py-8'>
						<div className='hidden lg:block'></div>
						<div className='col-span-1'>
							{!isFirstStep && (
								<Button onClick={() => changeStep(activeStep - 1)} variant='outline' width='full'>
									Back
								</Button>
							)}
						</div>
						<div className='col-span-1'>
							{isFirstStep && (
								<Button onClick={() => validate(() => changeStep(activeStep + 1))} width='full' variant='black'>
									Next
								</Button>
							)}
							{isSecondStep && (
								<Button onClick={() => setIsModalOpen(true)} width='full' variant='black'>
									Publish
								</Button>
							)}
						</div>
					</div>
					{/* } */}
				</div>
			</div>
			<div>
				<ArticleMiniSection />
			</div>
		</>
	)
}

export default CreateArticle
