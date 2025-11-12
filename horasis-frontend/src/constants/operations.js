import axios from 'axios'
import { CURRENTUSERDATA, SUPERUSERDATA, _retrieveData } from '../utils/LocalStorage'

export const DEBUG_API = 'https://deploy.busifrog.com/'
export const PRODUCTION_API = 'https://deploy.busifrog.com/'
export const isDebug = false
export const userLogout = async (Token, RefreshToken, debug = false) => {
	const API_URL = debug ? DEBUG_API : PRODUCTION_API

	axios
		.post(
			`${API_URL}api/UserLogout`,
			{ Token, RefreshToken },
			{
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',
					Authorization: `Bearer`,
				},
				mode: 'no-cors',
			}
		)
		.then(async (result) => {
			localStorage.clear()
			window.location.reload()
		})
		.catch(async (result) => {
			localStorage.clear()
			window.location.reload()
		})
}

const refreshToken = async (updateCurrentUser, currentUserData, role, debug) => {
	const tokenToBeRefreshed =
		role === 'user'
			? _retrieveData(CURRENTUSERDATA)
				? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
				: null
			: _retrieveData(SUPERUSERDATA)
				? JSON.parse(_retrieveData(SUPERUSERDATA)).Token
				: null

	const refreshToken =
		role === 'user'
			? _retrieveData(CURRENTUSERDATA)
				? JSON.parse(_retrieveData(CURRENTUSERDATA)).RefreshToken
				: null
			: _retrieveData(SUPERUSERDATA)
				? JSON.parse(_retrieveData(SUPERUSERDATA)).RefreshToken
				: null

	const API_URL = debug ? DEBUG_API : PRODUCTION_API

	await axios
		.post(
			API_URL + 'api/' + 'RefreshToken',
			{
				Token: tokenToBeRefreshed,
				RefreshToken: refreshToken,
			},
			{
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${tokenToBeRefreshed}`,
				},
				mode: 'no-cors',
			}
		)
		.then(async (result) => {
			await updateCurrentUser({ ...currentUserData, ...result.data })
		})
		.catch(async (err) => {
			if (err.response) {
				if (err.response.status === 445) {
					userLogout(tokenToBeRefreshed, refreshToken, debug)
				}
			}
		})
}

export const postItem = async (
	url,
	data,
	successCallback,
	errorCallback,
	updateCurrentUser,
	currentUserData,
	toast = { open: () => { }, close: () => { } },
	role = 'user',
	debug = false
) => {
	const API_URL = debug ? DEBUG_API : PRODUCTION_API
	const useToken =
		role === 'user'
			? _retrieveData(CURRENTUSERDATA)
				? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
				: null
			: _retrieveData(SUPERUSERDATA)
				? JSON.parse(_retrieveData(SUPERUSERDATA)).Token
				: null
	axios
		.post(API_URL + 'api/' + url, data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${useToken}`,
			},
			mode: 'no-cors',
		})
		.then((result) => {
			if (result.status === 244) {
				if (typeof result.data === 'string') {
					toast.open('success', 'Success', result.data)
				} else {
					toast.open('success', result.data.Header, result.data.Message)
				}
				successCallback(result.data)
			}
			successCallback(result.data)
		})
		.catch(async (err) => {
			if (err.response) {
				if (err.response.status === 401) {
					await refreshToken(updateCurrentUser, currentUserData, role, debug)
					// await apiCallback()
					await postItem(
						url,
						data,
						successCallback,
						errorCallback,
						updateCurrentUser,
						currentUserData,
						toast,
						role,
						debug
					)
				} else if (err.response.status === 444) {
					if (typeof err.response.data === 'string') {
						toast.open('error', 'Error', err.response.data)
					} else {
						toast.open('error', err.response.data.Header, err.response.data.Message)
					}
					errorCallback(err.response.data)
				} else if (err.response.status === 445) {
					userLogout(currentUserData.Token, currentUserData.RefreshToken, debug)
				} else {
					errorCallback(err.response.data)
				}
			} else {
				errorCallback('Something happened!')
			}
		})
}

