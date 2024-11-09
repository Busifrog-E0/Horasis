import { relativeTime } from '../../utils/date'
import DropdownMenu from '../ui/DropdownMenu'
import save from '../../assets/icons/graysave.svg'
import saved from '../../assets/icons/graysavefill.svg'
import Spinner from '../ui/Spinner'
import liked from '../../assets/icons/liked.svg'
import like from '../../assets/icons/like.svg'
import reply from '../../assets/icons/reply.svg'
import ViewLikedMembers from '../../components/Activities/Likes/ViewLikedMembers'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
	const navigate = useNavigate()

	return (
		<div
			className='p-0 bg-system-secondary-bg rounded-lg cursor-pointer shadow-lg'
			onClick={() => navigateToArticle(article.DocId)}>
			<div className='h-52 overflow-hidden rounded-t-lg'>
				<img src={article.CoverPicture} className='object-cover h-full w-full' />
			</div>
			<div className='px-5 pb-5 flex justify-between mt-2'>
				<div>
					<h4 className='font-semibold text-lg text-system-primary-accent'>{article.ArticleName}</h4>
					<h4 className='text-xs text-system-primary-accent'>by {article.UserDetails.FullName}</h4>
					<h4 className='text-sm text-brand-gray-dim mt-2'>{relativeTime(article.CreatedIndex)}</h4>
					<div className='mt-1'>
						<div className='flex items-center justify-between gap-10'>
							<div className='flex flex-wrap items-start justify-between gap-10'>
								<div className='flex items-start gap-1 cursor-pointer'>
									{liking === article.DocId ? (
										<Spinner />
									) : (
										<div className='flex items-center gap-2'>
											{article.HasLiked ? (
												<img
													src={liked}
													className={`h-${iconSize} w-${iconSize} cursor-pointer text-system-error`}
													onClick={(e) => {
														e.stopPropagation()
														unLikeArticle(article.DocId)
													}}
												/>
											) : (
												<img
													src={like}
													className={`h-${iconSize} w-${iconSize} cursor-pointer`}
													onClick={(e) => {
														e.stopPropagation()
														likeArticle(article.DocId)
													}}
												/>
											)}
											<ViewLikedMembers entity={article} />
										</div>
									)}
								</div>
								{/* <div className='flex items-start gap-1 cursor-pointer'>
									<div
										className='flex items-center gap-2'
										onClick={(e) => {
											e.stopPropagation()
											navigate(`/Articles/${article.DocId}`, { state: { scrollToComments: true } })
										}}>
										<img src={reply} className={`h-${iconSize} w-${iconSize} `} />
										<p className={`text-brand-gray-dim mt-1`}>{article.NoOfComments} replies</p>
									</div>
								</div> */}
							</div>
						</div>
					</div>
				</div>
				<div className={`${from === 'article' ? 'block' : 'hidden'}`}>
					{saving === article.DocId ? (
						<>
							<Spinner />
						</>
					) : (
						<>
							{article.HasSaved ? (
								<>
									<img
										src={saved}
										alt=''
										className='h-8'
										onClick={(e) => {
											e.stopPropagation()
											removeSaveArticle(article.DocId)
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
											saveArticle(article.DocId)
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

export default ArticleTab
