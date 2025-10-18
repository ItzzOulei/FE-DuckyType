import React, { useState } from "react";
import { Bounce, toast } from "react-toastify";
import UsersAPI from "../../lib/api/Users.js";
import { useGlobalContext } from "../../store/index.js";
import { router } from "next/client.js";
import styles from "./LoginForm.module.css";
import Link from "next/link";

const RegisterForm = ({ post }) => {
    const { session, login, logout } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ username: "", email: "", password: "", passwordConfirm: "" });
    const [user, setUser] = useState({ username: "", email: "", password: "", passwordConfirm: "" });
    const [showPassword, setShowPassword] = useState(false);

    const validateUser = (user) => {
        let isValid = true;
        const newErrors = { username: "", email: "", password: "", passwordConfirm: "" };

        if (!user.username) {
            newErrors.username = "Username can't be empty";
            isValid = false;
        } else if (user.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
            isValid = false;
        } else if (user.username.length > 20) {
            newErrors.username = "Username is too long (max 20 characters)";
            isValid = false;
        }

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

        if (user.password !== user.passwordConfirm) {
            newErrors.passwordConfirm = "Passwords must match";
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
            const registerResponse = await UsersAPI.register({
                username: user.username,
                email: user.email,
                password: user.password,
            });

            toast.success("Registration successful! Please check your email to verify your account.", { transition: Bounce });
            router.push(`/auth-waiting?email=${encodeURIComponent(user.email)}`);
        } catch (err) {
            let errorMessage = "An error occurred";
            if (err.response) {
                const status = err.response.status;
                if (status === 400) errorMessage = "Bad request - check your input";
                else if (status === 401) errorMessage = "Login failed - account may not be active";
                else if (status === 409) errorMessage = "User already exists";
                else errorMessage = `Server error: ${status}`;
            } else {
                errorMessage = err.message;
            }
            setErrors({
                username: errorMessage,
                email: errorMessage,
                password: errorMessage,
                passwordConfirm: "",
            });
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
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className={errors.username ? styles.inputFieldError : styles.inputField}>
                    <input
                        onChange={handleChange}
                        name="username"
                        id="username"
                        value={user.username}
                        placeholder=" "
                    />
                    <label htmlFor="username">Username</label>
                </div>
                {errors.username && <p className={styles.error}>{errors.username}</p>}

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
                    <div style={{position: "relative"}}>
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

                <div className={errors.passwordConfirm ? styles.inputFieldError : styles.inputField}>
                    <div style={{position: "relative"}}>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="passwordConfirm"
                            id="passwordConfirm"
                            value={user.passwordConfirm}
                            placeholder=" "
                        />
                        <label htmlFor="passwordConfirm">Confirm Password</label>
                    </div>
                </div>
                {errors.passwordConfirm && <p className={styles.error}>{errors.passwordConfirm}</p>}

                <div className={styles.bottomButtons}>
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Register"}
                    </button>
                    <Link href='/login'>
                        <p>Already Have An Account?</p>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;