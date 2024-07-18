import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../utils/AuthProvider"
import { getNextId } from "../../utils/URLParams"
import { jsonToQuery } from "../../utils/searchParams/extractSearchParams"
import { getItem } from "../../constants/operations"
import ConnectionsTab from "./Tabs/ConnectionsTab"
import { useToast } from "../Toast/ToastService"

const MyConnectionsTab = () => {
    const { updateCurrentUser, currentUserData } = useContext(AuthContext)
    const toast = useToast()
    const [connections, setConnections] = useState([])
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
    const getConnections = (tempConnections) => {
        setLoadingCom(tempConnections, true)
        getItem(
            `users/${currentUserData.CurrentUser.UserId}/connections?&NextId=${getNextId(tempConnections)}&${jsonToQuery(
                filters
            )}`,
            (data) => {
                setConnections([...tempConnections, ...data])
                setLoadingCom(tempConnections, false)
            },
            (err) => {
                setLoadingCom(tempConnections, false)
                // console.log(err)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }

    const hasAnyLeft = () => {
        getItem(
            `users/${currentUserData.CurrentUser.UserId}/connections?NextId=${getNextId(connections)}&${jsonToQuery({
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
        getConnections([])
    }, [])
    useEffect(() => {
        if (connections.length > 0) hasAnyLeft()
    }, [connections])


    return (
        <div className='bg-system-secondary-bg p-4 lg:p-6 rounded-b-lg '>
            <ConnectionsTab
                getConnectionCount={() => { }}
                data={connections}
                getAllData={getConnections}
                isLoading={isLoading}
                setData={setConnections}
                setIsLoading={setIsLoading}
                fetchMore={() => {
                    getConnections(connections)
                }}
                isLoadingMore={isLoadingMore}
                pageDisabled={pageDisabled}
            />
        </div>
    )
}

export default MyConnectionsTab