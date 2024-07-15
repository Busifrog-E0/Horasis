import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../utils/AuthProvider'
import { getItem } from '../../../constants/operations'
import Spinner from '../../ui/Spinner'
import MembersSection from '../MembersSection'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import { useToast } from '../../Toast/ToastService'

const AllMembersTab = () => {
  const { updateCurrentUser, currentUserData } = useContext(AuthContext)
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState([])
  const [filters, setFilters] = useState({
    OrderBy: 'Index',
    Keyword: '',
    Limit: 10,
    Keyword: '',
  })

  function filter(oby, kw, lt) {
    var newFilter = { OrderBy: oby, Keyword: kw, Limit: lt }
    navigate(`?${jsonToQuery(newFilter)}`)
    setFilters(newFilter)
  }

  const getAllMembers = (tempMembers) => {
    setIsLoading(true)
    getItem(
      `users?&${jsonToQuery(filters)}&NextId=${getNextId(tempMembers)}`,
      (members) => {
        // console.log('All Members')
        setMembers([...tempMembers, ...members])
        setIsLoading(false)
      },
      (err) => {
        setIsLoading(false)
        // console.log(err)
      },
      updateCurrentUser,
      currentUserData,toast
    )
  }

  useEffect(() => {
    getAllMembers([])
  }, [])
  if (isLoading)
    return (
      <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
        <Spinner />
      </div>
    )
  return (
    <MembersSection
      members={members}
      emptyText={'No members '}
      updateList={getAllMembers}
      whichTime='member'
    />
  )
}

export default AllMembersTab
