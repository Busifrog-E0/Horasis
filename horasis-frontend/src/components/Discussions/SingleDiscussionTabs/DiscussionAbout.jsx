import saved from '../../../assets/icons/save-fill.svg'
import save from '../../../assets/icons/save-outline.svg'
import Spinner from '../../ui/Spinner'
const DiscussionAbout = ({ discussion, saveDiscussion, removeDiscussion, isSaving }) => {
	return (
		<div className='bg-system-secondary-bg  p-4 lg:py-8 lg:px-12 rounded-b-lg overflow-hidden'>
			<div className='flex flex-row justify-between text-system-primary-accent'>
				<h4 className='font-semibold text-2xl text-system-primary-text'>Description</h4>
				{/* {discussion.Permissions.IsAdmin && <></>} */}
				{/* <svg
					className='w-6 h-6 cursor-pointer'
					aria-hidden='true'
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
				</svg> */}
				{isSaving ? (
					<div className='self-end'>
						<Spinner />
					</div>
				) : (
					<>
						{discussion.IsSaved ? (
							<>
								<img
									src={saved}
									alt=''
									className='h-8 self-end cursor-pointer'
									onClick={() => removeDiscussion(discussion.DocId)}
								/>
							</>
						) : (
							<>
								<img
									src={save}
									alt=''
									className='h-8 self-end cursor-pointer'
									onClick={() => saveDiscussion(discussion.DocId)}
								/>
							</>
						)}
					</>
				)}
			</div>
			<h4 className='text-xl text-brand-gray mt-2 lg:mt-6 mb-6 leading-8 whitespace-pre-line'>
				{discussion.Description}
			</h4>
		</div>
	)
}

export default DiscussionAbout
