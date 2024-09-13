import Button from '../../../ui/Button'
import InviteMemberTab from '../../../Common/InviteMemberTab'
import { useAuth } from '../../../../utils/AuthProvider'
import { useToast } from '../../../Toast/ToastService'
import { getItem } from '../../../../constants/operations'
import { getNextId } from '../../../../utils/URLParams'
import { jsonToQuery } from '../../../../utils/searchParams/extractSearchParams'
import EmptyMembers from '../../../Common/EmptyMembers'
import { useEffect, useState } from 'react'
import Spinner from '../../../ui/Spinner'
import SearchComponent from '../../../Search/SearchBox/SearchComponent'
import InviteSpeakers from '../../InviteSpeakers'

const CreateEventStep5 = ({ changeStep, activeStep, eventId, from = 'create', IsAdmin = false }) => {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [connections, setConnections] = useState([])

	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
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
		getData(`events/${eventId}/members/invite?${jsonToQuery(filters)}`, tempConnections, setConnections)
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
		if (connections.length > 0) hasAnyLeft(`users/${currentUserData.CurrentUser.UserId}/connections`, connections)
	}, [connections])

	useEffect(() => {
		fetch()
	}, [filters])
	const [showSpeakers, setShowSpeakers] = useState(false)

	return (
		<div className='flex flex-col gap-0'>
			{/* {from === 'create' && (
				<>
					<div className='mb-4'>
						<div className='flex-1'>
							<h1 className='text-system-primary-text font-medium text-lg'>Register Speakers</h1>
							<p className='text-brand-gray mt-1 mb-2 text-base'>Add speakers for your event</p>
						</div>
					</div>
				</>
			)}
			{from === 'tab' && (
				<>
					{IsAdmin && (
						<>
							<div className='mb-4'>
								<div className='flex-1'>
									<h1 className='text-system-primary-text font-medium text-lg'>Register Speakers</h1>
									<p className='text-brand-gray mt-1 mb-2 text-base'>Add speakers for your event</p>
								</div>
							</div>
						</>
					)}
				</>
			)} */}

			{/* <div className="flex flex-row items-center gap-5 mb-4">
            <Button
                onClick={() => changeStep(activeStep - 1)}
                variant="outline"
            >
                Back
            </Button>
            <div className="flex-1">
                <h1 className="text-system-primary-text font-medium text-lg">Invite Members</h1>
                <p className="text-system-primary-text mt-1 mb-2 text-base">Invite by clicking the 'Invite'. Once done, click 'Next'</p>
            </div>
            <Button
                onClick={() => changeStep(activeStep + 1)}
                variant="black"
                className="px-16"
            >
                Next
            </Button>
        </div> */}
			{!showSpeakers ? (
				<>
					<div className='mb-2'>
						<div className='flex-1'>
							<h1 className='text-system-primary-text font-medium text-lg'>Invite Members</h1>
							<p className='text-system-primary-text mt-1 mb-2 text-base'>
								Invite by clicking the 'Invite'. Once done, click 'Done'
							</p>
						</div>
						{from === 'create' && (
							<Button onClick={() => setShowSpeakers(true)} variant='black' className='px-16'>
								Next
							</Button>
						)}
					</div>
					<SearchComponent
						searchKey={filters.Keyword}
						setSearchKey={(value) => setFilters((prev) => ({ ...prev, Keyword: value }))}
						placeholder='Search Members'
					/>
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
													{connections.map((item) => {
														return (
															<InviteMemberTab
																from='events'
																connection={item}
																key={item.DocId}
																discussionId={eventId}
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

							{isLoadingMore && (
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
										{/* <svg className="text-system-primary-accent h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg> */}
									</div>
								</div>
							)}
						</>
					)}
				</>
			) : (
				<>
					<InviteSpeakers eventId={eventId} />
				</>
			)}
		</div>
	)
}

export default CreateEventStep5
