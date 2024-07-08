import SelectDiscussionMembers from "../SelectDiscussionMembers"
import SelectDiscussionPrivacy from "../SelectDiscussionPrivacy"

const CreateDiscussionStep2 = ({ }) => {


    return (<div className="flex flex-col gap-4">
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Privacy<span className="text-brand-red">*</span></h1>
            <SelectDiscussionPrivacy />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Group Invitations</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Which members of this group are allowed to invite others?</p>
            <SelectDiscussionMembers />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Activity Feeds</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Which members of this group are allowed to post into the activity feed?</p>
            <SelectDiscussionMembers />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Group Photos</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Which members of this group are allowed to upload albums?</p>
            <SelectDiscussionMembers />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Group Albums</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Which members of this group are allowed to create albums?</p>
            <SelectDiscussionMembers />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Group Videos</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Which members of this group are allowed to upload videos?</p>
            <SelectDiscussionMembers />
        </div>
    </div>)
}

export default CreateDiscussionStep2
