import { useState, useRef, useEffect } from 'react'
import AboutProfile from '../AboutProfile'
import { _retrieveData, _storeData } from '../../../utils/LocalStorage'
import languagesData from '../../../assets/json/languages.json'

const AboutTab = ({ user, getUserDetails, isCurrentUser }) => {
	let storedLanguage = _retrieveData('currentLanguage')
	const [currentLanguage, setCurrentLanguage] = useState(storedLanguage ? storedLanguage : 'English')
	const [languageSelect, setLanguageSelect] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredLanguages, setFilteredLanguages] = useState(languagesData.languages)
	const dropdownRef = useRef(null)

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setLanguageSelect(false)
				setSearchTerm('')
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleSearchChange = (event) => {
		const term = event.target.value.toLowerCase()
		setSearchTerm(term)
		const filtered = languagesData.languages.filter((lang) => lang.name.toLowerCase().includes(term))
		setFilteredLanguages(filtered)
	}

	const onLanguageSelect = (language) => {
		setLanguageSelect(false)
		setCurrentLanguage(language)
		_storeData('currentLanguage', language)
		setSearchTerm('')
	}

	return (
		<>
			<AboutProfile user={user} getUserDetails={getUserDetails} isCurrentUser={isCurrentUser} />
			<div className='bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-lg mt-3 lg:mt-5' ref={dropdownRef}>
				<div className='flex flex-row items-center justify-between'>
					<h4 className='font-medium text-lg text-system-primary-text'>Language</h4>
					<div className='font-medium text-lg text-system-primary-accent relative'>
						<p className='cursor-pointer' onClick={() => setLanguageSelect((prev) => !prev)}>
							{currentLanguage}
						</p>
						{languageSelect && (
							<div className='absolute -top-1/2 -translate-y-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-system-secondary-bg shadow-lg rounded-xl overflow-hidden z-10'>
								<div className='p-2 border-b border-gray-300'>
									<input
										type='text'
										placeholder='Search languages'
										value={searchTerm}
										onChange={handleSearchChange}
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-system-primary-accent'
									/>
								</div>
								<div className='max-h-60 overflow-y-auto'>
									{filteredLanguages.map((item) => (
										<p
											key={item.code}
											className='px-4 py-2 cursor-pointer hover:bg-system-primary-bg'
											onClick={() => onLanguageSelect(item.name)}>
											{item.name}
										</p>
									))}
									{filteredLanguages.length === 0 && <p className='px-4 py-2 text-gray-500'>No languages found.</p>}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default AboutTab
