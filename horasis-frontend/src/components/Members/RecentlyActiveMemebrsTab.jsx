import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/icons/avatar.svg'
import useGetList from '../../hooks/useGetList'
import { useAuth } from '../../utils/AuthProvider'
import Spinner from '../ui/Spinner'

const RecentlyActiveMemebrsTab = () => {
	const navigate = useNavigate()
	const { currentUserData } = useAuth()
	const { isLoading, data: members } = useGetList('users', { OrderBy: ['Online', 'LastActive'] },false)

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<div className='pr-16'>
					<div className='flex items-center flex-wrap gap-3'>
						{members.map((member, index) => {
							if (member.DocId === currentUserData.CurrentUser.UserId) return
							return (
								<div
									className='cursor-pointer relative'
									onClick={() => navigate(`/ViewProfile/${member.DocId}`)}
									key={member.DocId}>
									{member.Online && <div className='bg-system-success h-3 w-3 rounded-md absolute top-0 right-0'></div>}
									{member?.ProfilePicture ? (
										<>
											<img
												className='w-12 h-12 rounded-full object-cover'
												src={member?.ProfilePicture}
												alt='Rounded avatar'
											/>
										</>
									) : (
										<>
											<img className='w-12 h-12 rounded-full object-cover' src={avatar} alt='Rounded avatar' />
										</>
									)}
								</div>
							)
						})}
					</div>
				</div>
			)}
		</>
	)
}

export default RecentlyActiveMemebrsTab
