import MentionedTab from '../components/Activities/Mentions/MentionedTab'
import SavedActivityTab from '../components/Activities/Saved/SavedActivityTab'
import SavedArticlesTab from '../components/Articles/SavedArticlesTab'

const SavedArticlesPage = () => {
	return (
		<>
			<div className='lg:col-span-2'>
				<SavedArticlesTab loadMoreEnabled={true} iconPresent={false} />
			</div>
			<div className='flex flex-col gap-4'>
				<SavedActivityTab />
				<MentionedTab />
			</div>
		</>
	)
}

export default SavedArticlesPage
