import Spinner from '../../ui/Spinner'
import MembersSection from '../MembersSection'

const ConnectionsTab = ({ isLoading, setIsLoading, data, setData, getAllData, fetchMore, isLoadingMore, pageDisabled, getConnectionCount }) => {

  if (isLoading)
    return (
      <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
        <Spinner />
      </div>
    )
  return (
    <MembersSection
      members={data}
      emptyText='You currently have no connections'
      updateList={updatedData => {
        setData(updatedData)
        getConnectionCount()
      }}
      whichTime='connection'
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      pageDisabled={pageDisabled}
      tabName='connections'
    />
  )
}

export default ConnectionsTab