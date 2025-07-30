import { useNavigate } from 'react-router-dom'
import useGetList from '../../../hooks/useGetList'
import EmptyMembers from '../../Common/EmptyMembers'
import Spinner from '../../ui/Spinner'

const SavedPodcastTab = () => {
	const {
		data: podcasts,
		isLoading,
		isLoadingMore,
		isPageDisabled,
		setData: setPodcasts,
	} = useGetList(`saves`, { Limit: 5, Type: 'Podcast' }, false, true, false, [])

	const navigate = useNavigate()

	const onDelete = (DocId) => {
		console.log(DocId)
		setPodcasts(podcasts.filter((d) => d.DocId !== DocId))
	}
	const navigateToPodcast = (id) => {
		navigate(`/Podcasts/${id}`)
	}

	return (
		<div className='p-5 bg-system-secondary-bg rounded-lg'>
			<div className='flex items-center justify-between gap-2 mb-1'>
				<h4 className='font-medium text-2xl text-system-primary-text'>Saved Podcasts</h4>
			</div>
			<div>
				{isLoading ? (
					<Spinner />
				) : podcasts.length > 0 ? (
					<>
						{podcasts.map((podcast, index) => {
							let lastItem = podcasts.length - 1 === index
							return (
								<SavedPodcastItem
									podcast={podcast}
									lastItem={lastItem}
									navigateToPodcast={navigateToPodcast}
									key={podcast.DocId}
								/>
							)
						})}
					</>
				) : (
					<EmptyMembers emptyText={'No saved podcasts'} />
				)}
			</div>
		</div>
	)
}

const SavedPodcastItem = ({ podcast, lastItem, navigateToPodcast }) => {
	return (
		<>
			<div
				className={`mt-4 flex flex-row gap-2 cursor-pointer ${
					!lastItem ? 'border-b' : ''
				} pb-4 border-system-file-border`}
				onClick={() => navigateToPodcast(podcast.DocId)}>
				<div className='h-16 aspect-square  overflow-hidden rounded-lg'>
					<img src={podcast.CoverPicture} className='object-cover h-full w-full' />
				</div>
				<div className='flex-1'>
					<h4 className='font-semibold text-sm text-system-primary-text'>{podcast.PodcastName}</h4>
					<div className='flex flex-row gap-3'>
						<p className='text-xs text-brand-gray-dim mt-1 line-clamp-1'>{podcast.Description}</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default SavedPodcastTab
