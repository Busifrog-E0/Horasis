import React from 'react';
import { relativeTime } from '../../utils/date';
import avatar from '../../assets/icons/avatar.svg'

const ChatDetailsItem = ({ user }) => {

    return <div className="p-3 px-5 border-b border-system-file-border">
        <div className="flex items-start gap-2">
            {user.ProfilePicture ? (
                <img className='w-12 h-12 rounded-full object-cover' src={user?.ProfilePicture} alt='Rounded avatar' />
            ) : (
                <img className='w-12 h-12 rounded-full object-cover' src={avatar} alt='Rounded avatar' />
            )}
            <div className="flex-1">
                <h4 className="font-semibold text-md text-system-primary-accent">{user.FullName}</h4>
                <h4 className="text-sm font-medium text-system-primary-text">
                    Lorem ipsum dolor sit amet.
                </h4>
            </div>
            <div>
                <h4 className="font-medium text-xs text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
            </div>
        </div>
    </div>

}

export default ChatDetailsItem