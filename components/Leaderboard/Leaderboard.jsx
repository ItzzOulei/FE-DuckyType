import { useEffect, useState } from "react";
import LeaderboardAPI from "../../lib/api/Leaderboard.js";
import styles from './Leaderboard.module.css';
import Link from "next/link";

const STORAGE_KEY = 'session';

export default function Leaderboard({ loadUsers }) {
    const [users, setUsers] = useState(loadUsers || []);
    const [width, setWidth] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState({ type: 'words', value: 10 }); // Single filter state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUsername = () => {
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const sessionData = JSON.parse(storedData);
                return sessionData.username;
            }
        }
        return null;
    };

    const handleLeaderboardChange = async (type, value) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await LeaderboardAPI.getUsers(
                type === 'words' ? value : null,
                type === 'timestamp' ? value : null
            );
            setUsers(response);
            setSelectedFilter({ type, value });
        } catch (error) {
            console.error("Failed to load leaderboard:", error);
            setError("Failed to load leaderboard. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleLeaderboardChange('words', 10); // Initial load: Words 10
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth);
        }
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={styles.containerLeaderboard}>
            <div className={styles.filterContainer}>
                <div className={styles.mainFilter}>
                    <p
                        className={`${styles.leaderboardFilter} ${selectedFilter.type === 'timestamp' && selectedFilter.value === null ? styles.activeFilter : ''}`}
                        onClick={() => handleLeaderboardChange('timestamp', null)}
                    >
                        All time
                    </p>
                </div>
                <div className={styles.dayFilter}>
                    <p
                        className={`${styles.leaderboardFilter} ${selectedFilter.type === 'timestamp' && selectedFilter.value === 'daily' ? styles.activeFilter : ''}`}
                        onClick={() => handleLeaderboardChange('timestamp', 'daily')}
                    >
                        Daily
                    </p>
                    <p
                        className={`${styles.leaderboardFilter} ${selectedFilter.type === 'timestamp' && selectedFilter.value === 'weekly' ? styles.activeFilter : ''}`}
                        onClick={() => handleLeaderboardChange('timestamp', 'weekly')}
                    >
                        Weekly
                    </p>
                </div>
                <div className={styles.subFilter}>
                    <p
                        className={`${styles.leaderboardFilter} ${selectedFilter.type === 'words' && selectedFilter.value === 10 ? styles.activeFilter : ''}`}
                        onClick={() => handleLeaderboardChange('words', 10)}
                    >
                        Words 10
                    </p>
                    <p
                        className={`${styles.leaderboardFilter} ${selectedFilter.type === 'words' && selectedFilter.value === 15 ? styles.activeFilter : ''}`}
                        onClick={() => handleLeaderboardChange('words', 15)}
                    >
                        Words 15
                    </p>
                    <p
                        className={`${styles.leaderboardFilter} ${selectedFilter.type === 'words' && selectedFilter.value === 20 ? styles.activeFilter : ''}`}
                        onClick={() => handleLeaderboardChange('words', 20)}
                    >
                        Words 20
                    </p>
                </div>
            </div>
            <div className={styles.leaderboardContainer}>
                <h1 className={styles.leaderboardTitle}>LEADERBOARD</h1>
                {error && <div className={styles.error}>{error}</div>}
                {isLoading ? (
                    <section className={styles.dots_container}>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                    </section>
                ) : users.length > 0 ? (
                    <ul className={styles.leaderboardList}>
                        {users.map((user, i) => {
                            const username = getUsername();
                            const timestamp = user.timestamp;
                            const date = new Date(timestamp);
                            const formattedDate = date.toLocaleString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            });

                            return (
                                <li
                                    key={user.id}
                                    className={username === user.user.username ? styles.currentUser : styles.rangElement}
                                >
                                    <Link href={`/profile/${user.user.id}`}>
                                        <h2 className={styles.rangTitle}>
                                            {i + 1} {user.user.username}
                                        </h2>
                                    </Link>
                                    <Link href={`/run/${user.id}`}>
                                        <h3 className={styles.rangStat}>WPM: {user.wpm}</h3>
                                    </Link>
                                    {width > 700 && (
                                        <Link href={`/run/${user.id}`}>
                                            <h3 className={styles.rangStat}>Accuracy: {user.accuracy}%</h3>
                                        </Link>
                                    )}
                                    {width > 950 && (
                                        <Link href={`/run/${user.id}`}>
                                            <h3 className={styles.rangStat}>{formattedDate}</h3>
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div>No results found</div>
                )}
            </div>
        </div>
    );
}