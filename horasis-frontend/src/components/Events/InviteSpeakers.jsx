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
		getData(`users?${jsonToQuery(filters)}`, tempConnections, setConnections)
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
		if (connections.length > 0) hasAnyLeft(`users`, connections)
	}, [connections])

	useEffect(() => {
		fetch()
	}, [filters])

  const [errorObj, setErrorObj] = useState({})
	const [mailAvailable, setMailAvailable] = useState()
	const checkMailAvailability = async (value) => {
		postItem(
			`users/invite/mailCheck`,
			{
				Email: value,
				EntityType: 'Event',
				UserRole: 'Speaker',
			},
			(result) => {
				if (result === true) {
					setMailAvailable({
						available: result,
						message: 'User found  with the given mail',
					})
				} else if (result === true) {
					setMailAvailable({ available: result, message: 'No user found with the given mail' })
				}
			}
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
													<EmptyMembers emptyText={'You do not have any connections to invite.'} />
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
					<Input
						width='full'
						size='md'
						placeholder='Enter mail'
						onChange={(e) => {
							if (e.target.value.length > 3) checkMailAvailability(e.target.value)
						}}
					/>
					{mailAvailable && errorObj['Email'] === undefined && (
						<p className={mailAvailable.available ? 'text-brand-green m-0' : 'text-brand-red m-0'}>
							{mailAvailable.message} {mailAvailable.available}
						</p>
					)}
					<Button width='full' variant='black'>
						<img src={addIcon} alt='' className='h-6' />
					</Button>
				</div>
			</div>
		</>
	)
}

export default InviteSpeakers
