import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../utils/AuthProvider'
import EmptyMembers from '../Common/EmptyMembers'
import ArticleTab from './ArticleTab'

const ArticlesList = ({
	data = [],
	emptyText,
	saveArticle,
	removeSaveArticle,
	saving,
	likeArticle,
	unLikeArticle,
	liking,
	handleRefresh = () => {},
}) => {
	const { currentUserData, scrollToTop } = useContext(AuthContext)
	const navigate = useNavigate()

	const navigateToArticle = (id) => {
		scrollToTop()
		navigate(`/Articles/${id}`)
	}

	return (
		<>
			{data ? (
				<>
					{data.length > 0 ? (
						<>
							<div className='flex flex-col gap-4'>
								{data.map((item) => {
									return (
										<ArticleTab
										handleRefresh={handleRefresh}
											article={item}
											key={item.DocId}
											navigateToArticle={navigateToArticle}
											saveArticle={saveArticle}
											removeSaveArticle={removeSaveArticle}
											saving={saving}
											likeArticle={likeArticle}
											unLikeArticle={unLikeArticle}
											liking={liking}
										/>
									)
								})}
							</div>
						</>
					) : (
						<>
							<EmptyMembers emptyText={emptyText} />
						</>
					)}
				</>
			) : (
				<></>
			)}
		</>
	)
}

export default ArticlesList
