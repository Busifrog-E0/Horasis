import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../utils/AuthProvider'
import { getItem } from '../../../constants/operations'
import Spinner from '../../ui/Spinner'
import MembersSection from '../MembersSection'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import { useToast } from '../../Toast/ToastService'

const SendConnectionTab = () => {
  const { updateCurrentUser, currentUserData } = useContext(AuthContext)
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [connectionsSend, setConnectionsSend] = useState([])
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

  const getConnectionsSend = (tempConnectionSend) => {
    setIsLoading(true)
    getItem(
      `users/${currentUserData.CurrentUser.UserId}/connections/sent?&${jsonToQuery(
        filters
      )}&NextId=${getNextId(tempConnectionSend)}`,
      (connectionsSend) => {
        console.log('Connections Send')
        setConnectionsSend([...tempConnectionSend, ...connectionsSend])
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
    getConnectionsSend([])
  }, [])
  if (isLoading)
    return (
      <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
        <Spinner />
      </div>
    )
  return (
    <MembersSection
      members={connectionsSend}
      emptyText='You currently have no connections'
      updateList={getConnectionsSend}
      whichTime='connection'
    />
  )
}
export default SendConnectionTab
