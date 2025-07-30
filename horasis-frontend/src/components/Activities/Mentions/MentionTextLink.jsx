import { useNavigate } from 'react-router-dom'

const MentionTextLink = ({ descriptionSize='text-md', singleActivity }) => {

	const mentionPattern = /(?<=\s|^)@([\w.]+)/g
	function parseContent(singleActivity) {
		const content = singleActivity.Content
		const mentions = singleActivity.Mentions
		const parts = content.split(mentionPattern)
		const navigate = useNavigate()

		return parts.map((part, index) => {
			if (mentions && mentions.length > 0) {
				const mention = mentions.find((m) => m.Username === part)
				if (mention) {
					return (
						<a
							key={index}
							onClick={() => navigate(`/ViewProfile/${mention.UserId}`)}
							className={`text-system-primary-accent-transparent cursor-pointer bg-system-primary-accent-light px-1 rounded-md hover:text-system-primary-accent ${descriptionSize}`}>
							{mention.FullName}
						</a>
					)
				}
			}

			return <span key={index} className={`${descriptionSize}`}>{part}</span>
		})
	}

	return <p className={`text-system-primary-text m-0 leading-relaxed whitespace-pre-line ${descriptionSize}`}>{parseContent(singleActivity)}</p>
}

export default MentionTextLink
