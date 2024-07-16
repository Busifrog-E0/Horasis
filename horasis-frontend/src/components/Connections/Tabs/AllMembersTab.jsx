import Spinner from '../../ui/Spinner'
import MembersSection from '../MembersSection'

const AllMembersTab = ({ isLoading, setIsLoading, data, setData, getAllData, fetchMore, isLoadingMore, pageDisabled }) => {
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
    <MembersSection
      members={data}
      emptyText={'No members '}
      updateList={setData}
      whichTime='member'
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      pageDisabled={pageDisabled}
      tabName='members'
    />
  )
}

export default AllMembersTab
