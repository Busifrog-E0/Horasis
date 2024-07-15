import Spinner from '../../ui/Spinner'
import MembersSection from '../MembersSection'

const FollowersTab = ({ isLoading, setIsLoading, data, setData, getAllData }) => {
  if (isLoading)
    return (
      <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
        <Spinner />
      </div>
    )

  return (
    <MembersSection
      members={data}
      emptyText='You currently have no followers.'
      updateList={getAllData}
      whichTime='followed'
    />
  )
}

export default FollowersTab
