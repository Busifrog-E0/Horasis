import { useState } from 'react'
import EmptyMembers from '../../../Common/EmptyMembers'
import InsightSearchSectionTab from './InsightSearchSectionTab'

const InsightsSearchSection = ({
	insights,
	emptyText,
	updateList,
	whichTime,
	tabName,
}) => {
	const [updatingId, setUpdatingId] = useState(null)

	return (
		<>
			<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
				<div className='flex flex-col gap-5'>
					{insights ? (
						<>
							{insights.length > 0 ? (
								<>
									{insights.map((item, index) => {
										let lastElement = insights.length === index + 1
										return (
											<InsightSearchSectionTab key={index} insight={item}
												lastElement={lastElement}
												updateList={(actionType) => {

												}}
												whichTime={whichTime}
												updatingId={updatingId}
												tabName={tabName} />
										)
									})}
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
				</div>


			</div>
		</>
	)
}

export default InsightsSearchSection
