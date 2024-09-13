import { useRef, useState } from 'react'
import { _clearData, _retrieveData, _storeData, SUPERUSERDATA } from '../../utils/LocalStorage'
import SuperAuthContext from './SuperAuthService'

export const defaultUser = {
	CurrentUser: {
		Role: '',
		UserId: '',
		RegistrationStatus: 'InCompleted',
		Subscription: null,
	},
	Token: '12345678910',
	RefreshToken: '12345678910',
}

export const SuperAuthProvider = ({ children }) => {
	const scrollRef = useRef()

	const [currentUserData, setCurrentUserData] = useState(_retrieveData(SUPERUSERDATA) ? JSON.parse(_retrieveData(SUPERUSERDATA)) : null)
	const [currentUserProfile, setCurrentUserProfile] = useState(defaultUser)
	const postScrollView = useRef(null)

	const postScrollIntoView = () => {
		if (postScrollView.current) {
			console.log('SCROlL')
			postScrollView.current.scrollTo({ behavior: 'smooth' })
		}
	}
	const regScrollView = useRef(null)
	const regScrollIntoView = () => {
		if (regScrollView.current) {
			regScrollView.current.scrollIntoView({ behavior: 'smooth' })
		}
	}
	const getCurrentUser = () => {
		let User = _retrieveData(SUPERUSERDATA)
		setCurrentUserData(User ? JSON.parse(User) : null)
	}

	const updateCurrentUser = (User) => {
		if (!User.Token || !User.RefreshToken) {
			User.Token = currentUserData.Token
			User.RefreshToken = currentUserData.RefreshToken
		}
		_storeData(SUPERUSERDATA, JSON.stringify(User))
		setCurrentUserData(User)
	}

	const logout = () => {
		_clearData(SUPERUSERDATA)
		setCurrentUserData(null)
		setCurrentUserProfile(defaultProfile)
	}
	const scrollToTop = () => scrollRef.current.scrollIntoView()

	return (
		<SuperAuthContext.Provider
			value={{
				currentUserData,
				setCurrentUserData,
				currentUserProfile,
				setCurrentUserProfile,
				updateCurrentUser,
				logout,
				getCurrentUser,
				_storeData,
				_retrieveData,
				scrollRef,
				scrollToTop,
				postScrollIntoView,
				postScrollView,
				regScrollIntoView,
				regScrollView,
			}}>
			{children}
		</SuperAuthContext.Provider>
	)
}
