import { useContext, useEffect, useState } from "react"
import { getItem } from "../../constants/operations"
import { AuthContext } from "../../utils/AuthProvider"
import { useToast } from "../Toast/ToastService"
import { getNextId } from "../../utils/URLParams"
import { jsonToQuery } from "../../utils/searchParams/extractSearchParams"
import EmptyMembers from "../Common/EmptyMembers"
import Spinner from "../ui/Spinner"
import avatar from '../../assets/icons/avatar.svg'
import MemberSearchSectionTab from "../Search/Sections/Members/MemberSearchSectionTab"
import SelectMembersTab from "./SelectMembersTab"

const SelectMembersList = ({ onSelect, multiSelect, selectedValue }) => {
    const { updateCurrentUser, currentUserData } = useContext(AuthContext)
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [pageDisabled, setPageDisabled] = useState(true)
    const [members, setMembers] = useState([])

    const [filters, setFilters] = useState({
        OrderBy: 'Index',
        Limit: 10,
        Keyword: '',
    })

    const onSelectMember = (value) => {
        if (selectedValue.map(d => d.DocId).includes(value.DocId)) {
            onSelect(selectedValue.filter(val => val.DocId !== value.DocId))
        }
        else {
            onSelect([...selectedValue, value])
        }
    }

    const setLoadingCom = (tempArr, value) => {
        if (tempArr.length > 0) {
            setIsLoadingMore(value)
        } else {
            setIsLoading(value)
        }
    }

    const getAllMembers = (tempMembers) => {
        getData(`users?&${jsonToQuery(filters)}`, tempMembers, setMembers)
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
        getAllMembers(initialRender ? [] : members)
    }

    const fetch = () => fetchData(true)
    const fetchMore = () => fetchData(false)

    useEffect(() => {
        if (members.length > 0) hasAnyLeft(`users`, members)
    }, [members])

    useEffect(() => {
        fetch()
    }, [])

    if (isLoading) {
        <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
            <Spinner />
        </div>
    }

    return (
        <>
            <div className='flex flex-col gap-5'>
                {members ? (
                    <>
                        {members.length > 0 ? (
                            <>
                                {members.map((item, index) => {
                                    return (
                                        <SelectMembersTab
                                            selected={multiSelect ? selectedValue.map(d => d.DocId).includes(item.DocId) : selectedValue.DocId === item.DocId}
                                            onSelect={onSelectMember} profile={item} key={item.DocId} />
                                    )
                                })}
                            </>
                        ) : (
                            <>
                                <EmptyMembers emptyText={"No members"} />
                            </>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </div>

            {isLoadingMore && (
                <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
                    <Spinner />
                </div>
            )}
            {!pageDisabled && (
                <div
                    onClick={() => {
                        fetchMore()
                    }}
                    className='flex flex-row justify-end mt-4 mb-2'>
                    <div className='cursor-pointer flex items-center gap-2'>
                        <h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
                        {/* <svg className="text-system-primary-accent h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg> */}
                    </div>
                </div>
            )}
        </>
    )

}

export default SelectMembersList