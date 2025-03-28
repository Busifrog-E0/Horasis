import { useEffect, useRef, useState } from 'react'
import Button from '../components/ui/Button'
import Steps from '../components/ui/Steps'
import { agendaSchema, eventSchema } from '../utils/schema/events/eventSchema'

import { useNavigate } from 'react-router-dom'
import Settings from '../components/Common/PermissionsManagement/Settings'
import CreateEventStep1 from '../components/Events/CreateEvent/CreateEventSteps/CreateEventStep1'
import CreateEventStep2 from '../components/Events/CreateEvent/CreateEventSteps/CreateEventStep2'
import CreateEventStep3 from '../components/Events/CreateEvent/CreateEventSteps/CreateEventStep3'
import CreateEventStep4 from '../components/Events/CreateEvent/CreateEventSteps/CreateEventStep4'
import CreateEventStep5 from '../components/Events/CreateEvent/CreateEventSteps/CreateEventStep5'
import UpcomingEvents from '../components/Events/UpcomingEvents'
import { useToast } from '../components/Toast/ToastService'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import { getItem, postItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'

const CreateEvent = () => {
	const { currentUserData, updateCurrentUser } = useAuth()
	const toast = useToast()
	const [activeStep, setActiveStep] = useState(1)
	const navigate = useNavigate()

	const changeStep = (step) => {
		if (step >= 1 && step <= 6) {
			setActiveStep(step)
		}
		if (step === 7) {
			navigate(`/events/${eventId}`)
		}
	}

	const steps = [
		{ title: 'Details', no: 1 },
		{ title: 'Forum', no: 2 },
		{ title: 'Photo', no: 3 },
		{ title: 'Cover', no: 4 },
		{ title: 'Invites', no: 5 },
		{ title: 'Settings', no: 6 },
	]

	const isFirstStep = activeStep === 1
	const isSecondStep = activeStep === 2
	const isThirdStep = activeStep === 3
	const isFourthStep = activeStep === 4
	const isFifthStep = activeStep === 5
	const isSixthStep = activeStep === 6

	const [errorObj, setErrorObj] = useState({})
	const [eventId, setEventId] = useState('')
	const [postEventData, setPostEventData] = useState({
		OrganiserId: currentUserData.CurrentUser.UserId,
		EventName: '',
		Description: '',
		Date: new Date().getTime(),
		StartTime: new Date().getTime(),
		EndTime: new Date().getTime(),
		Agenda: [
			{
				Name: '',
				Description: '',
				StartTime: new Date().getTime(),
				EndTime: new Date().getTime(),
			},
		],
		Privacy: 'Public',
		Type: 'Offline',
		Country: 'United States',
		HasDiscussion: true,
		Tags: [],
	})

	// useEffect(() => {
	// 	console.log(postEventData)
	// }, [postEventData])

	const [event, setEvent] = useState('')
	const getEvent = () => {
		getItem(
			`events/${eventId}`,
			(result) => {
				setEvent(result)
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	useEffect(() => {
		getEvent()
	}, [eventId])

	const [isImageUploading, setIsImageUploading] = useState(false)
	const [selectedDisplayImage, setSelectedDisplayImage] = useState(null)
	const [displayImageToUpload, setDisplayImageToUpload] = useState(null)
	const onDisplayImageSelect = (imageData) => {
		setDisplayImageToUpload({ ...imageData, Type: 'Events' })
		const tempUrl = URL.createObjectURL(new Blob([new Uint8Array(imageData.FileData)]))
		setSelectedDisplayImage(tempUrl)
	}
	const onDisplayImageDelete = () => {
		setDisplayImageToUpload(null)
		setSelectedDisplayImage(null)
	}

	const [selectedCoverImage, setSelectedCoverImage] = useState(null)
	const [coverImageToUpload, setCoverImageToUpload] = useState(null)
	const onCoverImageSelect = (imageData) => {
		setCoverImageToUpload({ ...imageData, Type: 'Events' })
		const tempUrl = URL.createObjectURL(new Blob([new Uint8Array(imageData.FileData)]))
		setSelectedCoverImage(tempUrl)
	}
	const onCoverImageDelete = () => {
		setCoverImageToUpload(null)
		setSelectedCoverImage(null)
	}

	const validate = (callback) => {
		const { error } = eventSchema.validate(postEventData, {
			abortEarly: false,
			stripUnknown: true,
		})

		let errors = {}

		if (error && error.details) {

			error.details.forEach((detail) => {
				console.log(detail)
				// Using full error path ensures agenda errors are distinguished from event errors.
				const key = detail.path.join('.')
				errors[key] = detail.message
			})
		}

		if (Object.keys(errors).length > 0) {
			console.log(errors)
			setErrorObj(errors)
		} else {
			setErrorObj({})
			if (callback) {
				callback()
			}
		}
	}

	// const validateSingle = (value, key, callback) => {
	// 	setPostEventData({ ...postEventData, ...value })
	// 	const { error, warning } = eventSchema.extract(key).validate(value[key], {
	// 		abortEarly: false,
	// 		stripUnknown: true,
	// 	})
	// 	if (error && error.details) {
	// 		let obj = {}
	// 		error.details.forEach((val) => (obj[key] = val.message))
	// 		setErrorObj(obj)
	// 	} else {
	// 		setErrorObj({})
	// 		if (callback) {
	// 			callback()
	// 		}
	// 	}
	// }

	const newValidateSingle = (value, key, index = null, callback = null) => {
		let schema

		// Determine which schema to use based on whether the field is in the main event or an agenda item
		if (index !== null) {
			schema = agendaSchema
		} else {
			schema = eventSchema
		}

		if (schema) {
			const { error } = schema.extract(key).validate(value[key], {
				abortEarly: false,
				stripUnknown: true,
			})

			let newErrors = { ...errorObj } // Start with current errors

			if (error && error.details) {
				// Handle validation errors for the single field
				error.details.forEach((val) => {
					if (index !== null) {
						newErrors[`Agenda.${index}.${key}`] = val.message
					} else {
						newErrors[key] = val.message
					}
				})
			} else {
				// Clear errors for the valid field
				if (index !== null) {
					delete newErrors[`Agenda.${index}.${key}`]
				} else {
					delete newErrors[key]
				}
			}

			// Update the error state
			setErrorObj(newErrors)

			// Update the form state with the validated value
			setPostEventData((prevData) => ({
				...prevData,
				...(index !== null
					? {
							Agenda: prevData.Agenda.map((item, i) => (i === index ? { ...item, ...value } : item)),
					  }
					: { ...prevData, ...value }),
			}))

			// Call the callback function if provided
			if (callback) {
				callback()
			}
		}
	}
	const step3Ref = useRef(null)
	const handleStepThreeCrop = async () => {
		if (step3Ref.current && step3Ref.current.handleCropSave) {
			const imageToUpload = await step3Ref.current.handleCropSave()
			return imageToUpload
		}
	}
	const step4Ref = useRef(null)
	const handleStepFourCrop = async () => {
		if (step4Ref.current && step4Ref.current.handleCropSave) {
			const imageToUpload = await step4Ref.current.handleCropSave()
			return imageToUpload
		}
	}

	const [isModalOpen, setIsModalOpen] = useState(false)
	const postEvent = async () => {
		setIsModalOpen(false)
		const imageToUpload = await handleStepFourCrop()
		onCoverImagesUpload(imageToUpload)
	}

	const onImageSet = (coverImageUrl, displayImageUrl) => {
		setIsImageUploading(true)
		postItem(
			'events',
			{ ...postEventData, CoverPicture: coverImageUrl, DisplayPicture: displayImageUrl },
			(result) => {
				if (result) {
					setIsModalOpen(false)
					changeStep(activeStep + 1)
					setEventId(result)
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

	const onDisplayImageUpload = (coverImageUrl) => {
		if (displayImageToUpload) {
			setIsImageUploading(true)
			postItem(
				'files/users',
				displayImageToUpload,
				(result) => {
					onImageSet(coverImageUrl, result.FileUrl)
				},
				(err) => {
					setIsImageUploading(false)
				},
				updateCurrentUser,
				currentUserData,
				toast
			)
		}
	}

	const onCoverImagesUpload = (imageToUpload) => {
		if (imageToUpload) {
			setIsImageUploading(true)
			postItem(
				'files/users',
				imageToUpload,
				(result) => {
					onDisplayImageUpload(result.FileUrl)
				},
				(err) => {
					setIsImageUploading(false)
				},
				updateCurrentUser,
				currentUserData,
				toast
			)
		} else if (coverImageToUpload) {
			setIsImageUploading(true)
			postItem(
				'files/users',
				coverImageToUpload,
				(result) => {
					onDisplayImageUpload(result.FileUrl)
				},
				(err) => {
					setIsImageUploading(false)
				},
				updateCurrentUser,
				currentUserData,
				toast
			)
		}
	}

	return (
		<>
			<Modal isOpen={isModalOpen}>
				<Modal.Header>
					<p className='font-medium text-lg'>Confirm event creation ?</p>
				</Modal.Header>
				<Modal.Body>
					<div className='flex items-center gap-2 justify-end'>
						<Button variant='outline' size='md' onClick={() => setIsModalOpen(false)}>
							Cancel
						</Button>
						<Button variant='black' size='md' onClick={() => postEvent()}>
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
				<h4 className='font-medium text-2xl text-system-primary-accent mt-5 mb-4'>Create an Event</h4>
				<div className='p-6 bg-system-secondary-bg rounded-lg relative overflow-hidden'>
					{isImageUploading && (
						<div className='absolute top-0 left-0 bg-system-secondary-bg-transparent w-full h-full flex items-center justify-center'>
							<Spinner />
						</div>
					)}
					{activeStep === 1 && (
						<CreateEventStep1
							postEventData={postEventData}
							setPostEventData={setPostEventData}
							validateSingle={newValidateSingle}
							errorObj={errorObj}
						/>
					)}
					{activeStep === 2 && (
						<CreateEventStep2
							errorObj={errorObj}
							postEventData={postEventData}
							setPostEventData={setPostEventData}
							validateSingle={newValidateSingle}
						/>
					)}
					{activeStep === 3 && (
						<CreateEventStep3
							ref={step3Ref}
							selectedImage={selectedDisplayImage}
							onImageSelect={onDisplayImageSelect}
							fileFieldName='DisplayPicture'
						/>
					)}
					{activeStep === 4 && (
						<CreateEventStep4
							ref={step4Ref}
							selectedImage={selectedCoverImage}
							onImageSelect={onCoverImageSelect}
							fileFieldName='CoverPicture'
						/>
					)}
					{activeStep === 5 && (
						<CreateEventStep5 changeStep={changeStep} activeStep={activeStep} eventId={eventId} event={event} />
					)}
					{activeStep === 6 && (
						<Settings
							from='create'
							EntityId={eventId}
							Entity={event}
							permissionsToShow={{
								Invitation: true,
								Activity: event?.HasDiscussion,
								Photo: event?.HasDiscussion,
								Video: event?.HasDiscussion,
								Album: event?.HasDiscussion,
								Admin: true,
							}}
							Type='Event'
						/>
					)}
					{/* {activeStep !== 6 && */}
					<div className='grid grid-cols-2 lg:grid-cols-3 gap-4 py-8'>
						<div className='hidden lg:block'></div>
						<div className='col-span-1'>
							{!isFirstStep && !isFifthStep && (
								<Button onClick={() => changeStep(activeStep - 1)} variant='outline' width='full'>
									Back
								</Button>
							)}
						</div>
						<div className='col-span-1'>
							{isSixthStep && (
								<Button width='full' variant='black' onClick={() => changeStep(activeStep + 1)}>
									Done
								</Button>
							)}
							{isFourthStep && (
								<Button
									onClick={() => setIsModalOpen(true)}
									width='full'
									variant='black'
									// disabled={!selectedCoverImage || !selectedDisplayImage}
								>
									Create Event
								</Button>
							)}
							{(isFirstStep || isSecondStep) && (
								<Button onClick={() => validate(() => changeStep(activeStep + 1))} width='full' variant='black'>
									Next
								</Button>
							)}
							{isThirdStep && (
								<Button
									onClick={() =>
										validate(() => {
											handleStepThreeCrop()
											changeStep(activeStep + 1)
										})
									}
									width='full'
									variant='black'
									// disabled={!selectedDisplayImage}
								>
									Next
								</Button>
							)}
							{isFifthStep && (
								<Button onClick={() => changeStep(activeStep + 1)} width='full' variant='black'>
									Next
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
			<div>
				<UpcomingEvents />
			</div>
		</>
	)
}

export default CreateEvent
