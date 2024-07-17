import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../utils/AuthProvider"
import { useToast } from "../../Toast/ToastService"
import { jsonToQuery } from "../../../utils/searchParams/extractSearchParams"
import { getNextId } from "../../../utils/URLParams"
import { getItem } from "../../../constants/operations"
import Modal from "../../ui/Modal"
import MembersSection from "../../Connections/MembersSection"

const ViewLikedMembers = ({ activity }) => {
    const { updateCurrentUser, currentUserData } = useContext(AuthContext)
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [membersData, setMembersData] = useState([])
    const [pageDisabled, setPageDisabled] = useState(true)
    const [filters, setFilters] = useState({
        OrderBy: 'Index',
        Keyword: '',
        Limit: 10,
        Keyword: '',
    })

    const openMembersList = () => {
        setIsModelOpen(true)
        fetch()
    }



    const setLoadingCom = (tempArr, value) => {
        if (tempArr.length > 0) {
            setIsLoadingMore(value)
        } else {
            setIsLoading(value)
        }
    }

    const getAllActivities = (tempActivites) => {
        getData(`activities/${activity.DocId}/likedUsers?&${jsonToQuery(filters)}`, tempActivites, setMembersData)
    }


    const getData = (endpoint, tempData, setData) => {
        setLoadingCom(tempData, true)
        getItem(
            `${endpoint}&NextId=${getNextId(tempData)}`,
            (data) => {
                setData([...tempData, ...data])
                setLoadingCom(tempData, false)
            },
            (err) => {
                setLoadingCom(tempData, false)
                // console.log(err)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }
    const hasAnyLeft = (endpoint, tempData) => {
        getItem(
            `${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...filters, Limit: 1 })}`,
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

    const fetchData = (initialRender = false) => {
        getAllActivities(initialRender ? [] : membersData)

    }


    const fetch = () => fetchData(true)
    const fetchMore = () => fetchData(false)

    useEffect(() => {
        if (membersData.length > 0) hasAnyLeft(`activities/${activity.DocId}/likedUsers`, membersData)
    }, [membersData])

    return (
        <>
            <Modal isOpen={isModelOpen} maxWidth={`max-w-4xl`}>
                <Modal.Header>
                    <p className='text-lg font-medium'>Liked Members</p>
                    <button
                        onClick={() => {
                            setIsModelOpen(false)
                        }}
                    >
                        close
                    </button>
                </Modal.Header>
                <Modal.Body >
                    <div className='flex flex-col gap-4'>
                        <MembersSection
                            members={membersData.map(d => ({ ...d.UserDetails, CreatedIndex: d.CreatedIndex }))}
                            emptyText={'No members '}
                            updateList={() => { }}
                            whichTime='member'
                            fetchMore={fetchMore}
                            isLoadingMore={isLoadingMore}
                            pageDisabled={pageDisabled}
                            tabName='members'
                        />
                    </div>
                </Modal.Body>
            </Modal>
            <p className='text-brand-gray-dim mt-1 cursor-pointer hover:underline' onClick={openMembersList}>{activity.NoOfLikes} likes</p>
        </>
    )
}

export default ViewLikedMembers