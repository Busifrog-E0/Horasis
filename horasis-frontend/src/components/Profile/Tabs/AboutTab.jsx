import { useState } from 'react'
import AboutProfile from '../AboutProfile'
import languages from '../../../assets/json/languages.json'
import { _retrieveData, _storeData } from '../../../utils/LocalStorage'

const AboutTab = ({ user, getUserDetails, isCurrentUser }) => {
	let storedLanguage = _retrieveData('currentLanguage')
	const [currentLanguage, setCurrentLanguage] = useState(storedLanguage ? storedLanguage : 'English')
	const [languageSelect, setLanguageSelect] = useState(false)
	const onLanguageSelect = (language) => {
		setLanguageSelect(false)
		setCurrentLanguage(language)
		_storeData('currentLanguage', language)
	}
	return (
		<>
			<AboutProfile user={user} getUserDetails={getUserDetails} isCurrentUser={isCurrentUser} />
			<div className='bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-lg mt-3 lg:mt-5'>
				{/* <div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
				<h4 className='font-medium text-lg text-system-primary-text'>Notification</h4>
				<h4 className='font-medium text-lg text-system-primary-accent'>ON</h4>
			</div> */}
				<div className='flex flex-row items-center justify-between'>
					<h4 className='font-medium text-lg text-system-primary-text'>Language</h4>
					<div className='font-medium text-lg text-system-primary-accent relative'>
						<p className='cursor-pointer' onClick={() => setLanguageSelect((prev) => !prev)}>
							{currentLanguage}
						</p>
						{languageSelect && (
							<>
								<div className='h-60 w-60 bg-system-secondary-bg shadow-lg absolute -top-1/2 -translate-y-full -left-1/2 -translate-x-1/2 overflow-y-scroll px-2'>
									{languages.languages.map((item) => {
										return (
											<p
												className='px-4 py-2 cursor-pointer hover:bg-system-primary-bg rounded-xl'
												onClick={() => onLanguageSelect(item.name)}>
												{item.name}
											</p>
										)
									})}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			{/* <div className='bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-lg mt-3 lg:mt-5'>
			<div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
				<h4 className='font-medium text-lg text-system-primary-text'>Security</h4>
			</div>
			<div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
				<h4 className='font-medium text-lg text-system-primary-text'>Help & Support</h4>
			</div>
			<div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
				<h4 className='font-medium text-lg text-system-primary-text'>Contact Us</h4>
			</div>
			<div className='flex flex-row items-center justify-between'>
				<h4 className='font-medium text-lg text-system-primary-text'>Privacy Policy</h4>
			</div>
		</div> */}
		</>
	)
}

export default AboutTab
