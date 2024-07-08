import SelectBox from "../../ui/SelectBox"



const SelectEventCountry = () => {

    return (<>
        <SelectBox body={<div>Select a country from the map below</div>} placeholder="Select a country" width="full"
            className="cursor-pointer flex flex-row justify-between items-center" variant="primary_outlined" />
    </>)
}

export default SelectEventCountry
