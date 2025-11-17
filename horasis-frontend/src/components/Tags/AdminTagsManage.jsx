import { useState } from 'react'
import deleteIcon from '../../assets/icons/delete.svg'
import EmptyMembers from '../Common/EmptyMembers'
import { deleteItem, postItem } from '../../constants/operations'
import useGetList from '../../hooks/useGetList'
import { useAuth } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import Spinner from '../ui/Spinner'
const AdminTagsManage = () => {
	const { currentUserData, updateCurrentUser } = useAuth()
	const toast = useToast()

	const [tagInput, setTagInput] = useState('')

	const { data: tags, isLoading, getList: getTags, setData: setTags } = useGetList('tags', { Limit: -1 }, false)

	const addTag = (e) => {
		e.preventDefault()
		if (tagInput.trim() === '') return // Prevent adding empty tags
		postItem(
			'tags',
			{ TagName: tagInput },
			(result) => {
				getTags([])
				setTagInput('')
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const deleteTag = (tagToDelete) => {
		setTags(tags.filter((tag) => tag !== tagToDelete))
		deleteItem(
			`tags/${tagToDelete.DocId}`,
			(result) => {
				getTags([])
			},
			(err) => {},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	return (
		<div className='max-w-full mx-auto sm:p-6 bg-white rounded-lg '>
			<h1 className='text-system-primary-text font-medium text-2xl'>Tags Manager</h1>

			<form onSubmit={addTag} className='flex my-4 flex-wrap gap-4 sm:gap-0'>
				<input
					type='text'
					value={tagInput}
					onChange={(e) => setTagInput(e.target.value)}
					className='flex-1 p-3 border border-gray-300 rounded-r-lg sm:rounded-r-none rounded-l-lg focus:outline-none  bg-system-secondary-bg transition'
					placeholder='Add a new tag'
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							addTag(e)
						}
					}}
				/>
				<button
					disabled={isLoading}
					type='submit'
					className='bg-system-primary-accent text-white px-10 py-3 rounded-l-lg sm:rounded-l-none rounded-r-lg hover:bg-system-primary-accent-dim transition duration-200'>
					Add Tag
				</button>
			</form>

			{isLoading ? (
				<Spinner />
			) : (
				<>
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
											<img src={deleteIcon} alt='' className='h-5' />
											{/* <span className='material-icons'>delete</span> */}
										</button>
									</div>
								))}
							</div>
						</>
					)}
				</>
			)}
		</div>
	)
}

export default AdminTagsManage
