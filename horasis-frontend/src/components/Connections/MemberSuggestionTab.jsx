import { useContext, useState } from 'react'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/icons/avatar.svg'
import { deleteItem, postItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { useFollow } from '../../context/Follow/FollowService'
import Spinner from '../ui/Spinner'

const MemberSuggestionTab = ({ lastElement, profile, updateList }) => {
	const navigate = useNavigate()
	const goToProfile = () => {
		if (profile) {
			navigate(`/ViewProfile/${profile.DocId}`)
		}
	}

	const { followUser, unFollowUser } = useFollow()
	const [loading, setLoading] = useState(false)
	// if (loading) return <Spinner />

	return (
		<>
			<div className={`${lastElement === true ? '' : 'border-b border-system-file-border pb-3'}`}>
				<div className='flex items-start gap-4'>
					{profile.ProfilePicture ? (
						<div className='w-11 h-11 rounded-full bg-black'>
							<img className='w-11 h-11 rounded-full object-cover' src={profile.ProfilePicture} alt='Rounded avatar' />
						</div>
					) : (
						<>
							<div className='w-11 h-11 rounded-full bg-brand-light-gray'>
								<img src={avatar} className='object-cover h-full w-full rounded-lg' />
							</div>
						</>
					)}
					{/* <img
            className='w-16 h-16 rounded-full'
            src='https://flowbite.com/docs/images/people/profile-picture-1.jpg'
            alt='Rounded avatar'
          /> */}

					<div className='flex-1'>
						<h4
							className='font-semibold text-system-primary-text cursor-pointer'
							onClick={() => {
								goToProfile()
							}}>
							{profile && profile.FullName}
						</h4>
						<h4 className='font-medium text-sm text-brand-gray-dim mb-2'>
							@{profile && profile.Username}, {profile && profile.JobTitle} {profile && profile.Country}
						</h4>
					</div>
					{loading ? (
						<Button variant='outline'>
							<Spinner />
						</Button>
					) : (
						<>
							{profile.IsFollowing === true ? (
								<>
									<Button
										variant='outline'
										onClick={() => {
											unFollowUser(
												profile,
												() => {
													updateList()
												},
												setLoading
											)
										}}>
										Unfollow
									</Button>
								</>
							) : (
								<>
									<Button
										variant='outline'
										onClick={() => {
											followUser(
												profile,
												() => {
													updateList()
												},
												setLoading
											)
										}}>
										Follow
									</Button>
								</>
							)}
						</>
					)}
				</div>
			</div>
		</>
	)
}

export default MemberSuggestionTab
