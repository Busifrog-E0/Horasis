import { relativeTime } from '../../utils/date'
import DropdownMenu from '../ui/DropdownMenu'
import avatar from '../../assets/icons/avatar.svg'
import like from '../../assets/icons/like.svg'
import reply from '../../assets/icons/reply.svg'
import ActivityCarousel from './ActivityCarousel'
import ActivityComment from './Comment/ActivityComment'
import { useState } from 'react'
import ActivityCommentList from './Comment/ActivityCommentList'
const ActivityComponent = () => {
	const activity = {
		UserDetails: {
			ProfilePicture: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
			FullName: 'Tejeswara Rao Pedada',
			Username: 'Teja',
		},
		MediaFiles: [
			{
				Type: 'Image',
				Url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2620&q=80',
			},
			{
				Type: 'Image',
				Url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
			},
			{
				Type: 'Image',
				Url: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80',
			},

			{
				Type: 'Image',
				Url: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80',
			},
			{
				Type: 'Image',
				Url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
			},
			{
				Type: 'Video',
				Url: 'https://videos.pexels.com/video-files/26626391/11978858_1440_2560_60fps.mp4',
			},
			{
				Type: 'Video',
				Url: 'https://videos.pexels.com/video-files/17127360/17127360-uhd_2560_1440_30fps.mp4',
			},
		],
		NoOfLikes: 100,
		NoOfComments: 50,
	}

	const comment = {
		Content: 'This is a sample comment content.',
		ParentId: '1234567890abcdef',
		UserId: 'user12345',
		DocId: 'comment12345',
		NoOfReplies: 5,
		Type: 'Comment',
		User: {
			FullName: 'Jane Doe',
			Username: 'janedoe',
			Email: 'jane.doe@example.com',
			DocId: 'abc123DEF',
			Country: 'Canada',
			City: 'Toronto',
			JobTitle: 'Product Manager',
			Industry: 'Software',
			CompanyName: 'InnovateTech',
			About: 'Seasoned product manager with over 10 years of experience in the software industry.',
			CoverPicture: 'string',
			ProfilePicture: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
		},
	}

	const [showComment, setShowComment] = useState(false)

	return (
		<div className='p-5 bg-system-secondary-bg rounded-lg'>
			<div className='flex items-start gap-2'>
				{activity.UserDetails.ProfilePicture ? (
					<>
						<img className='w-16 h-16 rounded-full' src={activity.UserDetails.ProfilePicture} alt='Rounded avatar' />
					</>
				) : (
					<>
						<img className='w-16 h-16 rounded-full' src={avatar} alt='Rounded avatar' />
					</>
				)}

				<div className='flex-1'>
					<div className='flex items-start justify-between gap-10'>
						<div className='flex  flex-col gap-1'>
							<h4 className='font-semibold text-xl text-system-primary-accent mt-1'>{activity.UserDetails.FullName}</h4>
							{/* <h4 className='text-system-primary-text text-md'>Updated their photo</h4> */}
						</div>
						<h4 className='font-medium text-base text-brand-gray-dim'>{relativeTime(new Date().getTime())}</h4>
					</div>
				</div>
			</div>
			<div className='mt-5'>
				<h4 className='text-system-primary-text font-medium text-xl'>Have a great day!</h4>
			</div>
			{activity?.MediaFiles && activity.MediaFiles.length > 0 && (
				<div>
					<ActivityCarousel slides={activity.MediaFiles} />
				</div>
			)}
			<div className='flex items-center justify-between gap-10 mt-2'>
				<div className='flex flex-wrap items-start justify-between gap-10'>
					<div className='flex items-center gap-2 cursor-pointer'>
						<img src={like} className='h-6 w-6' />
						<p className='text-brand-gray-dim mt-1'>{activity.NoOfLikes} likes</p>
					</div>
					<div className='flex items-center gap-2 cursor-pointer' onClick={() => setShowComment((prev) => !prev)}>
						<img src={reply} className='h-6 w-6' />
						<p className='text-brand-gray-dim mt-1'>{activity.NoOfComments} replies</p>
					</div>
				</div>
				<DropdownMenu />
			</div>
			{showComment && <ActivityCommentList activity={activity} />}
		</div>
	)
}

export default ActivityComponent
