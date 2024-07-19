import Spinner from '../../ui/Spinner'
import PostsSearchSection from '../Sections/Posts/PostsSearchSection'

const PostsSearchTab = ({ isLoading, setIsLoading, data, setData, getAllData, fetchMore, isLoadingMore, pageDisabled }) => {

    if (isLoading)
        return (
            <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
                <Spinner />
            </div>
        )
    return (
        <>
            <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
                <h4 className="font-semibold text-md text-brand-gray">Posts</h4>
                <PostsSearchSection
                    posts={data}
                    emptyText={'No posts '}
                    updateList={setData}
                    whichTime='member'
                    tabName='posts'
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

export default PostsSearchTab
