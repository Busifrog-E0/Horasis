import TodaysEventTab from '../components/Events/TodaysEventTab'
import RecentlyActiveMemebrsTab from '../components/Members/RecentlyActiveMemebrsTab'
import CurrentProfileTab from '../components/Profile/CurrentProfileTab'
import EmptyMembers from '../components/Common/EmptyMembers'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../utils/AuthProvider'
import { getItem } from '../constants/operations'
import PostComponent from '../components/Activities/PostComponent'
import ActivityListComponent from '../components/Activities/ActivityListComponent'
import { useToast } from '../components/Toast/ToastService'
import { getNextId } from '../utils/URLParams'
import { jsonToQuery } from '../utils/searchParams/extractSearchParams'
import Spinner from '../components/ui/Spinner'
import { useParams } from 'react-router-dom'
import ActivityComponent from '../components/Activities/ActivityComponent'
import MentionedTab from '../components/Activities/Mentions/MentionedTab'



const SingleActivity = () => {
    const { updateCurrentUser, currentUserData } = useContext(AuthContext)
    const { activityid } = useParams()
    const toast = useToast()


    return (
        <>
            <div className='p-2 lg:px-10 lg:py-6'>
                <div className='grid lg:grid-cols-4 gap-3 lg:gap-12'>
                    <div>
                        <CurrentProfileTab />
                        <h4 className='font-medium text-xl text-system-primary-text mt-3 lg:mt-5'>Today's Event</h4>
                        <TodaysEventTab />
                        <div className='p-6 bg-system-secondary-bg rounded-lg mt-3 lg:mt-5'>
                            <h4 className='font-medium text-md text-system-primary-text mb-4'>Recently Active Members</h4>
                            <RecentlyActiveMemebrsTab />
                        </div>
                    </div>
                    <div className='lg:col-span-2'>
                        <ActivityComponent titleSize="text-xl" descriptionSize='text-lg font-medium'
                            onDelete={(DocId) => { }} activityId={activityid} bordered={false} avatarSize={'w-16 h-16'}
                            className={`p-5 bg-system-secondary-bg rounded-lg relative`}
                        />
                    </div>
                    <div>
                        <div className='p-5 bg-system-secondary-bg rounded-lg'>
                            <div className='flex items-center justify-between gap-2 mb-5'>
                                <h4 className='font-medium text-2xl text-system-primary-text'>Events</h4>
                                {/* arrow cursor-pointer */}
                            </div>
                            <EmptyMembers emptyText={'No events'} />
                        </div>
                        <MentionedTab />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SingleActivity
