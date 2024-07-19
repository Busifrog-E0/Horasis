import DiscussionsList from '../../Discussions/DiscussionsList'
import Spinner from '../../ui/Spinner'
import TabItem from '../../ui/TabItem'

const DiscussionsSearchTab = ({ isLoading, setIsLoading, data, setData, getAllData, fetchMore, isLoadingMore, pageDisabled }) => {

    if (isLoading)
        return (
            <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
                <Spinner />
            </div>
        )
    return (
        <>
            <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
                <h4 className="font-semibold text-md text-brand-gray">Discussions</h4>
                <div className="flex gap-6 flex-wrap mt-3 mb-3">
                    <TabItem variant="active">
                        All Discussions
                    </TabItem>
                    <TabItem variant="inactive">
                        Following
                    </TabItem>
                </div>
                <DiscussionsList cols={4} gap="gap-3 lg:gap-10"
                    data={data} emptyText={'No discussions'}
                />
                {isLoadingMore && (
                    <Spinner />
                )}
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
