import { useNavigate } from 'react-router-dom'
import PodcastsSection from '../components/Podcasts/PodcastsSection'
import Button from '../components/ui/Button'
import SavedDiscussionTab from '../components/Discussions/Saved/SavedDiscussionTab'

const Podcasts = ({ onSelectPodcast, onCreatePodcast }) => {
	const navigate = useNavigate()

	return (
		<>
			<div className='lg:col-span-2'>
				<PodcastsSection />
			</div>
			<div className='flex flex-col gap-4'>
				<Button onClick={() => navigate('/Podcasts/Create/New')} width='full' variant='black'>
					Create Podcast
				</Button>
				<SavedDiscussionTab bordered={true} />
				{/* <SavedActivityTab/> */}
			</div>
		</>
	)
}

export default Podcasts
