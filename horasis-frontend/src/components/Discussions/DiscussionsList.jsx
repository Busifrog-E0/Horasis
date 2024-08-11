import { useContext } from 'react'
import EmptyMembers from '../Common/EmptyMembers'
import { AuthContext } from '../../utils/AuthProvider'
import { useNavigate } from 'react-router-dom'
import DiscussionTab from './DiscussionTab'

const DiscussionsList = ({ cols = 3, gap = 'gap-1 lg:gap-4', data = [], emptyText, fetch, updateList }) => {
	const { currentUserData, scrollToTop } = useContext(AuthContext)
	const navigate = useNavigate()

	const GoToSingleDiscussion = (id) => {
		scrollToTop()
		navigate(`/discussions/${id}`)
	}

	return (
		<>
			{data ? (
				<>
					{data.length > 0 ? (
						<>
							<div className={`grid ${cols} ${gap}`}>
								{data.map((item) => {
									return (
										<DiscussionTab
											discussion={item}
											key={item.DocId}
											onClick={() => GoToSingleDiscussion(item.DocId)}
											fetch={fetch}
											updateList={updateList}
											data={data}
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

export default DiscussionsList
