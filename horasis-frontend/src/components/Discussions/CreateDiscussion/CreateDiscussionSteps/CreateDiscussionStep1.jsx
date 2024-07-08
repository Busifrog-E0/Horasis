import Input from "../../../ui/Input"
import TextArea from "../../../ui/TextArea"

const CreateDiscussionStep1 = ({ }) => {

    return (<div className="flex flex-col gap-4">
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Discussion Name<span className="text-brand-red">*</span></h1>
            <Input placeholder="Discussion name" width="full" variant="primary_outlined" />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Discussion Description<span className="text-brand-red">*</span></h1>
            <TextArea rows={6} placeholder="Discussion description" width="full" variant="primary_outlined" />
        </div>
    </div>)
}

export default CreateDiscussionStep1
