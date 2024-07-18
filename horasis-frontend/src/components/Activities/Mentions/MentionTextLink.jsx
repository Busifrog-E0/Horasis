import { useNavigate } from 'react-router-dom'

const mentionPattern = /(?<=\s|^)@([\w.]+)/g
function parseContent(singleActivity) {
	const content = singleActivity.Content
	const mentions = singleActivity.Mentions
	const parts = content.split(mentionPattern)
	const navigate = useNavigate()

	return parts.map((part, index) => {
		const mention = mentions.find((m) => m.Username === part)
		if (mention) {
			return (
				<a
					key={index}
					onClick={() => navigate(`/ViewProfile/${mention.UserId}`)}
					className='text-system-primary-accent cursor-pointer'>
					{mention.FullName}
				</a>
			)
		}

		return <span key={index}>{part}</span>
	})
}
const MentionTextLink = ({ singleActivity }) => {
	return <h4 className='text-system-primary-text font-medium text-xl'>{parseContent(singleActivity)}</h4>
}

export default MentionTextLink
