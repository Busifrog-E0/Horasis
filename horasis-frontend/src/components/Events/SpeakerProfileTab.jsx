import { useState, useRef, useEffect } from 'react'
import avatar from '../../assets/icons/avatar.svg'

const SpeakerProfileTab = ({ profile, agenda }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const aboutText = profile.About || 'Speaker about is not available'

	const nameRef = useRef(null)
	const jobTitleRef = useRef(null)
	const companyRef = useRef(null)

	const [showNameTooltip, setShowNameTooltip] = useState(false)
	const [showJobTitleTooltip, setShowJobTitleTooltip] = useState(false)
	const [showCompanyTooltip, setShowCompanyTooltip] = useState(false)

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded)
	}

	useEffect(() => {
		if (nameRef.current) {
			setShowNameTooltip(nameRef.current.scrollWidth > nameRef.current.clientWidth)
		}
		if (jobTitleRef.current) {
			setShowJobTitleTooltip(jobTitleRef.current.scrollWidth > jobTitleRef.current.clientWidth)
		}
		if (companyRef.current) {
			setShowCompanyTooltip(companyRef.current.scrollWidth > companyRef.current.clientWidth)
		}
	}, [profile])

	return (
		<div className='bg-system-secondary-bg border rounded-xl  overflow-hidden flex flex-col hover:shadow-sm transition-shadow'>
			{agenda?.Name && (
				<div className='border-b text-system-primary-accent px-4 py-2 text-md font-medium rounded-t-xl'>
					{agenda.Name}
				</div>
			)}
			<div className='p-4 flex flex-col h-full'>
				<div className='flex items-center gap-4'>
					<div className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0'>
						{profile.ProfilePicture ? (
							<img className='w-full h-full object-cover' src={profile.ProfilePicture} alt='Speaker Avatar' />
						) : (
							<img className='w-full h-full object-cover' src={avatar} alt='Default Avatar' />
						)}
					</div>
					<div className='flex flex-col flex-grow relative'>
						<div className='relative'>
							<h4
								ref={nameRef}
								className='font-semibold text-lg text-system-primary-text truncate max-w-[200px] cursor-pointer'
								title={showNameTooltip ? profile.FullName : ''}>
								{profile.FullName}
							</h4>
							{showNameTooltip && (
								<div className='absolute top-full left-0 z-10 bg-gray-800 text-white text-sm p-2 rounded-md hidden group-hover:block'>
									{profile.FullName}
								</div>
							)}
						</div>
						{profile.JobTitle && (
							<div className='relative'>
								<p
									ref={jobTitleRef}
									className='text-sm text-system-secondary-text truncate max-w-[200px] cursor-pointer'
									title={showJobTitleTooltip ? profile.JobTitle : ''}>
									{profile.JobTitle}
								</p>
								{showJobTitleTooltip && (
									<div className='absolute top-full left-0 z-10 bg-gray-800 text-white text-sm p-2 rounded-md hidden group-hover:block'>
										{profile.JobTitle}
									</div>
								)}
							</div>
						)}
						{profile.Company && (
							<div className='relative'>
								<p
									ref={companyRef}
									className='text-sm text-system-secondary-text truncate max-w-[200px] cursor-pointer'
									title={showCompanyTooltip ? profile.Company : ''}>
									{profile.Company}
								</p>
								{showCompanyTooltip && (
									<div className='absolute top-full left-0 z-10 bg-gray-800 text-white text-sm p-2 rounded-md hidden group-hover:block'>
										{profile.Company}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				<div className='flex-grow relative group'>
					<p
						className={`text-sm text-system-primary-text mt-2 leading-relaxed whitespace-pre-line overflow-hidden transition-all duration-300 cursor-pointer `}>
						{aboutText}
					</p>
				</div>
			</div>
		</div>
	)
}

export default SpeakerProfileTab
