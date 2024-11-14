import { useContext, useEffect, useState } from 'react'
import TodaysEventTab from '../components/Events/TodaysEventTab'
import PostTab from '../components/Posts/PostTab'
import CurrentProfileTab from '../components/Profile/CurrentProfileTab'
import DropdownMenu from '../components/ui/DropdownMenu'
import { relativeTime } from '../utils/date'
import Steps from '../components/ui/Steps'
import { useNavigate } from 'react-router-dom'
import CreateDiscussionStep1 from '../components/Discussions/CreateDiscussion/CreateDiscussionSteps/CreateDiscussionStep1'
import CreateDiscussionStep2 from '../components/Discussions/CreateDiscussion/CreateDiscussionSteps/CreateDiscussionStep2'
import CreateDiscussionStep3 from '../components/Discussions/CreateDiscussion/CreateDiscussionSteps/CreateDiscussionStep3'
import CreateDiscussionStep4 from '../components/Discussions/CreateDiscussion/CreateDiscussionSteps/CreateDiscussionStep4'
import Button from '../components/ui/Button'
import { getItem, patchItem, postItem } from '../constants/operations'
import { AuthContext } from '../utils/AuthProvider'
import { useToast } from '../components/Toast/ToastService'
import Spinner from '../components/ui/Spinner'
import Modal from '../components/ui/Modal'
import { PostDiscussionSchema } from '../utils/schema/discussions/discussionValidation'
import DiscussionSettings from '../components/Discussions/SingleDiscussionTabs/DiscussionSettings'
import EmptyMembers from '../components/Common/EmptyMembers'
import SavedDiscussionTab from '../components/Discussions/Saved/SavedDiscussionTab'
import Settings from '../components/Common/PermissionsManagement/Settings'

const CreateDiscussion = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [activeStep, setActiveStep] = useState(1)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const navigate = useNavigate()
	const [errorObj, setErrorObj] = useState({})
	const [postDiscussionData, setPostDiscussionData] = useState({
		DiscussionName: '',
		Brief: '',
		Description: '',
		OrganiserId: currentUserData.CurrentUser.UserId,
		Privacy: 'Public',
		CoverPicture: '',
		Tags: [],
	})
	const [discussionId, setDiscussionId] = useState('')

	const changeStep = (step) => {
		if (step >= 1 && step <= 4) {
			setActiveStep(step)
		}
		if (step === 5) {
			navigate(`/discussions/${discussionId}`)
		}
	}

	const steps = [
		{ title: 'Details', no: 1 },
		{ title: 'Cover', no: 2 },
		{ title: 'Invites', no: 3 },
		{ title: 'Settings', no: 4 },
	]

	const isFirstStep = activeStep === 1
	const isSecondStep = activeStep === 2
	const isThirdStep = activeStep === 3
	const isFourthStep = activeStep === 4

	const postDiscussion = () => {
		setIsModalOpen(false)
		onCoverImageUpload()
	}

	const [isImageUploading, setIsImageUploading] = useState(false)
	const [selectedCoverImage, setSelectedCoverImage] = useState(null)
	const [coverImageToUpload, setCoverImageToUpload] = useState(null)
	const onCoverImageSelect = (imageData) => {
		setCoverImageToUpload({ ...imageData, Type: 'Discussions' })
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
			'discussions',
			{ ...postDiscussionData, CoverPicture: url },
			(result) => {
				if (result) {
					setDiscussionId(result)
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
		const { error, warning } = PostDiscussionSchema.validate(postDiscussionData, {
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
		setPostDiscussionData({ ...postDiscussionData, ...value })
		const { error, warning } = PostDiscussionSchema.extract(key).validate(value[key], {
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

	const [discussion, setDiscussion] = useState('')
	const getEvent = () => {
		getItem(
			`discussions/${discussionId}`,
			(result) => {
				setDiscussion(result)
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	useEffect(() => {
		getEvent()
	}, [discussionId])

	return (
		<>
			<Modal isOpen={isModalOpen}>
				<Modal.Header>
					<p className='font-medium text-lg'>Confirm discussion creation ?</p>
				</Modal.Header>
				<Modal.Body>
					<div className='flex items-center gap-2 justify-end'>
						<Button variant='outline' size='md' onClick={() => setIsModalOpen(false)}>
							Cancel
						</Button>
						<Button variant='black' size='md' onClick={() => postDiscussion()}>
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
				<h4 className='font-medium text-2xl text-system-primary-accent mt-5 mb-4'>Create a Discussion Topic</h4>
				<div className='p-6 bg-system-secondary-bg rounded-lg relative overflow-hidden'>
					{isImageUploading && (
						<div className='absolute top-0 left-0 bg-system-secondary-bg-transparent w-full h-full flex items-center justify-center'>
							<Spinner />
						</div>
					)}
					{activeStep === 1 && (
						<CreateDiscussionStep1
							postDiscussionData={postDiscussionData}
							setPostDiscussionData={setPostDiscussionData}
							validateSingle={validateSingle}
							errorObj={errorObj}
						/>
					)}
					{activeStep === 2 && (
						<CreateDiscussionStep2
							selectedImage={selectedCoverImage}
							onImageSelect={onCoverImageSelect}
							fileFieldName='CoverPicture'
						/>
					)}
					{activeStep === 3 && <CreateDiscussionStep3 discussionId={discussionId} />}
					{activeStep === 4 && <Settings EntityId={discussionId} from='create' Entity={discussion} Type='Discussion' />}

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
									Create Discussion
								</Button>
							)}
							{isThirdStep && (
								<Button onClick={() => changeStep(activeStep + 1)} width='full' className='px-10' variant='black'>
									Next
								</Button>
							)}
							{isFourthStep && (
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
				<SavedDiscussionTab />
			</div>
		</>
	)
}

export default CreateDiscussion
