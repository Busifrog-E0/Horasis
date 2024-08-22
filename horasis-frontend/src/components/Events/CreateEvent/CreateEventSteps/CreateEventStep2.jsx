import SelectDiscussionPrivacy from '../../../Discussions/CreateDiscussion/SelectDiscussionPrivacy'
import SelectEventDiscussion from '../SelectEventDiscussion'

const CreateEventStep2 = ({ errorObj, postEventData, setPostEventData }) => {
	const onSelectPrivacy = (value) => {
		setPostEventData({ ...postEventData, Privacy: value })
	}
	const onSelectDiscussion = (value) => {
		setPostEventData({ ...postEventData, HasDiscussion: value })
	}
	return (
		<div className='flex flex-col gap-4'>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Event Privacy<span className='text-brand-red'>*</span>
				</h1>
				<SelectDiscussionPrivacy multiSelect={false} onSelect={onSelectPrivacy} selectedValue={postEventData.Privacy} />
				{errorObj['Privacy'] != undefined && <p className='text-brand-red m-0'>{errorObj['Privacy']}</p>}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>Group Discussion</h1>
				<p className='text-brand-gray mt-1 mb-2 text-base'>
					Create a discussion forum to allow members of this group to communicate in a structured, bullet-in board style
					fashion.
				</p>
				<SelectEventDiscussion
					multiSelect={false}
					onSelect={onSelectDiscussion}
					selectedValue={postEventData.HasDiscussion}
				/>
			</div>
		</div>
	)
}

export default CreateEventStep2
