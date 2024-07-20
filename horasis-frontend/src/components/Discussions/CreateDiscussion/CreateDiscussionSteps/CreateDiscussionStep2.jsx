import { useState } from "react"
import SelectDiscussionMembers from "../SelectDiscussionMembers"
import SelectDiscussionPrivacy from "../SelectDiscussionPrivacy"

const CreateDiscussionStep2 = ({ }) => {

    const [groupInvitationMembers, setGroupInvitationMembers] = useState([])
    const onSelectGroupInvitationMembers = (value) => {
        setGroupInvitationMembers(value)
    }
    const [activityFeedsMembers, setActivityFeedsMembers] = useState([])
    const onSelectActivityFeedsMembers = (value) => {
        setActivityFeedsMembers(value)
    }
    const [groupPhotosMembers, setGroupPhotosMembers] = useState([])
    const onSelectGroupPhotosMembers = (value) => {
        setGroupPhotosMembers(value)
    }
    const [groupAlbumsMembers, setGroupAlbumsMembers] = useState([])
    const onSelectGroupAlbumsMembers = (value) => {
        setGroupAlbumsMembers(value)
    }
    const [groupVideosMembers, setGroupVideosMembers] = useState([])
    const onSelectGroupVideosMembers = (value) => {
        setGroupVideosMembers(value)
    }


    return (<div className="flex flex-col gap-4">
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Privacy<span className="text-brand-red">*</span></h1>
            <SelectDiscussionPrivacy />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Group Invitations</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Which members of this group are allowed to invite others?</p>
            <SelectEventMembers multiSelect={true} onSelect={onSelectGroupInvitationMembers} selectedValue={groupInvitationMembers} />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Activity Feeds</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Which members of this group are allowed to post into the activity feed?</p>
            <SelectEventMembers multiSelect={true} onSelect={onSelectActivityFeedsMembers} selectedValue={activityFeedsMembers} />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Group Photos</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Which members of this group are allowed to upload albums?</p>
            <SelectEventMembers multiSelect={true} onSelect={onSelectGroupPhotosMembers} selectedValue={groupPhotosMembers} />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Group Albums</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Which members of this group are allowed to create albums?</p>
            <SelectEventMembers multiSelect={true} onSelect={onSelectGroupAlbumsMembers} selectedValue={groupAlbumsMembers} />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Group Videos</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Which members of this group are allowed to upload videos?</p>
            <SelectEventMembers multiSelect={true} onSelect={onSelectGroupVideosMembers} selectedValue={groupVideosMembers} />
        </div>
    </div>)
}

export default CreateDiscussionStep2
