import { useContext, useState } from 'react'
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
import { patchItem, postItem } from '../constants/operations'
import { AuthContext } from '../utils/AuthProvider'
import { useToast } from '../components/Toast/ToastService'
import Spinner from '../components/ui/Spinner'

const CreateDiscussion = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [activeStep, setActiveStep] = useState(1)
	const navigate = useNavigate()
	const [postDiscussionData, setPostDiscussionData] = useState({
		DiscussionName: '',
		Brief: '',
		Description: '',
		OrganiserId: currentUserData.CurrentUser.UserId,
		Privacy: 'Public',
		CoverPicture: '',
	})

	const changeStep = (step) => {
		if (step >= 1 && step <= 4) {
			setActiveStep(step)
		}
		if (step === 5) {
			navigate(`/discussions/${123}`)
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

	const secondStepFunction = () => {
		onCoverImageUpload()
	}

	const [isImageUploading, setIsImageUploading] = useState(false)
	const [selectedCoverImage, setSelectedCoverImage] = useState(null)
	const [coverImageToUpload, setCoverImageToUpload] = useState(null)
	const onCoverImageSelect = (imageData) => {
		setCoverImageToUpload(imageData)
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
				if (result === true) {
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
	return (
		<>
			<div className='p-2 lg:px-10 lg:py-6'>
				<div className='grid lg:grid-cols-4 gap-3 lg:gap-12'>
					<div className='hidden lg:block'>
						<CurrentProfileTab />
						<h4 className='font-medium text-xl text-system-primary-text mt-3 lg:mt-5'>Today's Event</h4>
						<TodaysEventTab />
					</div>
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
								/>
							)}
							{activeStep === 2 && (
								<CreateDiscussionStep2
									selectedImage={selectedCoverImage}
									onImageSelect={onCoverImageSelect}
									fileFieldName='CoverPicture'
								/>
							)}
							{activeStep === 3 && <CreateDiscussionStep3 />}
							{activeStep === 4 && <CreateDiscussionStep4 />}

							{/* {activeStep !== 4 && */}
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
										<Button onClick={() => changeStep(activeStep + 1)} width='full' variant='black'>
											Next
										</Button>
									)}
									{isSecondStep && (
										<Button onClick={() => secondStepFunction()} width='full' variant='black'>
											Create Discussion
										</Button>
									)}
									{isThirdStep && (
										<Button onClick={() => changeStep(activeStep + 1)} width='full' variant='black'>
											Next
										</Button>
									)}
									{isFourthStep && (
										<Button onClick={() => changeStep(activeStep + 1)} width='full' variant='black'>
											Done
										</Button>
									)}
								</div>
							</div>
							{/* } */}
						</div>
					</div>
					<div>
						<div className='p-5 bg-system-secondary-bg rounded-lg'>
							<div className='flex items-center justify-between gap-2 mb-1'>
								<h4 className='font-medium text-2xl text-system-primary-text'>Saved Posts</h4>
								{/* arrow cursor-pointer */}
							</div>
							<div className='flex flex-col gap-3'>
								<PostTab />
								<div className='p-4 pb-5 bg-system-secondary-bg rounded-lg mt-3 border border-system-file-border'>
									<div className='flex items-start gap-2'>
										<img
											className='w-11 h-11 rounded-full'
											src='https://flowbite.com/docs/images/people/profile-picture-4.jpg'
											alt='Rounded avatar'
										/>

										<div className='flex-1'>
											<h4 className='font-semibold text-lg text-system-primary-accent'>Aqil Lutfi</h4>
										</div>
										<div>
											<h4 className='font-medium text-xs text-brand-gray-dim'>{relativeTime(new Date().getTime())}</h4>
										</div>
									</div>
									<div className='px-2'>
										<div className=''>
											<h4 className='text-base text-system-primary-text mb-2 mt-3'>
												Horasis Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
												incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
											</h4>
										</div>
										<div className='flex items-center justify-between gap-10'>
											<div className='flex flex-wrap items-start justify-between gap-10'>
												<div className='flex items-start gap-1 cursor-pointer'>
													<p className='text-brand-gray-dim mt-1'>likes</p>
												</div>
												<div className='flex items-start gap-1 cursor-pointer'>
													<p className='text-brand-gray-dim mt-1'>replies</p>
												</div>
											</div>
											<DropdownMenu />
										</div>
									</div>
								</div>
								<div className='p-4 pb-5 bg-system-secondary-bg rounded-lg mt-3 border border-system-file-border'>
									<div className='flex items-start gap-2'>
										<img
											className='w-11 h-11 rounded-full'
											src='https://flowbite.com/docs/images/people/profile-picture-3.jpg'
											alt='Rounded avatar'
										/>
										<div className='flex-1'>
											<h4 className='font-semibold text-lg text-system-primary-accent'>Maheshwaran Sukumar</h4>
										</div>
										<div>
											<h4 className='font-medium text-xs text-brand-gray-dim'>{relativeTime(new Date().getTime())}</h4>
										</div>
									</div>
									<div className='px-2'>
										<div className=''>
											<h4 className='text-base text-system-primary-text mb-2 mt-3'>
												Horasis Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
												incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
											</h4>
										</div>
										<div className='flex items-center justify-between gap-10'>
											<div className='flex flex-wrap items-start justify-between gap-10'>
												<div className='flex items-start gap-1 cursor-pointer'>
													<p className='text-brand-gray-dim mt-1'>likes</p>
												</div>
												<div className='flex items-start gap-1 cursor-pointer'>
													<p className='text-brand-gray-dim mt-1'>replies</p>
												</div>
											</div>
											<DropdownMenu />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default CreateDiscussion
