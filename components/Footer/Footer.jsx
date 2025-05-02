import React from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';
import Link from "next/link";
import Privacypolicy from "../../pages/privacypolicy.js";

const Footer = () => {
    return (
        <footer>
            <div className={styles.footerContainer}>
                <Link href="/contactus">
                    <p>Contact Us</p>
                </Link>
                <Link href="/privacypolicy">
                    <p>Privacy Policy</p>
                </Link>
                <Link href="/impressum">
                    <p>Impressum</p>
                </Link>
                <Link href="/aboutus">
                    <p>About Us</p>
                </Link>
            </div>
        </footer>
    );
};

export default Footer;