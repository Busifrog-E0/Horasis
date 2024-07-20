import { useContext, useEffect, useState } from "react"
import { getItem } from "../../constants/operations"
import { AuthContext } from "../../utils/AuthProvider"
import { useToast } from "../Toast/ToastService"
import { getNextId } from "../../utils/URLParams"
import { jsonToQuery } from "../../utils/searchParams/extractSearchParams"
import EmptyMembers from "../Common/EmptyMembers"
import Spinner from "../ui/Spinner"
import avatar from '../../assets/icons/avatar.svg'
import MemberSearchSectionTab from "../Search/Sections/Members/MemberSearchSectionTab"

const SelectMembersTab = ({ onSelect, profile, selected }) => {


    return (
        <div className={`${selected ? "bg-red-200" : "bg-system-secondary-bg"} cursor-pointer`} onClick={() => onSelect(profile)}>
            <div className='flex items-start gap-4'>
                {profile ? (
                    <>
                        {profile.ProfilePicture ? (
                            <div className='w-11 h-11 rounded-full bg-black'>
                                <img
                                    className='w-11 h-11 rounded-full object-cover'
                                    src={profile.ProfilePicture}
                                    alt='Rounded avatar'
                                />
                            </div>
                        ) : (
                            <>
                                <div className='w-11 h-11 rounded-full bg-brand-light-gray'>
                                    <img src={avatar} className='object-cover h-full w-full rounded-lg' />
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <img
                            className='w-11 h-11 rounded-full'
                            src='https://flowbite.com/docs/images/people/profile-picture-1.jpg'
                            alt='Rounded avatar'
                        />
                    </>
                )}

                <div className='flex-1'>
                    <h4 className='font-semibold text-lg text-system-primary-accent ' >
                        {profile && profile.FullName}
                    </h4>
                    <h4 className='font-semibold text-sm text-brand-gray-dim'>@{profile && profile.Username}</h4>
                </div>
            </div>
        </div>
    )
}

export default SelectMembersTab