import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ThemeSwitcher from "../Theme/ThemeSwitcher"
import Input from "../ui/Input"
import Button from "../ui/Button"
import { AuthContext } from "../../utils/AuthProvider"
import Logo from "../Common/Logo"

const WelcomePage = () => {
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: "100svh", }} className="flex flex-col justify-center items-center bg-system-primary-bg">
            <div style={{ borderRadius: 20 }} className="bg-system-secondary-bg flex flex-col gap-4 login-form p-8 lg:p-16">
                <center>
                    <Logo height={80} />
                </center>
                <p className="text-system-primary-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                <Button
                    loading={false}
                    onClick={() => {
                        navigate("/login")
                    }}
                    variant="black"
                    width="full"
                    size='md'
                >
                    Get started as Admin
                </Button>
                <Button
                    onClick={() => {
                        navigate("/register")
                    }}
                    variant="white"
                    width="full"
                    size='md'
                    className="mt-2 bg-system-secondary-accent  border-none shadow-sm"
                >
                    <p className="text-md text-center">
                        Get started as a Member
                    </p>
                </Button>
            </div>
        </div>
    )
}

export default WelcomePage