import { useNavigate } from 'react-router-dom'
import avatar from '../../../assets/icons/avatar.svg'
import Spinner from '../../ui/Spinner'

const UserDetailsTab = ({ user, isLoading, viewAsFlex = false }) => {
	const navigate = useNavigate()
	return (
		<div
			className={`px-3 ${viewAsFlex && 'flex gap-2 items-end cursor-pointer'}`}
			onClick={() => navigate(`/ViewProfile/${user.DocId}`)}>
			<div className='flex justify-start items-center'>
				{user ? (
					<>
						{user.ProfilePicture ? (
							<>
								<div className='w-10 h-10 rounded-full flex items-center justify-center bg-black'>
									<img
										className='w-10 h-10 rounded-full object-cover'
										src={user.ProfilePicture}
										alt='Rounded avatar'
										onClick={() => {}}
									/>
								</div>
							</>
						) : (
							<>
								<div
									className='w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed bg-brand-light-gray'
									onClick={() => {}}>
									<img src={avatar} className='object-cover h-full w-full rounded-lg' />
								</div>
							</>
						)}
					</>
				) : (
					<>
						<div className='w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed bg-slate-100'>
							{isLoading ? <Spinner /> : <></>}
						</div>
					</>
				)}
			</div>
			<div>
				<h4 className='font-medium text-base text-system-primary-text mt-2'>{user && user.FullName}</h4>
				<h4 className='font-medium text-sm text-brand-gray-dim'>@{user && user.Username}</h4>
			</div>
		</div>
	)
}
export default UserDetailsTab
