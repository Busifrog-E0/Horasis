import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/icons/avatar.svg'
import { relativeTime } from '../../utils/date'
import UserDropDown from '../ui/UserDropDown'
import { AuthContext } from '../../utils/AuthProvider'
import Spinner from '../ui/Spinner'

const MembersSectionTab = ({ lastElement, profile, updateList, whichTime, updatingId,tabName }) => {
	const { currentUserData } = useContext(AuthContext)
	const navigate = useNavigate()
	const goToProfile = () => {
		if (profile) {
			if (profile.DocId === currentUserData.CurrentUser.UserId) {
				navigate(`/MyProfile`)
			} else {
				navigate(`/ViewProfile/${profile.DocId}`)
			}
		}
	}

	const whichTimeAgo = {
		member: 'CreatedIndex',
		followed: 'FollowedIndex',
		following: 'FollowingIndex',
		connection: 'ConnectionIndex',
	}

	return (
		<>
			<div
				className={`bg-system-secondary-bg ${lastElement === true ? '' : 'border-b border-system-file-border pb-2'}`}>
				<div className='flex items-start gap-4'>
					{profile ? (
						<>
							{profile.ProfilePicture ? (
								<div className='w-11 h-11 rounded-full bg-black'>
									<img
										className='w-11 h-11 rounded-full object-cover'
										src={profile.ProfilePicture}
										alt='Rounded avatar'
									/>
								</div>
							) : (
								<>
									<div className='w-11 h-11 rounded-full bg-brand-light-gray'>
										<img src={avatar} className='object-cover h-full w-full rounded-lg' />
									</div>
								</>
							)}
						</>
					) : (
						<>
							<img
								className='w-11 h-11 rounded-full'
								src='https://flowbite.com/docs/images/people/profile-picture-1.jpg'
								alt='Rounded avatar'
							/>
						</>
					)}

					<div className='flex-1'>
						<h4 className='font-semibold text-lg text-system-primary-accent cursor-pointer' onClick={goToProfile}>
							{profile && profile.FullName}
						</h4>
						<h4 className='font-semibold text-sm text-brand-gray-dim'>@{profile && profile.Username}</h4>
					</div>
					<div className='flex flex-col items-end'>
						<h4 className='font-medium text-base text-brand-gray-dim mb-3'>
							{relativeTime(profile[whichTimeAgo[whichTime]])}
						</h4>
						{updatingId === profile.DocId ? (
							<Spinner />
						) : (
							<UserDropDown memberProfile={profile} updateList={updateList}  tabName={tabName} />
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default MembersSectionTab
