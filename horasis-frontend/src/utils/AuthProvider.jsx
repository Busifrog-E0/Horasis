import React, { useContext } from 'react'
import { _storeData, _retrieveData, _clearData, CURRENTUSERDATA, _clear } from './LocalStorage'
import { useRef } from 'react'
import { isDebug, userLogout } from '../constants/operations'

export const AuthContext = React.createContext()
export const defaultProfile = {
	OrganizationName: '',
	About: '',
	ContactEmail: '',
	ContactName: '',
	WhatsappNumber: null,
	ContactDesignation: '',
	PhoneNumber: '',
	RegistrationNumber: '',
	EmployerType: 'Our company',
	Industry: '',
	Address: {},
	MonthlyTurnover: '',
	NoOfEmployees: null,
	NoOfBranches: null,
	BranchLocation: 'District-wide',
	Website: '',
	YearOfLaunch: '',
	BusinessProofImg: '',
	ProofOfServiceImg: '',
	OrganizationPhotos: [],
	SocialMediaLinks: {
		Facebook: '',
		Instagram: '',
		Twitter: '',
		LinkedIn: '',
		YouTube: '',
	},
}
export const defaultComment = {
	Content: 'This is a sample comment content.',
	ParentId: '1234567890abcdef',
	UserId: 'user12345',
	DocId: 'comment12345',
	NoOfReplies: 5,
	Type: 'Comment',
	User: {
		FullName: 'Jane Doe',
		Username: 'janedoe',
		Email: 'jane.doe@example.com',
		DocId: 'abc123DEF',
		Country: 'Canada',
		City: 'Toronto',
		JobTitle: 'Product Manager',
		Industry: 'Software',
		CompanyName: 'InnovateTech',
		About: 'Seasoned product manager with over 10 years of experience in the software industry.',
		CoverPicture: 'string',
		ProfilePicture: '',
	},
}
export const defaultUserData = {
	Token: '',
	RefreshToken: '',
	CurrentUser: {
		Role: 'Admin',
		UserId: 'Admin',
		RegistrationStatus: '',
		Subscription: null,
	},
}

export const defaultActivity = {
	_id: '',
	NoOfLikes: 0,
	Content: '',
	UserId: '',
	MediaFiles: [
		{
			FileUrl: '',
			Type: 'image',
		},
	],
	Documents: [''],
	NoOfComments: 0,
	LikedIds: [],
	Mentions: [],
	CreatedIndex: '',
	Index: '',
	DocId: '',
	NextId: '',
}

export const defaultPostData = (UserId) => ({
	Content: '',
	UserId: UserId,
	MediaFiles: [],
	Documents: [],
})

export const defaultCommentData = (UserId, ParentId) => ({
	Content: '',
	UserId: UserId,
	ParentId: ParentId,
})
export const AuthProvider = ({ children }) => {
	const scrollRef = useRef()

	const [currentUserData, setCurrentUserData] = React.useState(
		_retrieveData(CURRENTUSERDATA) ? JSON.parse(_retrieveData(CURRENTUSERDATA)) : null
	)
	const [currentUserProfile, setCurrentUserProfile] = React.useState(defaultProfile)
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
		let User = _retrieveData(CURRENTUSERDATA)
		setCurrentUserData(User ? JSON.parse(User) : null)
	}

	const updateCurrentUser = (User) => {
		if (!User.Token || !User.RefreshToken) {
			User.Token = currentUserData.Token
			User.RefreshToken = currentUserData.RefreshToken
		}
		_storeData(CURRENTUSERDATA, JSON.stringify(User))
		setCurrentUserData(User)
	}

	const logout = async () => {
		await userLogout(currentUserData.Token, currentUserData.RefreshToken, isDebug)
		_clearData(CURRENTUSERDATA)
		_clear()
		setCurrentUserData(null)
		setCurrentUserProfile(defaultProfile)
	}
	const scrollToTop = () => scrollRef.current.scrollIntoView()

	return (
		<AuthContext.Provider
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
		</AuthContext.Provider>
	)
}
export const useAuth = () => useContext(AuthContext)

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
