import React, { useEffect, useState } from 'react'
import Spinner from '../ui/Spinner'
import EmptyMembers from '../Common/EmptyMembers'
import SearchComponent from '../Search/SearchBox/SearchComponent'
import InviteSpeakersTab from './InviteSpeakersTab'
import { useAuth } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { getItem, postItem } from '../../constants/operations'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import Input from '../ui/Input'
import Button from '../ui/Button'
import addIcon from '../../assets/icons/add-icon.svg'
import deleteIcon from '../../assets/icons/delete-white.svg'
import Joi from 'joi'
import Select from '../ui/Select'
import TextArea from '../ui/TextArea'

const InviteSpeakers = ({ eventId, event }) => {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [connections, setConnections] = useState([])
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 2,
		Keyword: '',
	})
	const [emailInvitationData, setEmailInvitationData] = useState([])
	const [errors, setErrors] = useState([])
	const [registerSpeakers, setRegisterSpeakers] = useState('No')
	const [isInviting, setIsInviting] = useState(false)

	const agendaList = event.Agenda

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getData = (endpoint, tempData, setData) => {
		setLoadingCom(tempData, true)
		getItem(
			`${endpoint}&NextId=${getNextId(tempData)}`,
			(data) => {
				setData([...tempData, ...data])
				setLoadingCom(tempData, false)
			},
			(err) => {
				setLoadingCom(tempData, false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const getConnections = (tempConnections) => {
		getData(`events/${eventId}/speakers/invite?${jsonToQuery(filters)}`, tempConnections, setConnections)
	}

	const hasAnyLeft = (endpoint, tempData) => {
		getItem(
			`${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...filters, Limit: 1 })}`,
			(data) => {
				if (data?.length > 0) {
					setPageDisabled(false)
				} else {
					setPageDisabled(true)
				}
			},
			(err) => {
				setPageDisabled(true)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const fetchData = (initialRender = false) => {
		getConnections(initialRender ? [] : connections)
	}

	useEffect(() => {
		if (connections.length > 0) hasAnyLeft(`events/${eventId}/speakers/invite`, connections)
	}, [connections])

	useEffect(() => {
		fetchData(true)
	}, [filters])

	const emailSchema = Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			'string.empty': 'Email cannot be empty',
			'string.email': 'Please enter a valid email address',
			'any.required': 'Email is required',
		})
	const fullNameSchema = Joi.string().required().messages({
		'string.empty': 'Full Name cannot be empty',
		'any.required': 'Full Name is required',
	})
	const aboutSchema = Joi.string().required().messages({
		'string.empty': 'About cannot be empty',
		'any.required': 'About  is required',
	})

	const handleEmailChange = (index, event) => {
		const newInvitationData = [...emailInvitationData]
		const newErrors = [...errors]

		newInvitationData[index].Email = event.target.value

		// Validate the email
		const { error } = emailSchema.validate(newInvitationData[index].Email)
		newErrors[index] = error ? error.message : ''

		setEmailInvitationData(newInvitationData)
		setErrors(newErrors)
	}

	const handleFullnameChange = (index, event) => {
		const newInvitationData = [...emailInvitationData]
		const newErrors = [...errors]

		newInvitationData[index].FullName = event.target.value

		// Validate the email
		const { error } = fullNameSchema.validate(newInvitationData[index].FullName)
		newErrors[index] = error ? error.message : ''

		setEmailInvitationData(newInvitationData)
		setErrors(newErrors)
	}

	const handleAbooutChange = (index, event) => {
		const newInvitationData = [...emailInvitationData]
		const newErrors = [...errors]

		newInvitationData[index].About = event.target.value

		// Validate the email
		const { error } = aboutSchema.validate(newInvitationData[index].About)
		newErrors[index] = error ? error.message : ''

		setEmailInvitationData(newInvitationData)
		setErrors(newErrors)
	}

	const handleAgendaChange = (index, selectedOption) => {
		const newInvitationData = [...emailInvitationData]
		newInvitationData[index].Agenda = selectedOption ? agendaList.find((agenda) => selectedOption === agenda.Name) : ''
		setEmailInvitationData(newInvitationData)
	}

	const addEmailField = () => {
		if (emailInvitationData.length < 5) {
			setEmailInvitationData([...emailInvitationData, { Email: '', Agenda: '', FullName: '', About: '' }])
		}
	}

	const removeEmailField = (index) => {
		const newInvitationData = [...emailInvitationData]
		const newErrors = [...errors]

		newInvitationData.splice(index, 1)
		newErrors.splice(index, 1)

		setEmailInvitationData(newInvitationData)
		setErrors(newErrors)
	}

	const isSubmitDisabled = emailInvitationData.length === 0 || errors.some((error) => error !== '')

	const postInviteByEmail = () => {
		const postEmailData = {
			EntityId: eventId,
			ActionType: 'Event-Invite-Speaker',
			InvitationData: emailInvitationData,
		}

		setIsInviting(true)
		postItem(
			`events/${event.DocId}/speakers/invite/email`,
			{ InvitationData: emailInvitationData },
			(result) => {
				setEmailInvitationData([])
				setIsInviting(false)
			},
			(err) => {
				setIsInviting(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	return (
		<div className='flex flex-col gap-0'>
			<div className='mb-4'>
				<div className='flex-1'>
					<h1 className='text-system-primary-text font-medium text-lg'>Register Speakers</h1>
					<p className='text-brand-gray mt-1 mb-2 text-base'>Add speakers for your event</p>
				</div>
			</div>
			<div className={`${registerSpeakers !== 'Yes' && 'mb-16'}`}>
				<Select
					className='py-3 rounded-xl border-2 border-system-file-border-accent'
					width='full'
					setValue={(item) => setRegisterSpeakers(item)}
					value={registerSpeakers}
					options={['Yes', 'No']}
				/>
			</div>
			{registerSpeakers === 'Yes' && (
				<>
					<div className='flex flex-col border-b pb-4'>
						<p className='py-2 text-base text-system-secondary-text'>Invite speakers by searching profiles</p>
						<SearchComponent
							searchKey={filters.Keyword}
							setSearchKey={(value) => setFilters((prev) => ({ ...prev, Keyword: value }))}
							placeholder='Search Speakers'
						/>
						{filters.Keyword && (
							<>
								{isLoading ? (
									<div className='bg-system-secondary-bg p-4 rounded-b-lg'>
										<Spinner />
									</div>
								) : (
									<>
										{connections.length > 0 ? (
											connections.map((item, index) => {
												const lastItem = connections.length - 1 === index
												return (
													<InviteSpeakersTab
														connection={item}
														key={item.DocId}
														eventId={eventId}
														from='events'
														lastItem={lastItem}
														agendaList={agendaList}
													/>
												)
											})
										) : (
											<EmptyMembers emptyText='No users found.' />
										)}
									</>
								)}
							</>
						)}
					</div>
					<div className='flex flex-col'>
						<p className='py-2 text-base text-system-secondary-text'>Invite by sending mail</p>
					</div>
					<div className='flex flex-col gap-4'>
						{emailInvitationData.map((invitation, index) => (
							<div key={index} className='flex flex-col w-full'>
								<div className='grid grid-cols-1 md:grid-cols-2 w-full gap-2 items-center '>
									<Input
										className='py-3 rounded-xl border-2 border-system-secondary-accent'
										width='full'
										placeholder='Enter email'
										value={invitation.Email}
										onChange={(e) => handleEmailChange(index, e)}
									/>
									<Input
										className='py-3 rounded-xl border-2 border-system-secondary-accent'
										width='full'
										placeholder='Enter Fullname'
										value={invitation.FullName}
										onChange={(e) => handleFullnameChange(index, e)}
									/>
									<div className='col-span-2'>
										<TextArea
											className='py-3 rounded-xl  border-2 border-system-secondary-accent'
											width='full'
											placeholder='About Speaker'
											value={invitation.About}
											onChange={(e) => handleAbooutChange(index, e)}
										/>
									</div>
									<Select
										className='py-3 rounded-xl border-2 border-system-secondary-accent'
										width='full'
										placeholder='Select agenda'
										value={agendaList.find((option) => option.Name === invitation.Agenda.Name)?.Name}
										options={agendaList.map((item) => item.Name)}
										setValue={(selectedOption) => handleAgendaChange(index, selectedOption)}
									/>
									<Button
										className='flex items-center justify-center gap-2'
										width='full'
										variant='danger'
										size='md'
										onClick={() => removeEmailField(index)}>
										<p className='text-system-primary-bg'>Remove Speaker</p>
										<img src={deleteIcon} alt='Delete' className='h-6 cursor-pointer' />
									</Button>
								</div>
								{errors[index] && <div style={{ color: 'red', marginTop: '5px' }}>{errors[index]}</div>}
							</div>
						))}

						{emailInvitationData.length < 5 && (
							<Button width='full' size='md' variant='black' onClick={addEmailField}>
								<img src={addIcon} alt='Add' className='h-6' />
							</Button>
						)}
						<Button
							width='full'
							size='md'
							variant='black'
							disabled={isSubmitDisabled || isInviting}
							onClick={postInviteByEmail}>
							{isInviting ? 'Sending emails...' : 'Send email to speakers'}
						</Button>
					</div>
				</>
			)}
		</div>
	)
}

export default InviteSpeakers
