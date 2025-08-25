import { useState } from 'react'
import close from '../../../assets/icons/close.svg'
import useGetList from '../../../hooks/useGetList'
import EmptyMembers from '../../Common/EmptyMembers'
import MembersSection from '../../Connections/MembersSection'
import Modal from '../../ui/Modal'
import Spinner from '../../ui/Spinner'

const ViewLikedMembers = ({ entity, timeSize = 'text-md' }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const {
		data: likedUsers,
		isLoading,
		isLoadingMore,
		isPageDisabled,
		getList: getLikedUsers,
	} = useGetList(`likes/${entity.DocId}`, {}, true, false, false, [])

	const openModal = (e) => {
		e.stopPropagation()
		setIsModalOpen(true)
		getLikedUsers([])
	}

	return (
		<>
			<Modal isOpen={isModalOpen} maxWidth={`max-w-4xl`}>
				<Modal.Header>
					<p className='text-lg font-medium'>Liked Members</p>
					<button onClick={() => setIsModalOpen(false)}>
						<img src={close} className='h-6  cursor-pointer' alt='' />
					</button>
				</Modal.Header>
				<Modal.Body>
					<div className='flex flex-col gap-4'>
						{isLoading ? (
							<div className='w-full lg:w-full h-24 rounded-md flex items-center justify-center  '>
								<Spinner />
							</div>
						) : likedUsers.length > 0 ? (
							<MembersSection
								members={likedUsers.map((d) => ({ ...d.UserDetails, CreatedIndex: d.CreatedIndex }))}
								emptyText={'No members '}
								updateList={() => {}}
								whichTime='member'
								fetchMore={() => getLikedUsers(likedUsers, false)}
								isLoadingMore={isLoadingMore}
								pageDisabled={isPageDisabled}
								tabName='members'
							/>
						) : (
							<EmptyMembers emptyText={'No likes received.'} />
						)}
					</div>
				</Modal.Body>
			</Modal>
			<p className={`${timeSize} text-brand-gray-dim mt-1 cursor-pointer hover:underline `} onClick={openModal}>
				{entity.NoOfLikes} {entity.NoOfLikes === 1 ? 'like' : 'likes'}
			</p>
		</>
	)
}

export default ViewLikedMembers
