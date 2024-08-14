import { useState } from 'react'
import Input from '../../../ui/Input'
import TextArea from '../../../ui/TextArea'

const CreateArticleStep1 = ({ postArticleData, setPostDiscussionData, validateSingle, errorObj }) => {
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
		</div>
	)
}

export default CreateArticleStep1
