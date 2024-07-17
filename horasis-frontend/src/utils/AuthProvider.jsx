import React from 'react';
import { _storeData, _retrieveData, _clearData, CURRENTUSERDATA } from './LocalStorage';
import { useRef } from 'react';

export const AuthContext = React.createContext();
export const defaultProfile = {
    "OrganizationName": "",
    "About": "",
    "ContactEmail": "",
    "ContactName": "",
    "WhatsappNumber": null,
    "ContactDesignation": "",
    "PhoneNumber": "",
    "RegistrationNumber": "",
    "EmployerType": "Our company",
    "Industry": "",
    "Address": {},
    "MonthlyTurnover": "",
    "NoOfEmployees": null,
    "NoOfBranches": null,
    "BranchLocation": "District-wide",
    "Website": "",
    "YearOfLaunch": "",
    "BusinessProofImg": "",
    "ProofOfServiceImg": "",
    "OrganizationPhotos": [],
    "SocialMediaLinks": {
        "Facebook": "",
        "Instagram": "",
        "Twitter": "",
        "LinkedIn": "",
        "YouTube": ""
    },
}
export const defaultUserData = {
    "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2xlIjoiQWRtaW4iLCJVc2VySWQiOiJBZG1pbiIsImlhdCI6MTcyMDMyOTk2MiwiZXhwIjoxNzIwMzM3MTYyfQ.hq3bJ8rzfziGjsgNTMeT7zuvfY3s_uE_6j0ZB1JvPNA",
    "RefreshToken": "668a26eada3c3ba59c4af5c0",
    "CurrentUser": {
        "Role": "Admin",
        "UserId": "Admin",
        "RegistrationStatus": "",
        "Subscription": null
    }
}

export const defaultPostData = (UserId) => ({
    "Content": "",
    "UserId": UserId,
    "MediaFiles": [],
    "Documents": []
})
export const AuthProvider = ({ children }) => {

    const scrollRef = useRef()


    const [currentUserData, setCurrentUserData] = React.useState(_retrieveData(CURRENTUSERDATA) ? JSON.parse(_retrieveData(CURRENTUSERDATA)) : null);
    const [currentUserProfile, setCurrentUserProfile] = React.useState(defaultProfile);
    const postScrollView = useRef(null);

    const postScrollIntoView = () => {
        if (postScrollView.current) {
            console.log("SCROlL")
            postScrollView.current.scrollTo({ behavior: 'smooth', });
        }
    }
    const regScrollView = useRef(null);
    const regScrollIntoView = () => {

        if (regScrollView.current) {
            regScrollView.current.scrollIntoView({ behavior: 'smooth' });
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
                scrollRef, scrollToTop,
                postScrollIntoView, postScrollView,
                regScrollIntoView, regScrollView,
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export const defaultUser = {
    CurrentUser: {
        Role: "",
        UserId: "",
        RegistrationStatus: "InCompleted",
        Subscription: null
    },
    Token: "12345678910",
    RefreshToken: "12345678910"
}
