import { relativeTime } from '../../utils/date'
import EmptyMembers from '../Common/EmptyMembers'
import DropdownMenu from '../ui/DropdownMenu'
import Spinner from '../ui/Spinner'
import MembersSectionTab from './MemberSectionTab'

const MembersSection = ({ members, emptyText, updateList, whichTime, isLoadingMore, pageDisabled, fetchMore }) => {
  return (
    <>
      <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
        <div className='flex flex-col gap-5'>
          {members ? (
            <>
              {members.length > 0 ? (
                <>
                  {members.map((item, index) => {
                    let lastElement = members.length === index + 1
                    return (
                      <MembersSectionTab
                        key={index}
                        profile={item}
                        lastElement={lastElement}
                        updateList={updateList}
                        whichTime={whichTime}
                      />
                    )
                  })}
                </>
              ) : (
                <>
                  <EmptyMembers emptyText={emptyText} />
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </div>

        {isLoadingMore && <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
          <Spinner />
        </div>}
        {!pageDisabled &&
          <p className='text-system-primary-accent cursor-pointer' onClick={() => {
            fetchMore()
          }}>Load More</p>
        }

      </div>
    </>
  )
}

export default MembersSection
