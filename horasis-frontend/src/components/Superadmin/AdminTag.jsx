import { useEffect, useState } from 'react'
import { useSuperAuth } from '../../context/SuperAdmin/SuperAuthService'
import { useToast } from '../Toast/ToastService'
import { deleteItem, getItem, patchItem, postItem } from '../../constants/operations'
import EmptyMembers from '../../components/Common/EmptyMembers'
import deleteIcon from '../../assets/icons/delete.svg'
const AdminTag = () => {
	const { currentUserData, updateCurrentUser } = useSuperAuth()
	const toast = useToast()

	const [tags, setTags] = useState([])
	const [tagInput, setTagInput] = useState('')

	const getTags = () => {
		getItem(
			`tags`,
			(result) => {
				setTags(result)
			},
			(err) => {
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast,
			'admin'
		)
	}

	useEffect(() => {
		getTags()
	}, [])

	const addTag = (e) => {
		e.preventDefault()
		if (tagInput.trim() === '') return // Prevent adding empty tags
		postItem(
			'tags',
			{ TagName: tagInput },
			(result) => {
				getTags()
				setTagInput('')
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast,
			'admin'
		)
	}

	const deleteTag = (tagToDelete) => {
		setTags(tags.filter((tag) => tag !== tagToDelete))
		deleteItem(
			`tags/${tagToDelete.DocId}`,
			(result) => {
				getTags()
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast,
			'admin'
		)
	}
	return (
		<div className='max-w-full mx-auto p-6 bg-white rounded-lg '>
			<h1 className='text-system-primary-text font-medium text-lg'>Tags Manager</h1>

			<form onSubmit={addTag} className='flex my-4'>
				<input
					type='text'
					value={tagInput}
					onChange={(e) => setTagInput(e.target.value)}
					className='flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none  bg-system-secondary-bg transition'
					placeholder='Add a new tag'
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							addTag(e)
						}
					}}
				/>
				<button
					type='submit'
					className='bg-system-primary-accent text-white px-10 py-3 rounded-r-lg hover:bg-system-primary-accent-dim transition duration-200'>
					Add Tag
				</button>
			</form>

			{tags.length === 0 ? (
				<>
					<EmptyMembers emptyText={'No Tags'} />
				</>
			) : (
				<>
					<div className='flex flex-wrap gap-3'>
						{tags.map((tag) => (
							<div
								key={tag.DocId}
								className='flex justify-between items-center px-6 py-2 bg-gray-100 rounded-full gap-4 transition-transform transform w-auto'>
								<span className='text-gray-800 font-medium'>{tag.TagName}</span>
								<button
									onClick={() => deleteTag(tag)}
									className='text-red-600 hover:text-red-700 font-semibold transition duration-200'>
									<img src={deleteIcon} alt='' className='h-6' />
									{/* <span className='material-icons'>delete</span> */}
								</button>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default AdminTag
