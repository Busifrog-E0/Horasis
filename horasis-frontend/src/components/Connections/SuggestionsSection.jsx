import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../utils/AuthProvider"
import { jsonToQuery } from "../../utils/searchParams/extractSearchParams"
import { getNextId } from "../../utils/URLParams"
import { getItem } from "../../constants/operations"
import MemberSuggestionTab from "./MemberSuggestionTab"
import { useToast } from "../Toast/ToastService"

const SuggestionsSection = () => {
  const { updateCurrentUser, currentUserData } = useContext(AuthContext)
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [suggested, setSuggested] = useState([])
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

  const getSuggested = (tempSuggested) => {
    setIsLoading(true)
    getItem(
      `users/${currentUserData.CurrentUser.UsedId}/suggested?&${jsonToQuery(
        filters
      )}&NextId=${getNextId(tempSuggested)}`,
      (result) => {
        console.log('Suggested')
        setSuggested([...tempSuggested, ...result])
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
    getSuggested([])
  }, [])
  return (
    <>
      {suggested.map((item, index) => {
        const lastElement = suggested.length === index + 1
        // if (item.DocId === currentUserData.CurrentUser.UserId) return
        return (
          <MemberSuggestionTab
            lastElement={lastElement}
            key={index}
            profile={item}
            updateList={getSuggested}
          />
        )
      })}
    </>
  )
}

export default SuggestionsSection