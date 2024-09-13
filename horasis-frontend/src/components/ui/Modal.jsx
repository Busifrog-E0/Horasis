import { Fragment } from 'react'
import { Dialog, Transition, TransitionChild } from '@headlessui/react'

const Modal = ({ children, footer = <></>, isOpen, maxWidth }) => {
	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog as='div' className={`relative bg-red-500 z-40`} onClose={() => {}}>
				<TransitionChild as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity' />
				</TransitionChild>

				<div className='fixed inset-0 z-10 w-screen overflow-y-auto '>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<TransitionChild as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95' enterTo='opacity-100 translate-y-0 sm:scale-100' leave='ease-in duration-200' leaveFrom='opacity-100 translate-y-0 sm:scale-100' leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
							<Dialog.Panel className={`relative transform overflow-hidden rounded-lg  text-left shadow-xl transition-all sm:my-8 ${maxWidth ? `${maxWidth}` : 'max-w-xl'}  w-[90%] sm:w-full`}>
								{children}
								{footer}
							</Dialog.Panel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

const Header = ({ children, bgColor = undefined }) => {
	return <div className={`p-4 flex items-center justify-between ${bgColor ? bgColor : 'bg-system-secondary-bg'} text-brand-primary  border-system-file-border`}>{children}</div>
}

const Body = ({ children, padding = undefined, bgColor = undefined }) => {
	return <div className={`${padding ? `px-${padding} pb-${padding}` : 'px-4'} py-4 ${bgColor ? bgColor : 'bg-system-secondary-bg'}`}>{children}</div>
}

Modal.Header = Header
Modal.Body = Body

export default Modal
