import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../store/index.js";
import { useRouter } from "next/router";
import { toast, Bounce } from "react-toastify";
import UsersAPI from "../../lib/api/Users.js";
import styles from "./LoginForm.module.css";
import Link from "next/link";

const AuthWaitingForm = () => {
    const { session, login } = useGlobalContext();
    const router = useRouter();
    const [checkCount, setCheckCount] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const [showResendButton, setShowResendButton] = useState(false);
    const [attemptingAutoLogin, setAttemptingAutoLogin] = useState(false);
    const email = router.query.email || "";
    const password = router.query.password || "";

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

    // Show resend button immediately
    useEffect(() => {
        setShowResendButton(true);
    }, []);

    // Auto-polling for verification status if we have email and password
    useEffect(() => {
        if (!email || !password) return;

        const tryAutoLogin = async () => {
            try {
                const response = await UsersAPI.checkVerification(email, password);
                if (response && response.accessToken) {
                    // User is now verified and logged in!
                    login(response);
                    toast.success("Account verified! Logging you in...", { transition: Bounce });
                    router.push("/");
                }
            } catch (err) {
                // Still not verified, continue polling silently
            }
        };

        // Wait 2 seconds before first attempt
        const initialDelay = setTimeout(tryAutoLogin, 2000);

        // Then poll every 5 seconds (less aggressive)
        const pollInterval = setInterval(tryAutoLogin, 5000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(pollInterval);
        };
    }, [email, password, login, router]);

    const handleResendEmail = async () => {
        if (!email) {
            toast.error("No email address provided", { transition: Bounce });
            return;
        }

        setIsResending(true);
        try {
            await UsersAPI.resendVerification(email);
            toast.success("Verification email has been resent! Please check your inbox.", { transition: Bounce });
        } catch (err) {
            let errorMessage = "Failed to resend email";
            if (err.response) {
                const status = err.response.status;
                if (status === 400) errorMessage = "Account already verified or invalid email";
                else if (status === 404) errorMessage = "Account not found";
                else errorMessage = "Error resending email. Please try again.";
            }
            toast.error(errorMessage, { transition: Bounce });
        }
        setIsResending(false);
    };

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
                    Didn&#39;t receive the email? Check your spam folder.
                </p>

                {email && showResendButton && (
                    <button
                        onClick={handleResendEmail}
                        disabled={isResending}
                        style={{
                            backgroundColor: isResending ? '#cccccc' : '#579DFF',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: isResending ? 'not-allowed' : 'pointer',
                            marginBottom: '20px',
                            fontSize: '0.9rem',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {isResending ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                )}

                {attemptingAutoLogin && password && (
                    <p style={{ fontSize: '0.9rem', color: '#85B8FF', marginBottom: '20px' }}>
                        ✓ Auto-login enabled - waiting for email verification...
                    </p>
                )}

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