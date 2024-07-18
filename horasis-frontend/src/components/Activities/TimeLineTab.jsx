import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { AuthContext } from '../../utils/AuthProvider';
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams';
import { getNextId } from '../../utils/URLParams';
import { getItem } from '../../constants/operations';
import ActivityListComponent from './ActivityListComponent';
import Spinner from '../ui/Spinner';
import EmptyMembers from '../Common/EmptyMembers';
import { useToast } from '../Toast/ToastService';
import ActivityComponent from './ActivityComponent';
import PostComponent from './PostComponent';

const TimeLineTab = ({ gapBnTabs = "", bordered = false, header, classNameForPost = "" }) => {

    const { updateCurrentUser, currentUserData } = useContext(AuthContext)
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [activitiesData, setActivitiesData] = useState([])
    const [pageDisabled, setPageDisabled] = useState(true)
    const [filters, setFilters] = useState({
        OrderBy: 'Index',
        Limit: 10,
        Keyword: '',
    })




    const onDelete = (DocId) => {
        console.log(DocId)
        setActivitiesData(activitiesData.filter(d => d.DocId !== DocId))
    }


    const setLoadingCom = (tempArr, value) => {
        if (tempArr.length > 0) {
            setIsLoadingMore(value)
        } else {
            setIsLoading(value)
        }
    }

    const getAllActivities = (tempActivites) => {
        getData(`activities?&${jsonToQuery(filters)}`, tempActivites, setActivitiesData)
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
        getAllActivities(initialRender ? [] : activitiesData)

    }

    const fetch = () => fetchData(true)
    const fetchMore = () => fetchData(false)

    useEffect(() => {
        if (activitiesData.length > 0) hasAnyLeft(`activities`, activitiesData)
    }, [activitiesData])

    useEffect(() => {
        fetch()
    }, [filters])

    if (isLoading)
        return (
            <div className=''>
                <Spinner />
            </div>
        )

    return (
        <div>
            <PostComponent className={classNameForPost} onSuccess={fetch} />

            {header && <h4 className='font-medium text-2xl text-system-primary-text mt-3 lg:mt-9 mb-4'>All Updates</h4>}
            {activitiesData.length > 0 ?
                <>
                    <ActivityListComponent onDelete={onDelete} gapBnTabs={gapBnTabs} bordered={bordered} activitiesData={activitiesData} />
                    {isLoadingMore && (
                        <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
                            <Spinner />
                        </div>
                    )}
                    {
                        !pageDisabled &&
                        (
                            <div onClick={fetchMore}
                                className='flex flex-row justify-end mt-4 mb-2'>
                                <div className='cursor-pointer flex items-center gap-2'>
                                    <h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
                                </div>
                            </div>
                        )}
                </>
                :
                <EmptyMembers emptyText={"You don't have any updates."} />
            }
        </div>
    )
}

export default TimeLineTab;