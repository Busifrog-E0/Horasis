import SelectedMembersList from "../../Members/SelectedMembersList"
import SelectMembersList from "../../Members/SelectMembersList"
import SelectBox from "../../ui/SelectBox"



const SelectEventMembers = ({ multiSelect, selectedValue, onSelect }) => {


    return (<>
        <SelectBox body={<SelectMembersList
            onSelect={onSelect}
            selectedValue={selectedValue}
            multiSelect={multiSelect} />}
            placeholder="Select member"
            width="full"
            className="flex flex-row justify-between items-center"
            variant="primary_outlined" value={selectedValue?.length > 0 && <SelectedMembersList selectedValue={selectedValue} />} />
    </>)
}

export default SelectEventMembers
