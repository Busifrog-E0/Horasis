import Spinner from "../../ui/Spinner"
import MembersSection from "../MembersSection"

const FollowingsTab = ({ isLoading, setIsLoading, data, setData, getAllData, fetchMore, isLoadingMore, pageDisabled, getConnectionCount }) => {

  if (isLoading)
    return (
      <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
        <Spinner />
      </div>
    )

  return (
    <MembersSection
      members={data}
      emptyText='You are not currently following anyone.'
      updateList={(updatedData) => {
        setData(updatedData)
        getConnectionCount()
      }}
      whichTime='following'
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      pageDisabled={pageDisabled}
      tabName='following'
    />
  )
}

export default FollowingsTab
