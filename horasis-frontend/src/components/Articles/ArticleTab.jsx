import { useState } from 'react'
import save from '../../assets/icons/graysave.svg'
import saved from '../../assets/icons/graysavefill.svg'
import like from '../../assets/icons/like.svg'
import liked from '../../assets/icons/liked.svg'
import ViewLikedMembers from '../../components/Activities/Likes/ViewLikedMembers'
import useEntityLikeManager from '../../hooks/useEntityLikeManager'
import useEntitySaveManager from '../../hooks/useEntitySaveManager'
import useGetData from '../../hooks/useGetData'
import { relativeTime } from '../../utils/date'
import Spinner from '../ui/Spinner'

const ArticleTab = ({
	article,
	navigateToArticle,
	saveArticle,
	removeSaveArticle,
	saving,
	from = 'article',
	liking,
	iconSize = '6',
	likeArticle,
	unLikeArticle,
}) => {
	const [singleArticle, setSingleArticle] = useState(article)

	const { isLoading: isLoadingArticle, getData: getSingleArticle } = useGetData(
		`articles/${singleArticle ? singleArticle.DocId : article.DocId}`,
		{
			onSuccess: (result) => setSingleArticle(result),
		},
		false
	)

	const { isLiking, isUnliking, likeEntity, unlikeEntity } = useEntityLikeManager({
		EntityId: singleArticle ? singleArticle.DocId : article.DocId,
		Type: 'Article',
		successCallback: getSingleArticle,
		errorCallback: () => {},
	})
	const { isSaving, isUnsaving, saveEntity, unsaveEntity } = useEntitySaveManager({
		EntityId: singleArticle ? singleArticle.DocId : article.DocId,
		Type: 'Article',
		successCallback: getSingleArticle,
		errorCallback: () => {},
	})

	if (singleArticle) {
		return (
			<div
				className='p-0 bg-system-secondary-bg rounded-lg cursor-pointer shadow-lg'
				onClick={() => navigateToArticle(singleArticle.DocId)}>
				{isLoadingArticle && (
					<div
						style={{ zIndex: 1000 }}
						className='absolute top-0 bottom-0 right-0 left-0 flex flex-col justify-center items-center'>
						<Spinner />
					</div>
				)}
				<div className='h-52 overflow-hidden rounded-t-lg'>
					<img src={singleArticle.CoverPicture} className='object-cover h-full w-full' />
				</div>
				<div className='px-5 pb-5 flex justify-between mt-2'>
					<div>
						<h4 className='font-semibold text-lg text-system-primary-accent'>{singleArticle.ArticleName}</h4>
						<h4 className='text-xs text-system-primary-accent'>by {singleArticle.UserDetails.FullName}</h4>
						<h4 className='text-sm text-brand-gray-dim mt-2'>{relativeTime(singleArticle.CreatedIndex)}</h4>
						<div className='mt-1'>
							<div className='flex items-center justify-between gap-10'>
								<div className='flex flex-wrap items-start justify-between gap-10'>
									<div className='flex items-start gap-1 cursor-pointer'>
										{isLiking || isUnliking ? (
											<Spinner />
										) : (
											<div className='flex items-center gap-2'>
												{singleArticle.HasLiked ? (
													<img
														src={liked}
														className={`h-${iconSize} w-${iconSize} cursor-pointer text-system-error`}
														onClick={(e) => {
															e.stopPropagation()
															unlikeEntity()
														}}
													/>
												) : (
													<img
														src={like}
														className={`h-${iconSize} w-${iconSize} cursor-pointer`}
														onClick={(e) => {
															e.stopPropagation()
															likeEntity()
														}}
													/>
												)}
												<ViewLikedMembers entity={singleArticle} />
											</div>
										)}
									</div>
									{/* <div className='flex items-start gap-1 cursor-pointer'>
										<div
											className='flex items-center gap-2'
											onClick={(e) => {
												e.stopPropagation()
												navigate(`/Articles/${singleArticle.DocId}`, { state: { scrollToComments: true } })
											}}>
											<img src={reply} className={`h-${iconSize} w-${iconSize} `} />
											<p className={`text-brand-gray-dim mt-1`}>{singleArticle.NoOfComments} replies</p>
										</div>
									</div> */}
								</div>
							</div>
						</div>
					</div>
					<div className={`${from === 'article' ? 'block' : 'hidden'}`}>
						{isSaving || isUnsaving ? (
							<>
								<Spinner />
							</>
						) : (
							<>
								{singleArticle.HasSaved ? (
									<>
										<img
											src={saved}
											alt=''
											className='h-8'
											onClick={(e) => {
												e.stopPropagation()
												unsaveEntity()
											}}
										/>
									</>
								) : (
									<>
										<img
											src={save}
											alt=''
											className='h-8'
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
				</div>
			</div>
		)
	}
}

export default ArticleTab
