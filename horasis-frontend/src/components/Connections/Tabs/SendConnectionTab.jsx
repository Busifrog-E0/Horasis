import Spinner from '../../ui/Spinner'
import MembersSection from '../MembersSection'

const SendConnectionTab = ({ isLoading, setIsLoading, data, setData, getAllData, fetchMore, isLoadingMore, pageDisabled }) => {

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
      updateList={setData}
      whichTime='connection'
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      pageDisabled={pageDisabled}
      tabName='sent'
    />
  )
}
export default SendConnectionTab
