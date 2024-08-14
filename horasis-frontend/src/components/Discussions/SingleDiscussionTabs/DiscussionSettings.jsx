import { useContext, useEffect, useState } from 'react'
import SelectEventMembers from '../../Events/CreateEvent/SelectEventMembers'
import Button from '../../ui/Button'
import { AuthContext } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import { getNextId } from '../../../utils/URLParams'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { deleteItem, getItem, patchItem } from '../../../constants/operations'
import { useNavigate } from 'react-router-dom'
import Permissions from '../Permissions/Permissions'
import Modal from '../../ui/Modal'
import close from '../../../assets/icons/close.svg'

const DiscussionSettings = ({ discussionId, from = 'settings', discussion }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
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
		getData(`discussions/${discussionId}/members?&${jsonToQuery(filters)}`, tempMembers, setMembers)
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

	const setDefaultPermissions = (members) => {
		setGroupInvitationMembers(members.filter((member) => member.Permissions.CanInviteOthers))
		setActivityFeedsMembers(members.filter((member) => member.Permissions.CanPostActivity))
		setGroupPhotosMembers(members.filter((member) => member.Permissions.CanUploadPhoto))
		setGroupAlbumsMembers(members.filter((member) => member.Permissions.CanCreateAlbum))
		setGroupVideosMembers(members.filter((member) => member.Permissions.CanUploadVideo))
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
		if (members.length > 0) hasAnyLeft(`discussions/${discussionId}/members`, members)
	}, [members])

	useEffect(() => {
		fetch()
	}, [])

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
			`discussions/${discussionId}/member/permissions`,
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

	const viewDiscussionPage = () => navigate(`/Discussions/${discussionId}`)

	const [deleteModal, setDeleteModal] = useState(false)

	const deleteDiscussion = () => {
		deleteItem(
			`discussions/${discussionId}`,
			(result) => {
				if (result === true) {
					navigate('/Discussions')
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
					<p className='text-lg font-medium'>You are about delete the discussion</p>
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
						<Button variant='danger' onClick={deleteDiscussion}>
							Delete Discussion
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			<div className='flex flex-col gap-4'>
				{from === 'create' && (
					<div className='self-end'>
						<p className='text-system-primary-accent font-medium cursor-pointer' onClick={() => viewDiscussionPage()}>
							Skip for now
						</p>
					</div>
				)}
				{/* <div>
				<h1 className='text-system-primary-text font-medium text-lg'>Group Invitations</h1>
				<p className='text-brand-gray mt-1 mb-2 text-base'>Which members of this group are allowed to invite others?</p>
				<SelectEventMembers
					members={members}
					multiSelect={true}
					onSelect={onSelectGroupInvitationMembers}
					selectedValue={groupInvitationMembers}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
					fetchMore={fetchMore}
				/>
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>Activity Feeds</h1>
				<p className='text-brand-gray mt-1 mb-2 text-base'>
					Which members of this group are allowed to post into the activity feed?
				</p>
				<SelectEventMembers
					members={members}
					multiSelect={true}
					onSelect={onSelectActivityFeedsMembers}
					selectedValue={activityFeedsMembers}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
					fetchMore={fetchMore}
				/>
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>Group Photos</h1>
				<p className='text-brand-gray mt-1 mb-2 text-base'>Which members of this group are allowed to upload albums?</p>
				<SelectEventMembers
					members={members}
					multiSelect={true}
					onSelect={onSelectGroupPhotosMembers}
					selectedValue={groupPhotosMembers}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
					fetchMore={fetchMore}
				/>
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>Group Albums</h1>
				<p className='text-brand-gray mt-1 mb-2 text-base'>Which members of this group are allowed to create albums?</p>
				<SelectEventMembers
					members={members}
					multiSelect={true}
					onSelect={onSelectGroupAlbumsMembers}
					selectedValue={groupAlbumsMembers}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
					fetchMore={fetchMore}
				/>
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>Group Videos</h1>
				<p className='text-brand-gray mt-1 mb-2 text-base'>Which members of this group are allowed to upload videos?</p>
				<SelectEventMembers
					members={members}
					multiSelect={true}
					onSelect={onSelectGroupVideosMembers}
					selectedValue={groupVideosMembers}
					isLoadingMore={isLoadingMore}
					pageDisabled={pageDisabled}
					fetchMore={fetchMore}
				/>
			</div> */}

				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='CanInviteOthers' />
				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='CanPostActivity' />
				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='CanUploadPhoto' />
				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='CanCreateAlbum' />
				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='CanUploadVideo' />
				<Permissions from={from} discussion={discussion} discussionId={discussionId} permissionType='IsAdmin' />

				{/* <div>
				<Button variant='black' size='md' onClick={() => handleSavePermissions()}>
					Save Permissions
				</Button>
			</div> */}
				{from === 'settings' && (
					<div className='border flex flex-col p-4 rounded-md justify-between'>
						<div className='flex flex-col md:flex-row gap-2 justify-between mb-6 md:mb-0 md:items-center'>
							<div>
								<h1 className='text-system-error font-medium text-lg'>Delete the discussion</h1>
								<p className='text-brand-gray mt-1 mb-2 text-base'>
									Deleting discussion will remove all the activity and data in the discussion.
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

export default DiscussionSettings
