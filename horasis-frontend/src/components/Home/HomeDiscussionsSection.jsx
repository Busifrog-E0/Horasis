import { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useGetList from '../../hooks/useGetList'
import { useAuth } from '../../utils/AuthProvider'
import { relativeTime } from '../../utils/date'

const HomeDiscussionSec = (props, ref) => {
	const navigate = useNavigate()
	const { data: guestDiscussions } = useGetList('guest/discussions', { Limit: 3 }, false)
	const { currentUserData } = useAuth()

	return (
		<div className='bg-system-primary-accent h-max flex flex-col items-center ' ref={ref}>
			<div className='flex items-center justify-center my-20 max-w-screen-2xl w-full'>
				<div className='w-11/12  md:w-9/12 flex flex-col gap-10'>
					<div className='flex flex-col items-center justify-between gap-1'>
						<h1 className='text-3xl text-white'>Community Discussions</h1>
						{/* <p className='text-system-secondary-text'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p> */}
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{guestDiscussions &&
							guestDiscussions.length > 0 &&
							guestDiscussions.map((discussion) => {
								return <HomeDiscussionItem discussion={discussion} key={discussion.DocId} />
							})}
					</div>
					<div className=' w-full  flex items-center justify-center'>
						<button
							className='border border-system-primary-bg  text-system-primary-bg px-8 py-3 rounded-full cursor-pointer'
							onClick={() => {
								// if (currentUserData) {
								// 	navigate('/Discussions')
								// } else {
								// }
								navigate('/Login')
							}}>
							Login to know more details
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

const HomeDiscussionItem = ({ discussion }) => {
	return (
		<div className='flex flex-col gap-4'>
			<div className='rounded-xl overflow-hidden min-h-44 max-h-44 '>
				{discussion.CoverPicture && <img src={discussion.CoverPicture} className='object-cover h-full w-full' alt='' />}
			</div>
			{discussion.DiscussionName && (
				<p className='font-bold text-lg text-white'>{discussion.DiscussionName}</p>
			)}
			{discussion.Description && <p className='text-sm line-clamp-3 flex-1 text-white'>{discussion.Description}</p>}
			{discussion.UserDetails && (
				<p className='text-white text-sm'>
					{relativeTime(discussion.CreatedIndex)}- {discussion.UserDetails.FullName}
				</p>
			)}
		</div>
	)
}

const HomeDiscussionsSection = forwardRef(HomeDiscussionSec)

export default HomeDiscussionsSection
