// src/components/MentionTextarea.jsx

import React, { useContext, useEffect, useState } from 'react'
import Input from '../../ui/Input'
import { getItem } from '../../../constants/operations'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { useToast } from '../../Toast/ToastService'
import { AuthContext } from '../../../utils/AuthProvider'
import { getNextId } from '../../../utils/URLParams'
import Spinner from '../../ui/Spinner'

const MentionTextarea = ({ user, newPost, handleContentChange }) => {
    const { updateCurrentUser, currentUserData } = useContext(AuthContext)
    const toast = useToast()
    const [suggestions, setSuggestions] = useState([])
    const [mentionStart, setMentionStart] = useState(-1)
    const [pageDisabled, setPageDisabled] = useState(true)

    const [members, setMembers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [filters, setFilters] = useState({
        OrderBy: 'Index',
        Limit: 10,
        Keyword: '',
    })
    const [mentionName, setMentionName] = useState('')

    const setLoadingCom = (tempArr, value) => {
        if (tempArr.length > 0) {
            setIsLoadingMore(value)
        } else {
            setIsLoading(value)
        }
    }

    const getAllMembers = (tempMembers) => {
        getData(`users?&${jsonToQuery(filters)}`, tempMembers, setMembers)
    }

    const getData = (endpoint, tempData, setData) => {
        setLoadingCom(tempData, true)
        getItem(
            `${endpoint}&NextId=${getNextId(tempData)}`,
            (data) => {
                setData([...tempData, ...data])
                setLoadingCom(tempData, false)
            },
            (err) => {
                setLoadingCom(tempData, false)
                // console.log(err)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }

    const hasAnyLeft = (endpoint, tempData) => {
        getItem(
            `${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...filters, Limit: 1 })}`,
            (data) => {
                if (data?.length > 0) {
                    setPageDisabled(false)
                } else {
                    setPageDisabled(true)
                }
            },
            (err) => {
                setPageDisabled(true)
            },
            updateCurrentUser,
            currentUserData,
            toast
        )
    }
    const fetchData = (initialRender = false) => {
        getAllMembers(initialRender ? [] : members)
    }
    const fetch = () => fetchData(true)
    const fetchMore = () => fetchData(false)

    const handleInputChange = (pureValue, e) => {
        const value = e.target.value
        handleContentChange(value)

        const cursorPosition = e.target.selectionStart
        const lastAtSymbol = value.lastIndexOf('@', cursorPosition - 1)

        if (lastAtSymbol !== -1) {
            const mentionText = value.slice(lastAtSymbol + 1, cursorPosition)
            if (mentionText.includes(' ')) {
                setSuggestions([])
                setMentionName('')
                setMentionStart(-1)
            } else {
                console.log(mentionText)
                setMentionName(mentionText)
                setSuggestions(members.filter((user) => user.Username.toLowerCase().includes(mentionText.toLowerCase())))
                setMentionStart(lastAtSymbol)
            }
        } else {
            setSuggestions([])
            setMentionStart(-1)
        }
    }

    const handleSuggestionClick = (user) => {
        const mentionEnd = newPost.Content.indexOf(' ', mentionStart)
        const newInputValue =
            newPost.Content.slice(0, mentionStart) +
            `@${user} ` +
            newPost.Content.slice(mentionEnd === -1 ? newPost.Content.length : mentionEnd)
        handleContentChange(newInputValue)
        setSuggestions([])
        setMentionStart(-1)
    }

    useEffect(() => {
        if (members.length > 0) hasAnyLeft(`users`, members)
    }, [members])

    useEffect(() => {
        fetch()
    }, [mentionName])
    return (
        <>
            <Input
                setValue={handleInputChange}
                width={'full'}
                value={newPost.Content}
                className='p-0 border-none rounded-none hover:shadow-none'
                placeholder={`Share what's on  your mind, ${user && user?.FullName ? user.FullName : ''}`}
            />
            <div className='fixed z-40'>
                {/* {isLoading ? (
					<Spinner />
				) : ( */}
                {suggestions.length > 0 && (
                    <ul className='absolute bg-white border rounded shadow-lg mt-1  w-max z-10'>
                        {suggestions.map((user, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(user.Username)}
                                className='p-2 cursor-pointer hover:bg-gray-200'>
                                {user.Username}
                            </li>
                        ))}
                    </ul>
                )}
                {/* )} */}
                {/* {isLoadingMore && (
                    <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
                        <Spinner />
                    </div>
                )}
                {!pageDisabled && (
                    <div
                        onClick={() => {
                            fetchMore()
                        }}
                        className='flex flex-row justify-end mt-4 mb-2'>
                        <div className='cursor-pointer flex items-center gap-2'>
                            <h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
                        </div>
                    </div>
                )} */}
            </div>
        </>
    )
}

export default MentionTextarea
