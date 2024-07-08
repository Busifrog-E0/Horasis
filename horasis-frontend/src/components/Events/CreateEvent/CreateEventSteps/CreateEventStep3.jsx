import SelectEventDiscussion from "../SelectEventDiscussion"

const CreateEventStep3 = ({ }) => {


    return (<div className="flex flex-col gap-4">
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Group Discussion</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Create a discussion forum to allow members of this group to communicate in a structured, bullet-in borad style fashion.</p>
            <SelectEventDiscussion />
        </div>

    </div>)
}

export default CreateEventStep3
