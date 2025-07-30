
import { cva } from "class-variance-authority"
import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"
import Spinner from "./Spinner"

const buttonVariants = cva(
  [
    "px-6 py-1",
    "rounded-xl",
    "inline-flex items-center justify-center gap-x-2",
    "disabled:bg-system-primary-bg  disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-brand-light-gray disabled:shadow-sm",
  ],
  {
    variants: {
      variant: {
        inactive:
          "bg-system-secondary-bg text-system-primary-accent ring-1 ring-inset ring-system-file-border-accent hover:bg-system-primary-bg shadow",
        active:
          "bg-system-primary-btn text-system-primary-btn-text ring-1 ring-inset ring-system-file-border-accent border border-brand-btn-prim shadow",
      },
      width: {
        normal: "w-max",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
      width: "normal",
    },
  }
)

const TabItem = forwardRef(function Button(
  {
    children,
    variant,
    size,
    width,
    className,
    type,
    leftIcon,
    rightIcon,
    disabled,
    loading,
    ...props
  },
  ref
) {
  return (
    <button
      disabled={disabled || loading}
      type={type ? type : "button"}
      ref={ref}
      className={
        disabled
          ? twMerge(buttonVariants({ variant, size, width, className }))
          : twMerge(buttonVariants({ variant, size, width, className }))
      }
      {...props}
    >
      {/* {leftIcon ? <Icon inline={true} icon={leftIcon} height={18} /> : null} */}
      {loading ? (
        <>
          Performing action <Spinner />
        </>
      ) : (
        children
      )}
      {/* {rightIcon ? <Icon inline={true} icon={rightIcon} height={18} /> : null} */}
    </button>
  )
})

TabItem.displayName = "Button"

export default TabItem
