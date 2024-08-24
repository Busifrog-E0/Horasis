import { useState } from 'react'
import EventsList from '../../Events/EventsList'
import Spinner from '../../ui/Spinner'
import TabItem from '../../ui/TabItem'

const EventsSearchTab = ({
	isLoading,
	setIsLoading,
	data,
	setData,
	getAllData,
	fetchMore,
	isLoadingMore,
	pageDisabled,
	eventTab,
	setEventTab,
}) => {
	if (isLoading)
		return (
			<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
				<Spinner />
			</div>
		)
	return (
		<>
			<div className='bg-system-secondary-bg p-4 pb-10 rounded-b-lg '>
				<h4 className='font-semibold text-md text-brand-gray mb-4'>Events</h4>
				<div className='flex gap-6 flex-wrap mt-3 mb-3'>
					<TabItem variant={`${eventTab === 'all' ? 'active' : 'inactive'}`} onClick={() => setEventTab('all')}>
						All Events
					</TabItem>
					<TabItem variant={`${eventTab === 'popular' ? 'active' : 'inactive'}`}
                    onClick={()=>setEventTab('popular')}
                    >Popular Events</TabItem>
				</div>
				<EventsList
					from='search'
					data={data}
					emptyText={'No events'}
					gap={'gap-2 lg:gap-4'}
					cols={'grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4'}
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

export default EventsSearchTab
