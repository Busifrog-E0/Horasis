import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../utils/AuthProvider"
import { getItem } from "../../../constants/operations"
import Spinner from "../../ui/Spinner"
import MembersSection from "../MembersSection"
import { jsonToQuery } from "../../../utils/searchParams/extractSearchParams"
import { getNextId } from "../../../utils/URLParams"
import { useToast } from "../../Toast/ToastService"

const FollowingsTab = () => {
  const { updateCurrentUser, currentUserData } = useContext(AuthContext)
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [followings, setFollowings] = useState([])
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

  const getFollowing = (tempFollowing) => {
    setIsLoading(true)
    getItem(
      `users/${currentUserData.CurrentUser.UserId}/followings?&${jsonToQuery(
        filters
      )}&NextId=${getNextId(tempFollowing)}`,
      (followings) => {
        console.log('Following')
        setFollowings([...tempFollowing, ...followings])
        setIsLoading(false)
      },
      (err) => {
        setIsLoading(false)
        console.log(err)
      },
      updateCurrentUser,
      currentUserData,toast
    )
  }

  useEffect(() => {
    getFollowing([])
  }, [])

  if (isLoading)
    return (
      <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
        <Spinner />
      </div>
    )

  return (
    <MembersSection
      members={followings}
      emptyText='You are not currently following anyone.'
      updateList={getFollowing}
      whichTime='following'
    />
  )
}

export default FollowingsTab
