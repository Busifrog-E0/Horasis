import Input from '../../ui/Input'

const SearchComponent = ({ searchKey, setSearchKey, placeholder = 'Search Connections' }) => {
	return (
		<Input
			className='py-3 rounded-xl border-2 border-system-secondary-accent'
			placeholder={placeholder}
			width='full'
			value={searchKey}
			onChange={(e) => {
				setSearchKey(e.target.value)
			}}
		/>
	)
}

export default SearchComponent