export const patchItem = async (
	url,
	data,
	successCallback,
	errorCallback,
	updateCurrentUser,
	currentUserData,
	toast = { open: () => { }, close: () => { } },
	role = 'user',
	debug = false
) => {
	const API_URL = debug ? DEBUG_API : PRODUCTION_API
	const useToken =
		role === 'user'
			? _retrieveData(CURRENTUSERDATA)
				? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
				: null
			: _retrieveData(SUPERUSERDATA)
				? JSON.parse(_retrieveData(SUPERUSERDATA)).Token
				: null
	axios
		.patch(API_URL + 'api/' + url, data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${useToken}`,
			},
			mode: 'no-cors',
		})
		.then((result) => {
			if (result.status === 244) {
				if (typeof result.data === 'string') {
					toast.open('success', 'Success', result.data)
				} else {
					toast.open('success', result.data.Header, result.data.Message)
				}
				successCallback(result.data)
			}
			successCallback(result.data)
		})
		.catch(async (err) => {
			if (err.response) {
				if (err.response.status === 401) {
					await refreshToken(updateCurrentUser, currentUserData, role, debug)
					patchItem(url, data, successCallback, errorCallback, updateCurrentUser, currentUserData, toast, role, debug)
				} else if (err.response.status === 444) {
					errorCallback(err.response.data)
					if (typeof err.response.data === 'string') {
						toast.open('error', 'Error', err.response.data)
					} else {
						toast.open('error', err.response.data.Header, err.response.data.Message)
					}
				} else if (err.response.status === 445) {
					userLogout(currentUserData.Token, currentUserData.RefreshToken, debug)
				} else {
					errorCallback(err.response.data)
				}
			} else {
				errorCallback('Something happened!')
			}
		})
}

export const deleteItem = async (
	url,
	successCallback,
	errorCallback,
	updateCurrentUser,
	currentUserData,
	toast = { open: () => { }, close: () => { } },
	role = 'user',
	debug = false
) => {
	const API_URL = debug ? DEBUG_API : PRODUCTION_API
	const useToken =
		role === 'user'
			? _retrieveData(CURRENTUSERDATA)
				? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
				: null
			: _retrieveData(SUPERUSERDATA)
				? JSON.parse(_retrieveData(SUPERUSERDATA)).Token
				: null

	axios
		.delete(API_URL + 'api/' + url, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${useToken}`,
			},
			mode: 'no-cors',
		})
		.then((result) => {
			if (result.status === 244) {
				if (typeof result.data === 'string') {
					toast.open('success', 'Success', result.data)
				} else {
					toast.open('success', result.data.Header, result.data.Message)
				}
				successCallback(result.data)
			}
			successCallback(result.data)
		})
		.catch(async (err) => {
			if (err.response) {
				if (err.response.status === 401) {
					await refreshToken(updateCurrentUser, currentUserData, role, debug)
					deleteItem(url, successCallback, errorCallback, updateCurrentUser, currentUserData, toast, role, debug)
				} else if (err.response.status === 444) {
					errorCallback(err.response.data)
					if (typeof err.response.data === 'string') {
						toast.open('error', 'Error', err.response.data)
					} else {
						toast.open('error', err.response.data.Header, err.response.data.Message)
					}
				} else if (err.response.status === 445) {
					userLogout(currentUserData.Token, currentUserData.RefreshToken, debug)
				} else {
					errorCallback(err.response.data)
				}
			} else {
				errorCallback('Something happened!')
			}
		})
}

export const getItem = async (
	url,
	successCallback,
	errorCallback,
	updateCurrentUser,
	currentUserData,
	toast = { open: () => { }, close: () => { } },
	role = 'user',
	debug = false
) => {
	const API_URL = debug ? DEBUG_API : PRODUCTION_API
	const useToken =
		role === 'user'
			? _retrieveData(CURRENTUSERDATA)
				? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
				: null
			: _retrieveData(SUPERUSERDATA)
				? JSON.parse(_retrieveData(SUPERUSERDATA)).Token
				: null
	axios
		.get(API_URL + 'api/' + url, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${useToken}`,
			},
			mode: 'no-cors',
		})
		.then((result) => {
			if (result.status === 244) {
				if (typeof result.data === 'string') {
					toast.open('success', 'Success', result.data)
				} else {
					toast.open('success', result.data.Header, result.data.Message)
				}
				successCallback(result.data)
			}
			successCallback(result.data)
		})
		.catch(async (err) => {
			if (err.response) {
				if (err.response.status === 401) {
					await refreshToken(updateCurrentUser, currentUserData, role, debug)
					getItem(url, successCallback, errorCallback, updateCurrentUser, currentUserData, toast, role, debug)
				} else if (err.response.status === 444) {
					errorCallback(err.response.data)
					if (typeof err.response.data === 'string') {
						toast.open('error', 'Error', err.response.data)
					} else {
						toast.open('error', err.response.data.Header, err.response.data.Message)
					}
				} else if (err.response.status === 445) {
					userLogout(currentUserData.Token, currentUserData.RefreshToken, debug)
				} else {
					errorCallback(err.response.data)
				}
			} else {
				errorCallback('Something happened!')
			}
		})
}
