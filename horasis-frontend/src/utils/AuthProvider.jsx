import React, { useContext } from 'react'
import { _storeData, _retrieveData, _clearData, CURRENTUSERDATA, _clear } from './LocalStorage'
import { useRef } from 'react'

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
		ProfilePicture: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
	},
}
export const defaultUserData = {
	Token:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2xlIjoiQWRtaW4iLCJVc2VySWQiOiJBZG1pbiIsImlhdCI6MTcyMDMyOTk2MiwiZXhwIjoxNzIwMzM3MTYyfQ.hq3bJ8rzfziGjsgNTMeT7zuvfY3s_uE_6j0ZB1JvPNA',
	RefreshToken: '668a26eada3c3ba59c4af5c0',
	CurrentUser: {
		Role: 'Admin',
		UserId: 'Admin',
		RegistrationStatus: '',
		Subscription: null,
	},
}

export const defaultActivity = {
	_id: '66979bb131dbe239dd62f58b',
	NoOfLikes: 0,
	Content: 'hello',
	UserId: '6691384f0ab9f7e0c053b73a',
	MediaFiles: [
		{
			FileUrl:
				'https://oxydebug.sgp1.cdn.digitaloceanspaces.com/6691384f0ab9f7e0c053b73a/66979bb031dbe239dd62f58a/335850.jpg?17212118255072811',
			Type: 'image',
		},
	],
	Documents: [
		'https://oxydebug.sgp1.cdn.digitaloceanspaces.com/6691384f0ab9f7e0c053b73a/66979bb031dbe239dd62f58a/Aswin Das R.pdf?17212118256386839',
	],
	NoOfComments: 0,
	LikedIds: [],
	Mentions: [],
	CreatedIndex: 1721211825638,
	Index: '1721211825639',
	DocId: '66979bb131dbe239dd62f58b',
	NextId: '1721211825639--66979bb131dbe239dd62f58b',
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

	const logout = () => {
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
