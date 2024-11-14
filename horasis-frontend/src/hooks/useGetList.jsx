import { useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthProvider'
import { jsonToQuery } from '../utils/searchParams/extractSearchParams'
import { getNextId } from '../utils/URLParams'
import { getItem } from '../constants/operations'
import { useToast } from '../components/Toast/ToastService'
import { runOnce } from '../utils/runOnce'

export default function useGetList(
	endpoint,
	extraParams = {},
	checkLeft = true,
	loadInitial = true,
	changeOnFilter = false,
	extraDependencies = []
) {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const [data, setData] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [isPageDisabled, setIsPageDisabled] = useState(true)

	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Keyword: '',
		Limit: 10,
		StartDate: null,
		EndDate: null,
	})

	function updateFilter(oby, kw, lt, sd, ed) {
		setFilters({
			OrderBy: oby,
			Keyword: kw,
			Limit: lt,
			StartDate: sd,
			EndDate: ed,
		})
	}

	const setLoadingState = (temp, value) => {
		if (temp.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}
	const dependencies = changeOnFilter ? [filters, ...extraDependencies] : [...extraDependencies]

	const getList = runOnce((temp, fromUpdate = true) => {
		const query = `${endpoint}?${jsonToQuery({ ...filters, ...extraParams })}&NextId=${getNextId(temp)}`
		setLoadingState(temp, true)
		getItem(
			query,
			(result) => {
				if (fromUpdate) {
					setData(result)
				} else {
					setData([...data, ...result])
				}
				setLoadingState(temp, false)
			},
			(err) => {
				console.log(err, 'error from get list')
				setLoadingState(temp, false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	})

	const checkMoreLeft = runOnce((temp) => {
		const query = `${endpoint}?${jsonToQuery({ ...filters, ...extraParams, Limit: 1 })}&NextId=${getNextId(temp)}`
		getItem(
			query,
			(result) => {
				if (result?.length > 0) {
					setIsPageDisabled(false)
				} else {
					setIsPageDisabled(true)
				}
			},
			(err) => {
				console.log(err, 'error from get list more')
				setIsPageDisabled(true)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	})

	useEffect(() => {
		if (loadInitial) {
			getList([])
		}
	}, dependencies)

	useEffect(() => {
		if (checkLeft) {
			if (data.length > 0) checkMoreLeft(data)
		}
	}, [data])

	return {
		data,
		setData,
		isLoading,
		isLoadingMore,
		isPageDisabled,
		filters,
		setFilters,
		updateFilter,
		getList,
	}
}
