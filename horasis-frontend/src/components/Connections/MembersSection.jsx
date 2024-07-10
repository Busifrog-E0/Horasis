import { relativeTime } from '../../utils/date'
import DropdownMenu from '../ui/DropdownMenu'
import MembersSectionTab from './MemberSectionTab'

const MembersSection = ({ members }) => {
  const arr = [0, 1, 2, 3, 4]
  return (
    <>
      <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
        <div className='flex flex-col gap-5'>
          {members &&
            members.map((item, index) => {
              let lastElement = members.length === index + 1
              return <MembersSectionTab key={index} profile={item} lastElement={lastElement} />
            })}
          {!members &&
            arr.map((index, item) => {
              let lastElement = arr.length === index + 1
              return <MembersSectionTab key={item} lastElement={lastElement} />
            })}
        </div>
      </div>
    </>
  )
}

export default MembersSection
