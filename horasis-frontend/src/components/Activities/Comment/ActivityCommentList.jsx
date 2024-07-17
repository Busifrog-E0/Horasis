import ActivityComment from './ActivityComment'
import TextArea from '../../ui/TextArea'

const ActivityCommentList = ({ activity }) => {
	return (
		<div className='flex items-center justify-between flex-col w-full mt-4'>
			<div className='flex-1 mt-2 rounded-md p-2 px-3 border border-system-secondary-accent bg-system-secondary-bg flex flex-col gap-4 w-full'>
				<div className='flex items-end justify-between gap-2'>
					<TextArea
						width='full'
						className='p-0 border-none rounded-none hover:shadow-none'
						placeholder='Leave a comment'
					/>
					<svg
						aria-hidden='true'
						className='w-6 h-6 text-brand-gray cursor-pointer'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 20 20'>
						<path
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
						/>
					</svg>
				</div>
			</div>
			<div className='flex items-center  justify-between mt-4 flex-col gap-1 w-full'>
				{[0, 1, 2].map((item) => (
					<ActivityComment key={item} comment={activity} />
				))}
			</div>
		</div>
	)
}

export default ActivityCommentList
