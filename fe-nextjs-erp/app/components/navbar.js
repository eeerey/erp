import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Avatar } from 'primereact/avatar';
import { classNames } from 'primereact/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 🔹 HAPUS interface NavbarProps, langsung destruktur props di parameter fungsi
const Navbar = ({ isHidden, toggleMenuItemClick }) => {
    const router = useRouter();
    const profileOverlayRef = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('TOKEN');
        const userStorage = localStorage.getItem('USER');

        if (token) {
            setIsLoggedIn(true);
            if (userStorage) {
                try {
                    const parsedUser = JSON.parse(userStorage);
                    setUserName(parsedUser.name || 'User');
                    setUserRole(parsedUser.role || 'Member');
                } catch {
                    setUserName('User');
                }
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('TOKEN');
        localStorage.removeItem('USER');
        setIsLoggedIn(false);
        router.push('/auth/login');
    };

    return (
        <>
            <div className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ top: '100%' }}>
                {/* Menu Navigasi */}
                <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                    <li>
                        <a href="#home" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                            <span>Home</span>
                            <Ripple />
                        </a>
                    </li>
                    <li>
                        <a href="#features" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                            <span>Features</span>
                            <Ripple />
                        </a>
                    </li>
                    <li>
                        <a href="#highlights" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                            <span>Highlights</span>
                            <Ripple />
                        </a>
                    </li>
                    <li>
                        <a href="#pricing" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                            <span>Pricing</span>
                            <Ripple />
                        </a>
                    </li>
                </ul>

                {/* Tombol Akses Sebelum / Sesudah Login */}
                <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                    {!isLoggedIn ? (
                        <>
                            <Button label="Login" text rounded className="border-none font-light line-height-2 text-blue-500" onClick={() => router.push('/auth/login')} />
                            <Button label="Register" rounded className="border-none ml-5 font-light line-height-2 bg-blue-500 text-white" onClick={() => router.push('/auth/register')} />
                        </>
                    ) : (
                        <div className="flex align-items-center gap-3">
                            <Button label="Dashboard" icon="pi pi-th-large" rounded className="border-none font-light line-height-2 bg-blue-500 text-white" onClick={() => router.push('/superadmin/dashboard')} />

                            <Avatar label={userName.charAt(0).toUpperCase()} shape="circle" className="bg-primary text-white cursor-pointer" onClick={(e) => profileOverlayRef.current?.toggle(e)} />
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay Profile */}
            <OverlayPanel ref={profileOverlayRef}>
                <div className="flex flex-column gap-2 p-2">
                    <div>
                        <strong className="block text-900">{userName}</strong>
                        <span className="text-sm text-500">{userRole}</span>
                    </div>
                    <Link href="/auth/profile">
                        <Button label="Profil Saya" icon="pi pi-user" className="p-button-text p-button-sm w-full text-left" />
                    </Link>
                    <Button label="Logout" icon="pi pi-sign-out" className="p-button-text p-button-danger p-button-sm w-full text-left" onClick={handleLogout} />
                </div>
            </OverlayPanel>
        </>
    );
};

export default Navbar;
