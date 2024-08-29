// export const jsonToQuery = (json) => {
//     console.log(json)
//     let result = Object.fromEntries(
//         Object.entries(json).map(([key, value]) => [
//             key === 'StartDate' ? 'Index[$gte]' : key === 'EndDate' ? 'Index[$lte]' : key,
//             value
//         ]).filter(([_, value]) => value !== undefined)
//     );

//     return new URLSearchParams(result);
// }

export const jsonToQuery = (json) => {
	let result = Object.entries(json).flatMap(([key, value]) => {
		if (Array.isArray(value)) {
			return value.map((v) => [key, v])
		} else if (value !== undefined && value !== '') {
			return [[key === 'StartDate' ? 'Index[$gte]' : key === 'EndDate' ? 'Index[$lte]' : key, value]]
		}
		return []
	})

	return new URLSearchParams(result)
}

export function extractSearchParams(searchParams) {
	const paramsObject = {}

	for (const [key, value] of searchParams) {
		if (paramsObject[key]) {
			if (Array.isArray(paramsObject[key])) {
				paramsObject[key].push(value)
			} else {
				paramsObject[key] = [paramsObject[key], value]
			}
		} else {
			paramsObject[key] = value
		}
	}

	return paramsObject
}

export const QueryToJson = (query) => {
	const params = new URLSearchParams(query)
	const obj = {}
	for (const [key, value] of params) {
		if (obj[key]) {
			if (Array.isArray(obj[key])) {
				obj[key].push(value)
			} else {
				obj[key] = [obj[key], value]
			}
		} else {
			obj[key] = value
		}
	}
	return obj
}
