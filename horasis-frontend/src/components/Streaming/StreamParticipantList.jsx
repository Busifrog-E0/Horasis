import { useState } from 'react'
import avatar from '../../assets/icons/avatar.svg'
const StreamParticipantList = ({ participants }) => {
	const [activeTab, setActiveTab] = useState('participants')
	console.log(participants)
	return (
		<div className='flex flex-col h-full overflow-hidden p-6 bg-system-primary-accent-dim shadow-lg rounded-lg'>
			<div className='flex gap-2'>
				<p className={`text-gray-100 cursor-pointer text-center flex-1 ${activeTab === 'participants' && 'bg-system-primary-accent-transparent'} p-4 rounded-md`} onClick={() => setActiveTab('participants')}>
					Participants{' '}
				</p>
				<p className={`text-gray-100 cursor-pointer text-center flex-1 ${activeTab === 'messages' && 'bg-system-primary-accent-transparent'} p-4 rounded-md`} onClick={() => setActiveTab('messages')}>
					Messages{' '}
				</p>
			</div>
			<hr className='my-4 border-t border-system-secondary-bg-transparent' />
			{activeTab === 'participants' && (
				<div className='overflow-auto flex-1 flex-grow-1 w-full'>
					<div className=' grid grid-cols-3 bg-[#D6D3E3] text-brand-primary p-5 rounded-lg gap-6 '>
						<div className='flex flex-col items-center justify-center'>
							<img src={avatar} alt='' className='h-20 rounded-full overflow-hidden w-20 object-cover' />
							<p className='text-center truncate'>{'You'}</p>
						</div>
						{participants.length > 0 &&
							participants.map((user) => (
								<div key={user.uid} className='flex flex-col items-center'>
									<img src={user.UserDetails.CoverPicture ? user.UserDetails.CoverPicture : avatar} alt='' className='h-20 rounded-full overflow-hidden w-20 object-cover' />
									<p className='text-center truncate'>{user.UserDetails.FullName}</p>
								</div>
							))}
					</div>
				</div>
			)}
			{activeTab === 'messages' && <div>messages section</div>}
		</div>
	)
}

export default StreamParticipantList
