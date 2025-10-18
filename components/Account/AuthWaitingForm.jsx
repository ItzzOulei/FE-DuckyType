import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../store/index.js";
import { useRouter } from "next/router";
import styles from "./LoginForm.module.css";
import Link from "next/link";

const AuthWaitingForm = () => {
    const { session } = useGlobalContext();
    const router = useRouter();
    const [checkCount, setCheckCount] = useState(0);
    const email = router.query.email || "";

    useEffect(() => {
        // Redirect if already authenticated
        if (session) {
            router.push("/");
        }
    }, [session, router]);

    useEffect(() => {
        // Visual feedback counter
        const timer = setInterval(() => {
            setCheckCount(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.formContainerStyling}>
            <div style={{ textAlign: 'center' }}>
                <h1>Check Your Email</h1>

                <div style={{ margin: '30px 0' }}>
                    <i className="material-icons" style={{ fontSize: '64px', color: '#85B8FF' }}>
                        mail_outline
                    </i>
                </div>

                <p style={{ marginBottom: '20px', color: '#454F59' }}>
                    We&#39;ve sent a verification link to:
                </p>

                {email && (
                    <p style={{ marginBottom: '30px', fontWeight: 'bold', color: '#85B8FF' }}>
                        {email}
                    </p>
                )}

                <div style={{
                    backgroundColor: '#f5f9ff',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '30px',
                    border: '1px solid #85B8FF'
                }}>
                    <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                        Next Steps:
                    </p>
                    <ol style={{ textAlign: 'left', paddingLeft: '20px', color: '#454F59' }}>
                        <li style={{ marginBottom: '8px' }}>Check your email inbox</li>
                        <li style={{ marginBottom: '8px' }}>Click the verification link in the email</li>
                        <li style={{ marginBottom: '8px' }}>Return here to log in</li>
                    </ol>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#7d8486', marginBottom: '20px' }}>
                    Didn&#39;t receive the email? Check your spam folder or contact support.
                </p>

                <div className={styles.bottomButtons}>
                    <Link href="/login">
                        <button className={styles.button} style={{ width: '100%' }}>
                            Proceed to Login
                        </button>
                    </Link>

                    <Link href="/register">
                        <p style={{ textAlign: 'center', cursor: 'pointer' }}>
                            Back to Registration
                        </p>
                    </Link>
                </div>

                <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#7d8486' }}>
                    <p>Waiting for verification... ({checkCount}s)</p>
                </div>
            </div>
        </div>
    );
};

export default AuthWaitingForm;