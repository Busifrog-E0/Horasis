import { useNavigate } from 'react-router-dom'
import arrowfor from '../../../assets/icons/arrowfor.svg'
import useGetList from '../../../hooks/useGetList'
import EmptyMembers from '../../Common/EmptyMembers'
import Spinner from '../../ui/Spinner'
import ActivityListComponent from '../ActivityListComponent'

const SavedActivityTab = () => {
	const navigate = useNavigate()
	const {
		data: activitiesData,
		isLoading,
		isLoadingMore,
		isPageDisabled,
		setData: setActivitiesData,
	} = useGetList(`saves`, { Limit: 5, Type: 'Activity' }, false, true, false, [])


	const onDelete = (DocId) => {
		console.log(DocId)
		setActivitiesData(activitiesData.filter((d) => d.DocId !== DocId))
	}

	return (
		<div className='p-5 bg-system-secondary-bg rounded-lg'>
			<div className='flex items-center justify-between gap-2 mb-1'>
				<h4 className='font-medium text-2xl text-system-primary-text'>Saved Posts</h4>
				{activitiesData.length > 0 && (
					<img src={arrowfor} alt='' className='h-6 w-6 cursor-pointer' onClick={() => navigate('/Saved')} />
				)}

				{/* arrow cursor-pointer */}
			</div>
			<div>
				{isLoading ? (
					<Spinner />
				) : activitiesData.length > 0 ? (
					<>
						<ActivityListComponent
							onSaveRemoveCallback={fetch}
							ShowImage={false}
							className={`p-4 bg-system-secondary-bg rounded-lg border border-system-file-border relative`}
							avatarSize='w-8 h-8'
							titleSize='text-sm'
							descriptionSize='text-xs'
							onDelete={onDelete}
							gapBnTabs={'gap-3'}
							bordered={true}
							activitiesData={activitiesData}
							timeSize='text-xs'
							iconSize={'4'}
						/>
						{/* <EmptyMembers emptyText={`${activitiesData.length} saved posts. But some error occured!`} /> */}
					</>
				) : (
					<EmptyMembers emptyText={'No saved posts'} />
				)}
			</div>
		</div>
	)
}

export default SavedActivityTab
