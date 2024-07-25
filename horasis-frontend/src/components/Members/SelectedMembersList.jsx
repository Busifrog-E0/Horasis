const SelectedMembersList = ({ selectedValue }) => {
	return (
		<div>
			{typeof selectedValue === 'string' ? (
				<>
					<p className='text-system-primary-text m-0'>{selectedValue}</p>
				</>
			) : (
				<>
					<p className='text-system-primary-text m-0'>
						{selectedValue?.map((val) => val.UserDetails.FullName).join(', ')}
					</p>
				</>
			)}
		</div>
	)
}

export default SelectedMembersList
