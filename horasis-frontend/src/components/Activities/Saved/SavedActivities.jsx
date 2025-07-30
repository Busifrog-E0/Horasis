import useGetList from '../../../hooks/useGetList'
import EmptyMembers from '../../Common/EmptyMembers'
import Spinner from '../../ui/Spinner'
import ActivityListComponent from '../ActivityListComponent'

const SavedActivities = ({ gapBnTabs = '', bordered = false, header, classNameForPost = '' }) => {
	const {
		data: activitiesData,
		isLoading,
		isLoadingMore,
		isPageDisabled,
		setData: setActivitiesData,
		getList: getActivitesData,
	} = useGetList(`saves`, { Limit: 10, Type: 'Activity' }, true, true, false, [])

	const onDelete = (DocId) => {
		console.log(DocId)
		setActivitiesData(activitiesData.filter((d) => d.DocId !== DocId))
	}

	return (
		<div>
			{header && <h4 className='font-medium text-2xl text-system-primary-text mb-4'>All saved activties</h4>}

			{isLoading ? (
				<Spinner />
			) : activitiesData.length > 0 ? (
				<>
					<ActivityListComponent
						avatarSize={'w-16 h-16'}
						ShowImage={true}
						className={`p-5 bg-system-secondary-bg rounded-lg ${
							bordered && 'border border-system-file-border'
						} relative`}
						onDelete={onDelete}
						gapBnTabs={gapBnTabs}
						bordered={bordered}
						activitiesData={activitiesData}
					/>
					{isLoadingMore && (
						<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
							<Spinner />
						</div>
					)}
					{!isPageDisabled && (
						<div onClick={() => getActivitesData(activitiesData,false)} className='flex flex-row justify-end mt-4 mb-2'>
							<div className='cursor-pointer flex items-center gap-2'>
								<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
							</div>
						</div>
					)}
				</>
			) : (
				<EmptyMembers emptyText={'No saved posts.'} />
			)}
		</div>
	)
}

export default SavedActivities
