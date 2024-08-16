import { relativeTime } from '../../utils/date'
import DropdownMenu from '../ui/DropdownMenu'

const ArticleTab = ({ article, navigateToArticle }) => {
	return (
		<div className='p-0 bg-system-secondary-bg rounded-lg cursor-pointer' onClick={() => navigateToArticle(article.DocId)}>
			<div className='h-52 overflow-hidden rounded-t-lg'>
				<img src={article.CoverPicture} className='object-cover h-full w-full' />
			</div>
			<div className='px-5 pb-5'>
				<h4 className='font-semibold text-lg text-system-primary-accent mt-2'>{article.ArticleName}</h4>
				<h4 className='text-xs text-system-primary-accent'>by {article.UserDetails.FullName}</h4>
				<h4 className='text-sm text-brand-gray-dim mt-2'>{relativeTime(article.CreatedIndex)}</h4>
				{/* <div className='mt-1'>
						<div className='flex items-center justify-between gap-10'>
							<div className='flex flex-wrap items-start justify-between gap-10'>
								<div className='flex items-start gap-1 cursor-pointer'>
									<p className='text-brand-gray-dim mt-1'>likes</p>
								</div>
								<div className='flex items-start gap-1 cursor-pointer'>
									<p className='text-brand-gray-dim mt-1'>replies</p>
								</div>
							</div>
							<DropdownMenu />
						</div>
					</div> */}
			</div>
		</div>
	)
}

export default ArticleTab
