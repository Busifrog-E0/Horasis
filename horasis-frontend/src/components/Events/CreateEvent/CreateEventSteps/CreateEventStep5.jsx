import Button from "../../../ui/Button"
import InviteMemberTab from "../../../Common/InviteMemberTab"

const CreateEventStep5
 = ({ changeStep, activeStep }) => {


    return (<div className="flex flex-col gap-0">
        <div className="mb-4">
            <div className="flex-1">
                <h1 className="text-system-primary-text font-medium text-lg">Register Speakers</h1>
                <p className="text-brand-gray mt-1 mb-2 text-base">Add speakers for your event</p>
            </div>

        </div>
        <div className="mb-2">
            <div className="flex-1">
                <h1 className="text-system-primary-text font-medium text-lg">Invite Members</h1>
                <p className="text-system-primary-text mt-1 mb-2 text-base">Invite by clicking the 'Invite'. Once done, click 'Done'</p>
            </div>

        </div>
        {/* <div className="flex flex-row items-center gap-5 mb-4">
            <Button
                onClick={() => changeStep(activeStep - 1)}
                variant="outline"
            >
                Back
            </Button>
            <div className="flex-1">
                <h1 className="text-system-primary-text font-medium text-lg">Invite Members</h1>
                <p className="text-system-primary-text mt-1 mb-2 text-base">Invite by clicking the 'Invite'. Once done, click 'Next'</p>
            </div>
            <Button
                onClick={() => changeStep(activeStep + 1)}
                variant="black"
                className="px-16"
            >
                Next
            </Button>
        </div> */}
        <div className="flex-1 rounded-md p-2 px-4 border border-system-file-border flex items-center justify-between bg-system-secondary-bg mb-2">
            <h4 className="font-medium text-lg text-brand-gray-dim italic ">Search Members</h4>

        </div>
        <InviteMemberTab />
        <InviteMemberTab />
    </div>)
}

export default CreateEventStep5

