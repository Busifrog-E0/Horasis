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

	const { followUser, unFollowUser, isFollowLoading, isUnfollowLoading } = useFollow()
	const [loading, setLoading] = useState(false)
	// if (loading) return <Spinner />

	return (
		<>
			<div className={`${lastElement === true ? '' : 'border-b border-system-file-border pb-3'}`}>
				<div className='flex items-start gap-4'>
					{profile.ProfilePicture ? (
						<div className='w-10 h-10 rounded-full bg-black'>
							<img className='w-10 h-10 rounded-full object-cover' src={profile.ProfilePicture} alt='Rounded avatar' />
						</div>
					) : (
						<>
							<div className='w-10 h-10 rounded-full bg-brand-light-gray'>
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
							className='font-semibold text-system-primary-text cursor-pointer text-base'
							onClick={() => {
								goToProfile()
							}}>
							{profile && profile.FullName}
						</h4>
						<h4 className='font-medium text-xs leading-relaxed text-brand-gray-dim mb-2'>
							@{profile && profile.Username}, {profile && profile.JobTitle}, {profile && profile.Country}
						</h4>
					</div>
					{loading ? (
						<Button variant='outline' className='text-sm py-2 px-4'>
							<Spinner size={'4'} />
						</Button>
					) : (
						<>
							{profile.IsFollowing === true ? (
								<>
									<Button
										variant='outline'
										className='text-sm py-2 px-4'
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
										className='text-sm py-2 px-4'
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
