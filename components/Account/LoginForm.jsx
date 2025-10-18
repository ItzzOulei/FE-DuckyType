import React, { useState, useEffect } from "react";
import { Bounce, toast } from "react-toastify";
import UsersAPI from "../../lib/api/Users.js";
import { useGlobalContext } from "../../store/index.js";
import { router } from "next/client.js";
import { useRouter as useNextRouter } from "next/router";
import styles from "./LoginForm.module.css";
import Link from "next/link";

const LoginForm = ({ post }) => {
    const { session, login, logout } = useGlobalContext();
    const nextRouter = useNextRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [user, setUser] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Handle verification success redirect
        const { verified, email, error } = nextRouter.query;

        if (verified === 'true' && email) {
            toast.success("Account verified successfully! You can now log in.", { transition: Bounce });
            setUser(prev => ({ ...prev, email: decodeURIComponent(email) }));
        } else if (verified === 'false') {
            if (error === 'invalid') {
                toast.error("Invalid verification link.", { transition: Bounce });
            } else if (error === 'expired') {
                toast.error("Verification link has expired.", { transition: Bounce });
            }
        }
    }, [nextRouter.query]);

    const validateUser = (user) => {
        let isValid = true;
        const newErrors = { email: "", password: "" };

        if (!user.email) {
            newErrors.email = "Email can't be empty";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        } else if (user.email.length > 255) {
            newErrors.email = "Email is too long (max 255 characters)";
            isValid = false;
        }

        if (!user.password) {
            newErrors.password = "Password can't be empty";
            isValid = false;
        } else if (user.password.length < 5) {
            newErrors.password = "Password must be at least 5 characters";
            isValid = false;
        } else if (user.password.length > 255) {
            newErrors.password = "Password is too long (max 255 characters)";
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(user.password)) {
            newErrors.password = "Password must contain uppercase, lowercase, and a number";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateUser(user)) return;

        setIsLoading(true);

        try {
            const response = await UsersAPI.login(user);
            if (!response) return;

            login(response);
            toast.success("Login successfull!", { transition: Bounce });
            router.push("/");
        } catch (err) {
            let errorMessage = "Invalid Credentials";

            // Check if it's a 401 error and get the error message from backend
            if (err.response && err.response.status === 401) {
                try {
                    const errorData = await err.response.json();
                    if (errorData.error && errorData.error.includes("not verified")) {
                        // Account exists but not verified - redirect to auth-waiting page with auto-login
                        toast.warning("Verification email sent! Check your inbox.", { transition: Bounce });
                        router.push(`/auth-waiting?email=${encodeURIComponent(user.email)}&password=${encodeURIComponent(user.password)}`);
                        setIsLoading(false);
                        return;
                    }
                    errorMessage = errorData.error || "Invalid Credentials";
                } catch (jsonError) {
                    // If response is not JSON, use default message
                    errorMessage = "Invalid Credentials";
                }
            }

            setErrors({ email: errorMessage, password: errorMessage });
            toast.error(errorMessage, { transition: Bounce });
        }
        setIsLoading(false);
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.formContainerStyling}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className={errors.email ? styles.inputFieldError : styles.inputField}>
                    <input
                        onChange={handleChange}
                        name="email"
                        id="email"
                        value={user.email}
                        placeholder=" "
                    />
                    <label htmlFor="email">Email</label>
                </div>
                {errors.email && <p className={styles.error}>{errors.email}</p>}

                <div className={errors.password ? styles.inputFieldError : styles.inputField}>
                    <div style={{ position: "relative" }}>
                        <input
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={user.password}
                            placeholder=" "
                        />
                        <label htmlFor="password">Password</label>
                        <span onClick={togglePasswordVisibility} className={styles.viewIcon}>
                            {showPassword ?
                                <i className="material-icons">visibility</i> :
                                <i className="material-icons">visibility_off</i>}
                        </span>
                    </div>
                </div>
                {errors.password && <p className={styles.error}>{errors.password}</p>}

                <div className={styles.bottomButtons}>
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                    <Link href='/register'>
                        <p>Not Registered Yet?</p>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;