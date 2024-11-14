import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreatePodcastStep1 from '../components/Podcasts/CreatePodcast/CreatePodcastSteps/CreatePodcastStep1'
import CreatePodcastStep2 from '../components/Podcasts/CreatePodcast/CreatePodcastSteps/CreatePodcastStep2'
import CreatePodcastStep3 from '../components/Podcasts/CreatePodcast/CreatePodcastSteps/CreatePodcastStep3'
import SavedPodcastTab from '../components/Podcasts/Saved/SavedPodcastTab'
import PodcastSettings from '../components/Podcasts/SinglePodcastTabs/PodcastSettings'

import { useToast } from '../components/Toast/ToastService'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import Steps from '../components/ui/Steps'
import { postItem } from '../constants/operations'
import { AuthContext } from '../utils/AuthProvider'

import { PostPodcastSchema } from '../utils/schema/podcasts/podcastValidation'
import Settings from '../components/Common/PermissionsManagement/Settings'

const CreatePodcast = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [activeStep, setActiveStep] = useState(1)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const navigate = useNavigate()
	const [errorObj, setErrorObj] = useState({})
	const [postPodcastData, setPostPodcastData] = useState({
		PodcastName: '',
		// Brief: '',
		Description: '',
		OrganiserId: currentUserData.CurrentUser.UserId,
		Privacy: 'Public',
		CoverPicture: '',
		Tags: [],
	})
	const [podcastId, setPodcastId] = useState('')

	const changeStep = (step) => {
		if (step >= 1 && step <= 3) {
			setActiveStep(step)
		}
		if (step === 4) {
			navigate(`/Podcasts/${podcastId}`)
		}
	}

	const steps = [
		{ title: 'Details', no: 1 },
		{ title: 'Cover', no: 2 },
		{ title: 'Settings', no: 3 },
	]

	const isFirstStep = activeStep === 1
	const isSecondStep = activeStep === 2
	const isThirdStep = activeStep === 3
	// const isFourthStep = activeStep === 4

	const postPodcast = () => {
		setIsModalOpen(false)
		onCoverImageUpload()
	}

	const [isImageUploading, setIsImageUploading] = useState(false)
	const [selectedCoverImage, setSelectedCoverImage] = useState(null)
	const [coverImageToUpload, setCoverImageToUpload] = useState(null)
	const onCoverImageSelect = (imageData) => {
		setCoverImageToUpload({ ...imageData, Type: 'Podcasts' })
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
			'podcasts',
			{ ...postPodcastData, CoverPicture: url },
			(result) => {
				if (result) {
					setPodcastId(result)
					setIsModalOpen(false)
					changeStep(activeStep + 1)
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
		const { error, warning } = PostPodcastSchema.validate(postPodcastData, {
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
		setPostPodcastData({ ...postPodcastData, ...value })
		const { error, warning } = PostPodcastSchema.extract(key).validate(value[key], {
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

	const [podcast, setpodcast] = useState('')
	const getpodcast = () => {
		getItem(
			`podcasts/${podcastId}`,
			(result) => {
				setpodcast(result)
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	useEffect(() => {
		getpodcast()
	}, [podcastId])

	return (
		<>
			<Modal isOpen={isModalOpen}>
				<Modal.Header>
					<p className='font-medium text-lg'>Confirm podcast creation ?</p>
				</Modal.Header>
				<Modal.Body>
					<div className='flex items-center gap-2 justify-end'>
						<Button variant='outline' size='md' onClick={() => setIsModalOpen(false)}>
							Cancel
						</Button>
						<Button variant='black' size='md' onClick={() => postPodcast()}>
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
					</div>
				
				</div>
			</div> */}
			<div className='lg:col-span-2'>
				<Steps changeStep={changeStep} activeStep={activeStep} steps={steps} />
				<h4 className='font-medium text-2xl text-system-primary-accent mt-5 mb-4'>Create a Podcast Topic</h4>
				<div className='p-6 bg-system-secondary-bg rounded-lg relative overflow-hidden'>
					{isImageUploading && (
						<div className='absolute top-0 left-0 bg-system-secondary-bg-transparent w-full h-full flex items-center justify-center'>
							<Spinner />
						</div>
					)}
					{activeStep === 1 && (
						<CreatePodcastStep1
							postPodcastData={postPodcastData}
							setPostPodcastData={setPostPodcastData}
							validateSingle={validateSingle}
							errorObj={errorObj}
						/>
					)}
					{activeStep === 2 && (
						<CreatePodcastStep2
							selectedImage={selectedCoverImage}
							onImageSelect={onCoverImageSelect}
							fileFieldName='CoverPicture'
						/>
					)}
					{/* {activeStep === 3 && <CreatePodcastStep3 podcastId={podcastId} />} */}
					{activeStep === 3 && (
						<Settings
							EntityId={podcastId}
							from='create'
							Type='Podcast'
							Entity={podcast}
							permissionsToShow={{
								Invitation: false,
								Activity: true,
								Photo: false,
								Album: false,
								Video: true,
								Admin: true,
							}}
						/>
					)}

					{/* {activeStep !== 4 && */}
					<div className='flex justify-end gap-4 py-8'>
						<div className='hidden lg:block'></div>
						<div className='col-span-1'>
							{!isFirstStep && !isThirdStep && (
								<Button onClick={() => changeStep(activeStep - 1)} variant='outline' width='full' className='px-10'>
									Back
								</Button>
							)}
						</div>
						<div className='col-span-1'>
							{isFirstStep && (
								<Button
									onClick={() => validate(() => changeStep(activeStep + 1))}
									width='full'
									className='px-10'
									variant='black'>
									Next
								</Button>
							)}
							{isSecondStep && (
								<Button onClick={() => setIsModalOpen(true)} width='full' className='px-10' variant='black'>
									Create Podcast
								</Button>
							)}
							{/* {isThirdStep && (
								<Button onClick={() => changeStep(activeStep + 1)} width='full' className='px-10' variant='black'>
									Next
								</Button>
							)} */}
							{isThirdStep && (
								<Button onClick={() => changeStep(activeStep + 1)} width='full' className='px-10' variant='black'>
									Done
								</Button>
							)}
						</div>
					</div>
					{/* } */}
				</div>
			</div>
			<div>
				<SavedPodcastTab />
			</div>
		</>
	)
}

export default CreatePodcast
