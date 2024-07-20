import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Modal from "./Modal";
import Button from "./Button";
import { inputVariants } from "../../utils/app/FormElements";


const SelectBox = ({
    variant,
    size,
    width,
    withIcon,
    className,
    value,
    placeholder,
    body,
    ...props
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const OnModalClose = () => {
        setIsModalOpen(false);
    };

    const OnModalOpen = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={OnModalClose}>
                <Modal.Header>
                    <p className="text-xl font-medium">{placeholder}</p>
                    <svg
                        onClick={OnModalClose}
                        className="w-4 h-4 text-system-primary-text cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                </Modal.Header>
                <Modal.Body>
                    {body}
                    {/* <Button
                        type="button"
                        onClick={OnModalClose}
                        width="full"
                        variant="black"
                        className="mt-4"
                    >
                        Create
                    </Button> */}
                </Modal.Body>
            </Modal>
            <div className={`flex flex-col my-1 ${width === "full" ? "w-[100%]" : "w-max"}`}>
                <div

                    className={twMerge(inputVariants({ variant, size, width, withIcon, className }))}
                >
                    {value ? value : <span className="text-brand-gray-dim cursor-pointer" onClick={OnModalOpen}>{placeholder}</span>}
                    <svg onClick={OnModalOpen}
                        className="w-3 h-3 text-system-primary-text cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                </div>
            </div>
        </>
    );
};

export default SelectBox;
