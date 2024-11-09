import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import arrowfor from '../../assets/icons/arrowfor.svg'
import saveOutline from '../../assets/icons/graysave.svg'
import saveFill from '../../assets/icons/graysavefill.svg'
import useEntitySaveManager from '../../hooks/useEntitySaveManager'
import useGetData from '../../hooks/useGetData'
import useGetList from '../../hooks/useGetList'
import EmptyMembers from '../Common/EmptyMembers'
import Spinner from '../ui/Spinner'

const SavedArticlesTab = ({ bordered = false, loadMoreEnabled = false, iconPresent = true }) => {
	const {
		data: articles,
		isLoading,
		isLoadingMore,
		isPageDisabled,
		setData: setArticles,
		getList: getArticles,
	} = useGetList(`saves`, { Limit: 5, Type: 'Article' }, loadMoreEnabled, true, false, [])

	const navigate = useNavigate()

	const onDelete = (DocId) => {
		console.log(DocId)
		setArticles(articles.filter((d) => d.DocId !== DocId))
	}

	const navigateToArticle = (id) => {
		navigate(`/Articles/${id}`)
	}

	return (
		<div className='p-5 bg-system-secondary-bg rounded-lg'>
			<div className='flex items-center justify-between gap-2 mb-1'>
				<h4 className='font-medium text-2xl text-system-primary-text'>Saved Articles</h4>
				{iconPresent && articles.length > 0 && (
					<img src={arrowfor} alt='' className='h-6 w-6 cursor-pointer' onClick={() => navigate('/SavedArticles')} />
				)}
				{/* arrow cursor-pointer */}
			</div>
			<div>
				{isLoading ? (
					<Spinner />
				) : articles.length > 0 ? (
					<>
						{articles.map((article, index) => {
							let lastItem = articles.length - 1 === index
							return (
								<SavedArticleItem
									article={article}
									lastItem={lastItem}
									navigateToArticle={navigateToArticle}
									key={article.DocId}
								/>
							)
						})}
					</>
				) : (
					<EmptyMembers emptyText={'No saved articles'} />
				)}
				{loadMoreEnabled && (
					<>
						{isLoadingMore && (
							<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
								<Spinner />
							</div>
						)}
						{!isPageDisabled && (
							<div onClick={() => getArticles(articles, false)} className='flex flex-row justify-end mt-4 mb-2'>
								<div className='cursor-pointer flex items-center gap-2'>
									<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

const SavedArticleItem = ({ article, lastItem, navigateToArticle }) => {
	const [singleArticle, setSingleArticle] = useState(article)

	const { getData: getSingleArticle } = useGetData(
		`articles/${article.DocId}`,
		{ onSuccess: (result) => setSingleArticle(result) },
		false
	)

	const { isSaving, isUnsaving, saveEntity, unsaveEntity } = useEntitySaveManager({
		EntityId: singleArticle ? singleArticle.DocId : article.DocId,
		Type: 'Article',
		successCallback: getSingleArticle,
		errorCallback: () => {},
	})
	if (singleArticle) {
		return (
			<>
				<div
					className={`mt-4 flex flex-row gap-2 cursor-pointer ${
						!lastItem ? 'border-b' : ''
					} pb-4 border-system-file-border`}
					onClick={() => navigateToArticle(singleArticle.DocId)}>
					<div className='h-16 w-28  overflow-hidden rounded-lg'>
						<img src={singleArticle.CoverPicture} className='object-cover h-full w-full' />
					</div>
					<div className='flex-1'>
						<h4 className='font-semibold text-sm text-system-primary-text'>{singleArticle.ArticleName}</h4>
						<div className='flex flex-row gap-3'>
							<p className='text-xs text-brand-gray-dim mt-1 line-clamp-1'>{singleArticle.Description}</p>
						</div>
					</div>
					{isSaving || isUnsaving ? (
						<div className=' self-end'>
							<Spinner />
						</div>
					) : (
						<>
							{singleArticle.HasSaved ? (
								<>
									<img
										src={saveFill}
										alt=''
										className='h-6 cursor-pointer self-end'
										onClick={(e) => {
											e.stopPropagation()
											unsaveEntity()
										}}
									/>
								</>
							) : (
								<>
									<img
										src={saveOutline}
										alt=''
										className='h-6 cursor-pointer self-end'
										onClick={(e) => {
											e.stopPropagation()
											saveEntity()
										}}
									/>
								</>
							)}
						</>
					)}
				</div>
			</>
		)
	}
}

export default SavedArticlesTab
