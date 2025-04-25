import React from 'react';
import Navigation from '../Navigation/Navigation';
import styles from './Header.module.css';
import Image from 'next/image';
import Link from "next/link";

const Header = () => {
    return (
        <header className={styles.header}>
            <Link href="/">
                <div className={styles.logoContainer}>
                    <Image
                        src="/CampusType.jpg"
                        alt="Logo"
                        width={50}
                        height={50}
                    />
                    <h1>DUCKY TYPING</h1>
                </div>
            </Link>
            <div className={styles.logoContainer}>
                <Navigation />
            </div>
        </header>
    );
};

export default Header;