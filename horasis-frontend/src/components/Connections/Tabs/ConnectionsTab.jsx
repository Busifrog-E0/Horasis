import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../utils/AuthProvider'
import { getItem } from '../../../constants/operations'
import Spinner from '../../ui/Spinner'
import MembersSection from '../MembersSection'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../../utils/URLParams'
import { useToast } from '../../Toast/ToastService'

const ConnectionsTab = () => {
  const { updateCurrentUser, currentUserData } = useContext(AuthContext)
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [connections, setConnections] = useState([])
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

  const getConnections = (tempConnections) => {
    setIsLoading(true)
    getItem(
      `users/${currentUserData.CurrentUser.UserId}/connections?&${jsonToQuery(
        filters
      )}&NextId=${getNextId(tempConnections)}`,
      (connections) => {
        console.log('Connections')
        setConnections([...tempConnections, ...connections])
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
    getConnections([])
  }, [])
  if (isLoading)
    return (
      <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
        <Spinner />
      </div>
    )
  return (
    <MembersSection
      members={connections}
      emptyText='You currently have no connections'
      updateList={getConnections}
      whichTime='connection'
    />
  )
}

export default ConnectionsTab