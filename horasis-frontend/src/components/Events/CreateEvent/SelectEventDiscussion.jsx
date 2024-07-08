import SelectBox from "../../ui/SelectBox"



const SelectEventDiscussion = () => {

    return (<>
        <SelectBox body={<div>Hi</div>}
            placeholder="Select discussion" width="full"
            className="cursor-pointer flex flex-row justify-between items-center" variant="primary_outlined" />
    </>)
}

export default SelectEventDiscussion
