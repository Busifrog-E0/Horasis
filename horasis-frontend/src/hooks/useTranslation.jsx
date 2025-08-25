import { useState } from 'react'
import { _retrieveData } from '../utils/LocalStorage'
import usePostData from './usePostData'

const useTranslation = ({ data, setData, Type = '' }) => {
	const [isTranslated, setIsTranslated] = useState(false)
	const [translationData, setTranslationData] = useState(null)

	const storedLanguage = _retrieveData('currentLanguage')
	const homeLanguage = storedLanguage ? storedLanguage : 'English'
	const translationSuccessCallback = (result) => {
		setIsTranslated((prev) => !prev)
		setTranslationData(result)
		setData({ ...data, ...result.TranslatedContent })
	}
	const { postData: postTranslate, isLoading: isTranslating } = usePostData({ onSuccess: translationSuccessCallback })

	const translate = () => {
		if (translationData) {
			setIsTranslated((prev) => !prev)
			setData({ ...data, ...translationData.TranslatedContent })
		} else {
			if (data?.OriginalLanguage !== homeLanguage) {
				postTranslate({
					endpoint: 'translate',
					payload: {
						EntityId: data?.DocId,
						Type: Type,
						TargetLanguage: homeLanguage,
					},
				})
			}
		}
	}

	const showOriginal = () => {
		if (translationData) {
			setIsTranslated((prev) => !prev)
			setData({ ...data, ...translationData.OriginalContent })
		}
	}
	return {
		isTranslated,
		isTranslating,
		translate,
		showOriginal,
		homeLanguage,
	}
}
export default useTranslation
