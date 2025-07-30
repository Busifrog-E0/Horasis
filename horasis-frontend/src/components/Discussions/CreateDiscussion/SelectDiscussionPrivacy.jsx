import SelectBox from '../../ui/SelectBox'

const SelectDiscussionPrivacy = ({ onSelect, multiSelect, selectedValue }) => {
	return (
		<>
			<SelectBox
				body={
					<>
						<div className='flex flex-col gap-2'>
							<div
								className={`${
									selectedValue === 'Public'
										? 'bg-system-primary-bg text-system-primary-accent'
										: 'text-system-secondary-text'
								} py-2 px-4 rounded-md cursor-pointer`}
								onClick={() => {
									onSelect('Public')
								}}>
								<p className='text-md  font-medium'>Public</p>
							</div>
							<div
								className={`${
									selectedValue === 'Private'
										? 'bg-system-primary-bg text-system-primary-accent'
										: 'text-system-secondary-text'
								} py-2 px-4  rounded-md cursor-pointer`}
								onClick={() => onSelect('Private')}>
								<p className='text-md  font-medium'>Private</p>
							</div>
						</div>
					</>
				}
				placeholder='Choose privacy'
				width='full'
				className='flex flex-row justify-between items-center'
				variant='primary_outlined'
				value={selectedValue === 'Private' ? <>Private</> : <>Public</>}
			/>
		</>
	)
}

export default SelectDiscussionPrivacy
