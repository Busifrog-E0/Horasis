import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../utils/AuthProvider"
import { useToast } from "../Toast/ToastService"
import { getNextId } from "../../utils/URLParams"
import { jsonToQuery } from "../../utils/searchParams/extractSearchParams"
import { getItem } from "../../constants/operations"
import Spinner from "../ui/Spinner"
import avatar from '../../assets/icons/avatar.svg'

const RecentlyActiveMemebrsTab = () => {
    const { updateCurrentUser, currentUserData } = useContext(AuthContext)
    const toast = useToast()
    const [members, setMembers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [pageDisabled, setPageDisabled] = useState(true)
    const [filters, setFilters] = useState({
        OrderBy: 'Index',
        Limit: 10,
        Keyword: '',
    })
    const setLoadingCom = (tempArr, value) => {
        if (tempArr.length > 0) {
            setIsLoadingMore(value)
        } else {
            setIsLoading(value)
        }
    }
    const getMembers = (tempMembers) => {
        setLoadingCom(tempMembers, true)
        getItem(
            `users?NextId=${getNextId(tempMembers)}&${jsonToQuery(
                filters
            )}`,
            (data) => {
                setMembers([...tempMembers, ...data])
                setLoadingCom(tempMembers, false)
            },
            (err) => {
                setLoadingCom(tempMembers, false)
                // console.log(err)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }

    const hasAnyLeft = () => {
        getItem(
            `users?NextId=${getNextId(members)}&${jsonToQuery({
                ...filters,
                Limit: 1,
            })}`,
            (data) => {
                if (data?.length > 0) {
                    setPageDisabled(false)
                } else {
                    setPageDisabled(true)
                }
            },
            (err) => {
                setPageDisabled(true)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }


    useEffect(() => {
        getMembers([])
    }, [])
    useEffect(() => {
        if (members.length > 0) hasAnyLeft()
    }, [members])
    // <img key={member.DocId}  src={member.ProfilePicture} alt="Rounded avatar" />

    return (<>
        {
            isLoading ?
                <Spinner />
                :
                <div className="pr-16">

                    <div className="flex items-center flex-wrap gap-3">
                        {members.map((member, index) => {
                            return <div className="cursor-pointer" onClick={() => { }}>
                                {member?.ProfilePicture ? (
                                    <>
                                        <img className="w-12 h-12 rounded-full object-cover" src={member?.ProfilePicture} alt='Rounded avatar' />
                                    </>
                                ) : (
                                    <>
                                        <img className="w-12 h-12 rounded-full object-cover" src={avatar} alt='Rounded avatar' />
                                    </>
                                )}
                            </div>
                        })

                        }
                    </div>
                </div>
        }

    </>)
}

export default RecentlyActiveMemebrsTab
