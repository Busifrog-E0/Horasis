import MentionedTab from '../components/Activities/Mentions/MentionedTab'
import SavedActivities from '../components/Activities/Saved/SavedActivities'
import SugesstionsSection from '../components/Connections/SuggestionsSection'

const Saved = () => {
	return (
		<>
			<div className='lg:col-span-2'>
				<SavedActivities gapBnTabs='gap-3' classNameForPost='p-5 pr-10 ' header='All Updates' />
			</div>
			<div className='flex flex-col gap-4'>
				<SugesstionsSection />
				<MentionedTab />
			</div>
		</>
	)
}

export default Saved
