import SelectBox from '../../ui/SelectBox'

const SelectEventTypeList = ({ onSelect, multiSelect, selectedValue }) => {
	return (
		<>
			<SelectBox
				body={
					<>
						<div className='flex flex-col gap-2'>
							<div
								className={`${
									selectedValue === 'Offline'
										? 'bg-system-primary-bg text-system-primary-accent'
										: 'text-system-secondary-text'
								} py-2 px-4 rounded-md cursor-pointer`}
								onClick={() => {
									onSelect('Offline')
								}}>
								<p className='text-md  font-medium'>Offline</p>
							</div>
							<div
								className={`${
									selectedValue === 'Virtual'
										? 'bg-system-primary-bg text-system-primary-accent'
										: 'text-system-secondary-text'
								} py-2 px-4  rounded-md cursor-pointer`}
								onClick={() => onSelect('Virtual')}>
								<p className='text-md  font-medium'>Virtual</p>
							</div>
						</div>
					</>
				}
				placeholder='Select event type'
				width='full'
				className='flex flex-row justify-between items-center'
				variant='primary_outlined'
				value={selectedValue === 'Virtual' ? <>Virtual</> : <>Offline</>}
			/>
		</>
	)
}

export default SelectEventTypeList
