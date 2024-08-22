import { useContext } from 'react'
import { AuthContext } from '../../utils/AuthProvider'
import { useNavigate } from 'react-router-dom'
import EventTab from './EventTab'
import EmptyMembers from '../Common/EmptyMembers'

const EventsList = ({ cols = 3, gap = 'gap-1 lg:gap-4', data = [], emptyText }) => {
	const { currentUserData, scrollToTop } = useContext(AuthContext)
	const navigate = useNavigate()

	const GoToSingleEvent = (id) => {
		scrollToTop()
		navigate(`/Events/${id}`)
	}

	return (
		<>
			{data ? (
				<>
					{data.length > 0 ? (
						<>
							<div className={`grid lg:grid-cols-${cols} ${gap}`}>
								{data.map((item, index) => {
									return <EventTab event={item} key={index} onClick={GoToSingleEvent} />
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

export default EventsList
