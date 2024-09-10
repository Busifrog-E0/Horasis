import React, { createContext, useContext, useState, useEffect } from 'react'
import AgoraRTM from 'agora-rtm-sdk'

export const AgoraRTMContext = createContext(null)

export const AgoraRTMProvider = ({ children }) => {
	const [client, setClient] = useState(null)

	return <AgoraRTMContext.Provider value={{ client, setClient }}>{children}</AgoraRTMContext.Provider>
}

export const useRTMClient = () => {
	return useContext(AgoraRTMContext)
}
