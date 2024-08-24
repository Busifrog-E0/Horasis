import Spinner from '../../ui/Spinner'
import MembersSearchSection from '../Sections/Members/MembersSearchSection'

const AllMembersSearchTab = ({ isLoading, setIsLoading, data, setData, getAllData, fetchMore, isLoadingMore, pageDisabled }) => {
    // function filter(oby, kw, lt) {
    //   var newFilter = { OrderBy: oby, Keyword: kw, Limit: lt }
    //   navigate(`?${jsonToQuery(newFilter)}`)
    //   setFilters(newFilter)
    // }

    if (isLoading)
        return (
            <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
                <Spinner />
            </div>
        )
    return (

        <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
            <h4 className="font-semibold text-md text-brand-gray mb-4">Members</h4>

            <MembersSearchSection
                members={data}
                emptyText={'No members '}
                updateList={setData}
                whichTime='member'
                fetchMore={fetchMore}
                isLoadingMore={isLoadingMore}
                pageDisabled={pageDisabled}
                tabName='members'
            />
        </div>
    )
}

export default AllMembersSearchTab
