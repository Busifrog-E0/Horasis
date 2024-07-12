import { relativeTime } from '../../utils/date'
import EmptyMembers from '../Common/EmptyMembers'
import DropdownMenu from '../ui/DropdownMenu'
import MembersSectionTab from './MemberSectionTab'

const MembersSection = ({ members, emptyText }) => {
  const arr = [0, 1, 2, 3, 4]
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
                      <MembersSectionTab key={index} profile={item} lastElement={lastElement} />
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
      </div>
    </>
  )
}

export default MembersSection
