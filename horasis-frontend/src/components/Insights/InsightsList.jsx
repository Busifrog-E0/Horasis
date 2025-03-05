import { useContext } from 'react'
import EmptyMembers from '../Common/EmptyMembers'
import { AuthContext } from '../../utils/AuthProvider'
import { useNavigate } from 'react-router-dom'
import ArticlesTab from '../Articles/ArticleTab'

const InsightsList = ({ data = [], emptyText }) => {
	const { currentUserData, scrollToTop } = useContext(AuthContext)
	const navigate = useNavigate()

	const GoToSingleInsight = (id) => {
		scrollToTop()
		navigate(`/Articles/${id}`)
	}

	return (
		<>
			{data ? (
				<>
					{data.length > 0 ? (
						<>
							<div className='flex flex-col gap-10'>
								{data.map((item, index) => {
									return <ArticlesTab article={item} key={index} navigateToArticle={GoToSingleInsight} from='search' />
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

export default InsightsList
