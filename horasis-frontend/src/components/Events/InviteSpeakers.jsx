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
import deleteIcon from '../../assets/icons/delete.svg'
import Joi from 'joi'
import Select from '../ui/Select'

const InviteSpeakers = ({ eventId }) => {
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

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (connections.length > 0) hasAnyLeft(`events/${eventId}/speakers/invite`, connections)
	}, [connections])

	useEffect(() => {
		fetch()
	}, [filters])

	const [emails, setEmails] = useState([])
	const [errors, setErrors] = useState([])
	const emailSchema = Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			'string.empty': 'Email cannot be empty',
			'string.email': 'Please enter a valid email address',
			'any.required': 'Email is required',
		})

	const handleEmailChange = (index, event) => {
		const newEmails = [...emails]
		const newErrors = [...errors]

		newEmails[index] = event.target.value

		// Validate the email
		const { error } = emailSchema.validate(newEmails[index])
		newErrors[index] = error ? error.message : ''

		setEmails(newEmails)
		setErrors(newErrors)
	}
	const addEmailField = () => {
		if (emails.length < 5) {
			setEmails([...emails, '']) // Add a new empty string to the array
		}
	}

	const removeEmailField = (index) => {
		const newEmails = [...emails]
		const newErrors = [...errors]

		newEmails.splice(index, 1) // Remove the email at the specific index
		newErrors.splice(index, 1) // Remove the error at the specific index

		setEmails(newEmails)
		setErrors(newErrors)
	}

	const isSubmitDisabled = emails.length === 0 || errors.some((error) => error !== '')
	const [registerSpeakers, setRegisterSpeakers] = useState('No')
	const [isInviting, setIsInviting] = useState(false)

	const postInviteByEmail = () => {
		const postEmailData = {
			EntityId: eventId,
			ActionType: 'Event-Invite-Speaker',
			EmailIds: emails,
		}
		setIsInviting(true)
		postItem(
			`users/invite`,
			postEmailData,
			(result) => {
				setEmails([])
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
		<>
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
										<>
											<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
												<Spinner />
											</div>
										</>
									) : (
										<>
											{connections ? (
												<>
													{connections.length > 0 ? (
														<>
															{isLoading ? (
																<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
																	<Spinner />
																</div>
															) : (
																<>
																	{connections.map((item, index) => {
																		const lastItem = connections.length - 1 === index
																		return (
																			<InviteSpeakersTab
																				connection={item}
																				key={item.DocId}
																				eventId={eventId}
																				from='events'
																				lastItem={lastItem}
																			/>
																		)
																	})}
																</>
															)}
														</>
													) : (
														<>
															<EmptyMembers emptyText={'No users found.'} />
														</>
													)}
												</>
											) : (
												<></>
											)}

											{/* {isLoadingMore && (
									<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
										<Spinner />
									</div>
								)}

								{!pageDisabled && (
									<div
										onClick={() => {
											fetchMore()
										}}
										className='flex flex-row justify-end mt-4 mb-2'>
										<div className='cursor-pointer flex items-center gap-2'>
											<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
										</div>
									</div>
								)} */}
										</>
									)}
								</>
							)}
						</div>
						<div className='flex flex-col'>
							<p className='py-2 text-base text-system-secondary-text'>Invite by sending mail</p>
						</div>
						<div className='flex flex-col gap-4'>
							{emails.map((email, index) => {
								return (
									<div key={index} className='flex flex-col w-full'>
										<div className='flex items-center gap-2 w-full'>
											<Input
												className='py-3 rounded-xl border-2 border-system-secondary-accent'
												width='full'
												placeholder='Enter mail'
												value={email}
												onChange={(e) => handleEmailChange(index, e)}
											/>
											<img
												src={deleteIcon}
												alt=''
												className='h-6 cursor-pointer'
												onClick={() => removeEmailField(index)}
											/>
										</div>
										{errors[index] && <div style={{ color: 'red', marginTop: '5px' }}>{errors[index]}</div>}
									</div>
								)
							})}

							{emails.length < 5 && (
								<Button width='full' size='md' variant='black' onClick={addEmailField}>
									<img src={addIcon} alt='' className='h-6' />
								</Button>
							)}
							<Button
								width='full'
								size='md'
								variant='black'
								disabled={isSubmitDisabled || isInviting}
								onClick={postInviteByEmail}>
								{isInviting?'Sending emails...':'Send email to speakers'}
							</Button>
						</div>
					</>
				)}
			</div>
		</>
	)
}

export default InviteSpeakers
