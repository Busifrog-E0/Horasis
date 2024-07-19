import { useContext } from "react"
import EmptyMembers from "../Common/EmptyMembers"
import { AuthContext } from "../../utils/AuthProvider"
import { useNavigate } from "react-router-dom"
import DiscussionTab from "./DiscussionTab"

const DiscussionsList = ({ cols = 3, gap = "gap-1 lg:gap-4", data = [], emptyText }) => {
    const { currentUserData, scrollToTop } = useContext(AuthContext)
    const navigate = useNavigate()

    const GoToSingleDiscussion = (id) => {
        scrollToTop()
        navigate(`/discussion/${id}`)
    }

    return (
        <>
            {data ? (
                <>
                    {data.length > 0 ? (
                        <>
                            <div className={`grid lg:grid-cols-${cols} ${gap}`}>
                                {data.map((item, index) => {
                                    return (
                                        <DiscussionTab discussion={item} key={index} onClick={() => { }} />
                                    )
                                })}
                            </div>
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
        </>
    )
}

export default DiscussionsList
