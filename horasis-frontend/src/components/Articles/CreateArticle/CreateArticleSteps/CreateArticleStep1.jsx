import { useState } from 'react'
import Input from '../../../ui/Input'
import TextArea from '../../../ui/TextArea'
import useGetList from '../../../../hooks/useGetList'
import { SearchTags, SelectedTag } from '../../../Profile/AboutProfile'

const CreateArticleStep1 = ({ postArticleData, setPostArticleData, validateSingle, errorObj }) => {
	const addTag = (tag) => {
		setPostArticleData((prev) => {
			const tagExists = prev.Tags.some((existingTag) => existingTag.DocId === tag.DocId)
			if (tagExists) return prev

			return { ...prev, Tags: [...prev.Tags, tag] }
		})
	}

	const removeTag = (tag) => {
		setPostArticleData((prev) => {
			return { ...prev, Tags: prev.Tags.filter((interest) => interest.DocId !== tag.DocId) }
		})
	}

	const { data: tagsList } = useGetList('tags', { Limit: -1 })
	return (
		<div className='flex flex-col gap-4'>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Article Name<span className='text-brand-red'>*</span>
				</h1>
				<Input
					placeholder='Article name'
					width='full'
					variant='primary_outlined'
					value={postArticleData.ArticleName}
					onChange={(e) => {
						validateSingle({ ['ArticleName']: e.target.value }, 'ArticleName')
					}}
				/>
				{errorObj['ArticleName'] != undefined && <p className='text-brand-red m-0'>{errorObj['ArticleName']}</p>}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Article Description<span className='text-brand-red'>*</span>
				</h1>
				<TextArea
					rows={6}
					placeholder='Article description'
					width='full'
					variant='primary_outlined'
					value={postArticleData.Description}
					onChange={(e) => {
						validateSingle({ ['Description']: e.target.value }, 'Description')
					}}
				/>
				{errorObj['Description'] != undefined && <p className='text-brand-red m-0'>{errorObj['Description']}</p>}
			</div>

			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>Tags</h1>
				{postArticleData.Tags && postArticleData.Tags.length > 0 && (
					<div className='flex gap-4 px-0 pb-4 my-2 flex-wrap'>
						{postArticleData.Tags.map((interest) => {
							return <SelectedTag tag={interest} removeTag={removeTag} key={interest.DocId} />
						})}
					</div>
				)}

				<div className='px-0'>
					<SearchTags data={tagsList} addTag={addTag} placeholder='Add tags to article' />
				</div>
			</div>
		</div>
	)
}

export default CreateArticleStep1
