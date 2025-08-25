import DiscussionsList from '../../Discussions/DiscussionsList'
import Spinner from '../../ui/Spinner'
import TabItem from '../../ui/TabItem'

const DiscussionsSearchTab = ({
	isLoading,
	setIsLoading,
	data,
	setData,
	getAllData,
	fetchMore,
	isLoadingMore,
	pageDisabled,
	discussionTab,
	setDiscussionTab,
}) => {
	if (isLoading)
		return (
			<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
				<Spinner />
			</div>
		)
	return (
		<>
			<div className='bg-system-secondary-bg p-4 pb-10 rounded-lg '>
				<h4 className='font-semibold text-md text-brand-gray mb-4'>Discussions</h4>
				<div className='flex gap-6 flex-wrap mt-3 mb-3'>
					<TabItem
						variant={`${discussionTab === 'all' ? 'active' : 'inactive'}`}
						onClick={() => setDiscussionTab('all')}>
						All Discussions
					</TabItem>
					<TabItem
						variant={`${discussionTab === 'following' ? 'active' : 'inactive'}`}
						onClick={() => setDiscussionTab('following')}>
						Following
					</TabItem>
				</div>
				<DiscussionsList
					cols={'grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'}
					gap={'gap-2 lg:gap-4'}
					data={data}
					emptyText={'No discussions'}
					updateList={setData}
				/>
				{isLoadingMore && <Spinner />}
				{!pageDisabled && (
					<div
						onClick={() => {
							fetchMore()
						}}
						className='flex flex-row justify-end mt-4 mb-2'>
						<div className='cursor-pointer flex items-center gap-2'>
							<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default DiscussionsSearchTab
