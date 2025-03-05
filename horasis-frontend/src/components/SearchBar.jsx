const SearchBar = ({ placeholder = 'Search TCS Networking Platform', value, onClickSearch, onChange }) => {
	return (
		<>
			<div className='border border-system-primary-border bg-system-secondary-bg overflow-hidden rounded-lg w-full'>
				<div className='flex gap-0 flex-row'>
					<div className='bg-system-secondary-bg p-3 px-4 flex-1'>
						<input
							value={value}
							onChange={(e) => onChange(e.target.value)}
							className='w-full bg-system-secondary-bg italic text-system-primary-text outline-none'
							placeholder={placeholder}></input>
					</div>
					<div
						onClick={onClickSearch}
						className='bg-system-primary-accent p-3 px-10 cursor-pointer text-system-plan3-text text-md font-semibold rounded-r-lg'>
						Search
					</div>
				</div>
			</div>
		</>
	)
}

export default SearchBar
