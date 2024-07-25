import { useContext, useEffect, useState } from 'react'
import { getItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import { useToast } from '../Toast/ToastService'
import { getNextId } from '../../utils/URLParams'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import EmptyMembers from '../Common/EmptyMembers'
import Spinner from '../ui/Spinner'
import avatar from '../../assets/icons/avatar.svg'
import MemberSearchSectionTab from '../Search/Sections/Members/MemberSearchSectionTab'
import SelectMembersTab from './SelectMembersTab'

const SelectMembersList = ({
	onSelect,
	multiSelect,
	selectedValue,
	members,
	isLoadingMore,
	pageDisabled,
	fetchMore,
}) => {
	const onSelectMember = (value) => {
		if (selectedValue.map((d) => d.DocId).includes(value.DocId)) {
			onSelect(selectedValue.filter((val) => val.DocId !== value.DocId))
		} else {
			onSelect([...selectedValue, value])
		}
	}

	return (
		<>
			<div className='flex flex-col gap-5'>
				{members ? (
					<>
						{members.length > 0 ? (
							<>
								{members.map((item) => {
									return (
										<SelectMembersTab
											selected={
												multiSelect
													? selectedValue.map((d) => d.DocId).includes(item.DocId)
													: selectedValue.DocId === item.DocId
											}
											onSelect={onSelectMember}
											profile={item}
											key={item.DocId}
										/>
									)
								})}
							</>
						) : (
							<>
								<EmptyMembers emptyText={'No members'} />
							</>
						)}
					</>
				) : (
					<></>
				)}
			</div>

			{isLoadingMore && (
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
			)}
		</>
	)
}

export default SelectMembersList
