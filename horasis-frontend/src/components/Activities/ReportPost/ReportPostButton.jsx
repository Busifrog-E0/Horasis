import { useState } from "react"
import Modal from "../../ui/Modal"

const ReportPostButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openReasonsModal = () => {
        setIsModalOpen(true)
    }

    return (
        <>
            <span onClick={openReasonsModal}
                className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
                role='menuitem'>
                Report Post
            </span>
            <Modal isOpen={isModalOpen} maxWidth={`max-w-4xl`}>
                <Modal.Header>
                    <p className='text-lg font-medium'>Report Post</p>
                    <button
                        onClick={() => {
                            setIsModalOpen(false)
                        }}
                    >
                        close
                    </button>
                </Modal.Header>
                <Modal.Body >
                    <div className='flex flex-col gap-4'>
                        {/* {isLoading ?
                            <div className='w-full lg:w-full h-24 rounded-md flex items-center justify-center  '>
                                <Spinner />
                            </div>
                            :
                            membersData.length > 0 ?
                                <MembersSection
                                    members={membersData.map(d => ({ ...d.UserDetails, CreatedIndex: d.CreatedIndex }))}
                                    emptyText={'No members '}
                                    updateList={() => { }}
                                    whichTime='member'
                                    fetchMore={fetchMore}
                                    isLoadingMore={isLoadingMore}
                                    pageDisabled={pageDisabled}
                                    tabName='members'
                                />
                                :
                                <EmptyMembers emptyText={"No one likes you :/"} />
                        } */}
                    </div>
                </Modal.Body>
            </Modal>
        </>

    )
}

export default ReportPostButton