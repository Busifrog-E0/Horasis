import { useNavigate } from 'react-router-dom'

const TagsList = ({ tags = [] }) => {
	const navigate = useNavigate()

	const handleNavigate = (e, tagName) => {
		e.preventDefault()
		navigate('/Search', { state: { TagName: tagName } })
	}
	return (
		<>
			{tags.map((item) => (
				<div
					key={item.DocId}
					className='rounded-full text-system-primary-accent'
					role='button' // For better accessibility
					tabIndex={0} // Making it focusable
					onClick={(e) => handleNavigate(e, item.TagName)}>
					#{item.TagName}
				</div>
			))}
		</>
	)
}

export default TagsList
