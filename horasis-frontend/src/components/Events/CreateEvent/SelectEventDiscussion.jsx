import SelectBox from '../../ui/SelectBox'

const SelectEventDiscussion = ({ onSelect, multiSelect, selectedValue }) => {
	return (
		<>
			<SelectBox
				body={
					<div className='flex flex-col gap-2'>
						<div
							className={`${
								selectedValue === true
									? 'bg-system-primary-bg text-system-primary-accent'
									: 'text-system-secondary-text'
							} py-2 px-4 rounded-md cursor-pointer`}
							onClick={() => {
								onSelect(true)
							}}>
							<p className='text-md  font-medium'>Yes</p>
						</div>
						<div
							className={`${
								selectedValue === false
									? 'bg-system-primary-bg text-system-primary-accent'
									: 'text-system-secondary-text'
							} py-2 px-4  rounded-md cursor-pointer`}
							onClick={() => onSelect(false)}>
							<p className='text-md  font-medium'>No</p>
						</div>
					</div>
				}
				placeholder='Select discussion'
				width='full'
				className='flex flex-row justify-between items-center'
				variant='primary_outlined'
				value={selectedValue === true ? <>Yes</> : <>No</>}
			/>
		</>
	)
}

export default SelectEventDiscussion
