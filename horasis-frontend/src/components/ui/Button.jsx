
import { cva } from "class-variance-authority"
import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"
import Spinner from "./Spinner"

const buttonVariants = cva(
  [
    "px-2 py-1",
    "rounded-xl",
    "inline-flex items-center justify-center gap-x-2",
    "font-[500] text-base",
    "disabled:bg-system-primary-bg  disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-brand-light-gray disabled:shadow-sm",
  ],
  {
    variants: {
      variant: {
        outline:
          "bg-system-secondary-bg text-system-primary-accent ring-1 ring-inset ring-system-file-border-accent hover:bg-system-primary-bg shadow",
        redhot:
          "bg-red-600 hover:bg-red-500 text-white border border-red-600 hover:border-red-500 shadow",
        default:
          "bg-system-secondary-bg text-system-primary-text ring-1 ring-inset ring-system-file-border hover:bg-system-primary-bg shadow",
        black:
          "bg-system-primary-btn text-system-primary-btn-text border border-brand-btn-prim shadow",
        secondary:
          "bg-system-secondary-btn text-system-secondary-btn-text border border-brand-btn-sec shadow",
        white:
          "bg-system-tertiary-bg text-brand-primary border border-brand-light-gray shadow-md",
        sea_outlined:
          "bg-system-secondary-bg text-system-link hover:bg-system-link hover:text-white  border border-system-file-border hover:brand-seagreen shadow-md ",
        primary: "bg-brand-violet text-white border border-brand-violet shadow",
        danger_outlined:
          "bg-system-secondary-bg text-system-error hover:bg-system-error hover:text-white border border-system-error hover:border-system-error shadow-md",
        danger:
          "bg-system-error text-white  border border-system-error shadow outline-none",
        success:
          "bg-system-success text-white  border border-system-success shadow outline-none",
        disabled:
          "bg-brand-secondary text-gray-400 border border-brand-light-gray shadow-sm cursor-not-allowed",
      },
      size: {
        xs: "px-4 py-1",
        sm: "px-6 py-2",
        md: "px-8 py-3",
        lg: "px-10 py-4",
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

const Button = forwardRef(function Button(
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
    loadingTitle = 'Perfoming action',
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
          {loadingTitle} <Spinner />
        </>
      ) : (
        children
      )}
      {/* {rightIcon ? <Icon inline={true} icon={rightIcon} height={18} /> : null} */}
    </button>
  )
})

Button.displayName = "Button"

export default Button
