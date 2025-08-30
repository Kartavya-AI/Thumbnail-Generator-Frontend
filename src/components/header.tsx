"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";

import logo from "../../public/7242a710-3055-4f90-acd8-738e65364450 (1).png";
import Link from "next/link";
import Image from "next/image";

const Logo = () => (
    <Link
        href="https://www.kartavyatech.com/"
        className="flex items-center ml-2 h-14 font-bold text-2xl sm:text-3xl"
    >
        <Image
            src={logo}
            alt="Kartavya Logo"
            className={`h-14 w-14 animate-spin-slow`}
        />
        <span className="text-4xl text-zinc-500">Kartavya</span>
    </Link>
);

function Header() {
    const [open, setOpen] = useState(false);
    return (
        <div className="w-full z-50 fixed top-0 h-20  px-4 sm:px-20 flex justify-center md:px-36">
            <header className=" w-full max-w-6xl h-16 bg-white shadow-md inset-shadow-2xs inset-shadow-white mt-2 rounded-2xl">
                <div className="h-16 flex items-center justify-between w-full">
                    {/* Logo */}
                    <Logo />

                    {/* Desktop Nav */}
                    <ul className="hidden md:flex h-14  items-center gap-10 text-xl">
                        <li className="text-zinc-500 hover:text-zinc-800 hover:text-2xl transition-all duration-200 hover:font-bold">
                            <Link href="/">Home</Link>
                        </li>

                        <li className="text-zinc-500 hover:text-zinc-800 hover:text-2xl transition-all duration-200 hover:font-bold">
                            <Link href={"/create"}>Create</Link>
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex items-center mr-4 "
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <X className="w-10 h-10" />
                        ) : (
                            <Menu className="w-10 h-10" />
                        )}
                    </button>

                    {/* Login (Always Visible) */}
                    <div className="hidden md:flex">
                        <SignedOut>
                            <div className="flex gap-3 mr-4">
                                <div className="bg-zinc-100  shadow-zinc-500 shadow-md inset-shadow-2xs inset-shadow-white rounded-full px-3 py-1 text-zinc-500 hover:text-zinc-800 cursor-pointer">
                                    {" "}
                                    <SignInButton />
                                </div>
                                <div className="bg-zinc-100  shadow-zinc-500 shadow-md inset-shadow-2xs inset-shadow-white rounded-full px-3 py-1 text-zinc-500 hover:text-zinc-800 cursor-pointer">
                                    <SignUpButton>Sign Up</SignUpButton>
                                </div>
                            </div>
                        </SignedOut>
                    </div>
                    <SignedIn>
                    <div className="bg-zinc-200  shadow-zinc-500 shadow-md inset-shadow-2xs inset-shadow-white rounded-full px-2 py-1 text-zinc-500 hover:text-zinc-800 cursor-pointer mr-4 flex items-center justify-center h-10 w-10">
                        <div className="bg-amber-300 rounded-full flex justify-center items-center shadow-md shadow-zinc-700">
                            
                            <UserButton />
                        
                        </div>
                    </div>
                    </SignedIn>
                </div>

                {/* Mobile Nav Dropdown */}
                {open && (
                    <ul className="bg-white shadow-md inset-shadow-2xs inset-shadow-white md:hidden mt-2 space-y-4 px-4 py-4 text-lg rounded-2xl ">
                        <li>
                            <Link href={"/"}>Home</Link>
                        </li>
                        <li>
                            <Link href={"/create"}>Create</Link>
                        </li>
                        <SignedOut>
                            <div>
                                {" "}
                                <SignInButton />
                            </div>
                            <div>
                                <SignUpButton>Sign Up</SignUpButton>
                            </div>
                        </SignedOut>
                    </ul>
                )}
            </header>
        </div>
    );
}

export default Header;