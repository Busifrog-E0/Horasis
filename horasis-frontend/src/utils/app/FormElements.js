import { cva } from "class-variance-authority";


export const inputVariants = cva(
    [
        "px-2 py-1",
        "rounded",
        "inline-flex items-center justify-center gap-x-2",
        "font-[500] text-base",
        "outline-none",
        "disabled:bg-system-file-border disabled:cursor-not-allowed",
    ],
    {
        variants: {
            variant: {
                white:
                    "bg-system-secondary-bg text-system-primary-text border border-system-file-border rounded-lg",
                primary_outlined:
                    "bg-system-secondary-bg text-system-primary-text border border-system-primary-accent rounded-lg",
            },
            size: {
                xs: "px-2 py-1",
                sm: "px-4 py-2",
                md: "px-6 py-3",
                lg: "px-8 py-4",
            },
            width: {
                normal: "w-max",
                full: "w-full",
            },
            withIcon: {
                true: "border-none outline-0 px-0 py-2 rounded-full",
                false: "",
            },
        },
        defaultVariants: {
            variant: "white",
            size: "sm",
            width: "normal",
            withIcon: "false",
        },
    }
)

