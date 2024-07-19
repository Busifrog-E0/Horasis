import InsightsList from '../../Insights/InsightsList'
import Spinner from '../../ui/Spinner'

const InsightsSearchTab = ({ isLoading, setIsLoading, data, setData, getAllData, fetchMore, isLoadingMore, pageDisabled }) => {

    if (isLoading)
        return (
            <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
                <Spinner />
            </div>
        )
    return (
        <>
            <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
                <h4 className="font-semibold text-md text-brand-gray">Insights</h4>
                <InsightsList data={data} emptyText={"No insights"} />
            </div>
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
        </>
    )
}

export default InsightsSearchTab
