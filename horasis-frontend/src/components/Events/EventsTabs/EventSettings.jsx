import { useEffect, useState } from 'react'
import { useAuth } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { useNavigate } from 'react-router-dom'
import { deleteItem, getItem } from '../../../constants/operations'
import Modal from '../../ui/Modal'
import close from '../../../assets/icons/close.svg'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import Button from '../../ui/Button'
import Permissions from '../Permissions/Permissions'

const EventSettings = ({ eventId, from = 'settings', event }) => {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [members, setMembers] = useState([])
	const navigate = useNavigate()

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
	const getAllMembers = (tempMembers) => {
		getData(`events/${eventId}/members?&${jsonToQuery(filters)}`, tempMembers, setMembers)
	}

	const getData = (endpoint, tempData, setData) => {
		setLoadingCom(tempData, true)
		getItem(
			`${endpoint}&NextId=${getNextId(tempData)}`,
			(data) => {
				const updatedMembers = [...tempData, ...data]
				setData(updatedMembers)
				setDefaultPermissions(updatedMembers)
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
		getAllMembers(initialRender ? [] : members)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (members.length > 0) hasAnyLeft(`events/${eventId}/members`, members)
	}, [members])

	useEffect(() => {
		fetch()
	}, [])

	const setDefaultPermissions = (members) => {
		setGroupInvitationMembers(members.filter((member) => member.Permissions.CanInviteOthers))
		setActivityFeedsMembers(members.filter((member) => member.Permissions.CanPostActivity))
		setGroupPhotosMembers(members.filter((member) => member.Permissions.CanUploadPhoto))
		setGroupAlbumsMembers(members.filter((member) => member.Permissions.CanCreateAlbum))
		setGroupVideosMembers(members.filter((member) => member.Permissions.CanUploadVideo))
	}

	const [groupInvitationMembers, setGroupInvitationMembers] = useState([])
	const onSelectGroupInvitationMembers = (value) => {
		setGroupInvitationMembers(value)
	}
	const [activityFeedsMembers, setActivityFeedsMembers] = useState([])
	const onSelectActivityFeedsMembers = (value) => {
		setActivityFeedsMembers(value)
	}
	const [groupPhotosMembers, setGroupPhotosMembers] = useState([])
	const onSelectGroupPhotosMembers = (value) => {
		setGroupPhotosMembers(value)
	}
	const [groupAlbumsMembers, setGroupAlbumsMembers] = useState([])
	const onSelectGroupAlbumsMembers = (value) => {
		setGroupAlbumsMembers(value)
	}
	const [groupVideosMembers, setGroupVideosMembers] = useState([])
	const onSelectGroupVideosMembers = (value) => {
		setGroupVideosMembers(value)
	}

	const extractUserIdsByPermission = (selectedMembers) => {
		return {
			CanInviteOthers: selectedMembers.groupInvitationMembers.map((member) => member.DocId),
			CanPostActivity: selectedMembers.activityFeedsMembers.map((member) => member.DocId),
			CanUploadPhoto: selectedMembers.groupPhotosMembers.map((member) => member.DocId),
			CanCreateAlbum: selectedMembers.groupAlbumsMembers.map((member) => member.DocId),
			CanUploadVideo: selectedMembers.groupVideosMembers.map((member) => member.DocId),
		}
	}

	const handleSavePermissions = () => {
		const selectedMembers = {
			groupInvitationMembers,
			activityFeedsMembers,
			groupPhotosMembers,
			groupAlbumsMembers,
			groupVideosMembers,
		}

		const userIdsByPermission = extractUserIdsByPermission(selectedMembers)

		console.log(userIdsByPermission)
		patchSavePermissions(userIdsByPermission)
		// You can now use `userIdsByPermission` to save the permissions as needed
	}

	const patchSavePermissions = (patchData) => {
		patchItem(
			`events/${eventId}/member/permissions`,
			patchData,
			(result) => {
				console.log(result)
			},
			(err) => {
				console.log(result)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const viewEventPage = () => navigate(`/Events/${eventId}`)

	const [deleteModal, setDeleteModal] = useState(false)
	const deleteEvent = () => {
		deleteItem(
			`events/${eventId}`,
			(result) => {
				if (result === true) {
					navigate('/Events')
				}
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	return (
		<>
			<Modal isOpen={deleteModal}>
				<Modal.Header>
					<p className='text-lg font-medium'>You are about delete the event</p>
					<button
						onClick={() => {
							setDeleteModal(false)
						}}>
						<img src={close} className='h-6  cursor-pointer' alt='' />
					</button>
				</Modal.Header>
				<Modal.Body>
					<div className='flex items-center justify-end gap-2'>
						<Button variant='outline' onClick={() => setDeleteModal(false)}>
							Cancel
						</Button>
						<Button variant='danger' onClick={deleteEvent}>
							Delete Event
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			<div className='flex flex-col gap-4'>
				{from === 'create' && (
					<div className='self-end'>
						<p className='text-system-primary-accent font-medium cursor-pointer' onClick={() => viewEventPage()}>
							Skip for now
						</p>
					</div>
				)}
				<Permissions from={from} event={event} eventId={eventId} permissionType='CanInviteOthers' />
				{event.HasDiscussion && (
					<>
						<Permissions from={from} event={event} eventId={eventId} permissionType='CanPostActivity' />
						<Permissions from={from} event={event} eventId={eventId} permissionType='CanUploadPhoto' />
						<Permissions from={from} event={event} eventId={eventId} permissionType='CanCreateAlbum' />
						<Permissions from={from} event={event} eventId={eventId} permissionType='CanUploadVideo' />
					</>
				)}
				<Permissions from={from} event={event} eventId={eventId} permissionType='IsAdmin' />

				{from === 'settings' && (
					<div className='border flex flex-col p-4 rounded-md justify-between'>
						<div className='flex flex-col md:flex-row gap-2 justify-between mb-6 md:mb-0 md:items-center'>
							<div>
								<h1 className='text-system-error font-medium text-lg'>Delete the event</h1>
								<p className='text-brand-gray mt-1 mb-2 text-base'>
									Deleting event will remove all the activity and data in the event.
								</p>
							</div>
							<div className='flex gap-4 items-start'>
								<Button variant='danger_outlined' size='md' onClick={() => setDeleteModal(true)}>
									Delete
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default EventSettings
