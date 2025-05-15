import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TypingResultAPI from '../../lib/api/TypingResult';
import UsersAPI from '../../lib/api/Users';
import styles from './profile.module.css';
import Link from 'next/link';
import Image from 'next/image';

function calculateAverage(array, field) {
    if (!array || array.length === 0) return 0;
    const sum = array.reduce((acc, item) => acc + (item[field] || 0), 0);
    return Number((sum / array.length).toFixed(2));
}

function calculateSum(array, field) {
    if (!array || array.length === 0) return 0;
    const sum = array.reduce((acc, item) => acc + (item[field] || 0), 0);
    return sum.toFixed(1);
}

export default function ProfilePage() {
    const router = useRouter();
    const { id } = router.query;
    const [results, setResults] = useState([]);
    const [user, setUser] = useState(null);
    const [ownProfile, setOwnProfile] = useState();
    const [width, setWidth] = useState(0);

    const handleRunRoute = (resultId) => {
        router.push(`/run/${resultId}`);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth);
        }

        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchResults = async () => {
            const data = await UsersAPI.getUser(id);
            const results = await TypingResultAPI.getResults(id);
            const session = JSON.parse(localStorage.getItem('session'));
            if (session) {
                if (parseInt(id) === session.userId) {
                    setOwnProfile(true);
                }
            }
            setResults(results);
            setUser(data);
        };

        fetchResults();
    }, [id]);

    if (!user || !results) {
        return (
            <div className={styles.body}>
                <div className={styles.topContainer}>
                    <div className={styles.profileContainer}>
                        <Image src="https://placehold.co/200x200?text=Campus+Type" alt="Campus Type" />
                        <div className={styles.profileStats}>
                            <span className={styles.loadingPlaceholderText}></span>
                            <h4>tests completed</h4>
                            <span className={styles.loadingPlaceholderText}></span>
                            <h4>time typing</h4>
                            <span className={styles.loadingPlaceholderText}></span>
                        </div>
                    </div>
                    <div id={styles.seperator}></div>
                        <div className={styles.rightContainer}>
                            <h4>bio</h4>
                            <span className={styles.loadingPlaceholderText}></span>
                            <h4>keyboard</h4>
                            <span className={styles.loadingPlaceholderText}></span>
                        </div>
                    </div>
                <div className={styles.bottomContainer}>
                    <div className={styles.statsContainer}>
                        <div className={styles.stats}>
                            <h3>WPM</h3>
                            <span className={styles.loadingPlaceholderText}></span>
                        </div>
                        <div className={styles.stats}>
                            <h3>CPM</h3>
                            <span className={styles.loadingPlaceholderText}></span>
                        </div>
                        <div className={styles.stats}>
                            <h3>ACC</h3>
                            <span className={styles.loadingPlaceholderText}></span>
                        </div>
                    </div>
                </div>
        </div>

        );
    }

    const avgWpm = calculateAverage(results, 'wpm');
    const avgCpm = calculateAverage(results, 'cpm');
    const avgAccuracy = calculateAverage(results, 'accuracy');
    const timePlayed = calculateSum(results, 'time');

    return (
        <div className={styles.body}>
            <div className={styles.topContainer}>
                <div className={styles.mobileContainer}>
                    {width > 980 ? (
                        <div className={styles.profileContainer}>
                    <Image src="https://placehold.co/200x200?text=Ducky+Type" alt="Ducky Type" />
                    <div className={styles.profileStats}>
                        <div className={styles.usernameEdit}>
                            <h2>{user.username}</h2>
                            {ownProfile === true && (
                                <Link href={`/profile/edit/${user.id}`}>
                                    <i className="large material-icons">mode_edit</i>
                                </Link>
                            )}
                        </div>
                        <h4>tests completed</h4>
                        <h3>{results.length}</h3>
                        <h4>time typing</h4>
                        <h3>{timePlayed} sec</h3>
                    </div>
                </div>
                    ) : (
                        <div className={styles.profileContainer}>
                            <Image src="https://placehold.co/200x200?text=Campus+Type" alt="Campus Type" />
                            <div className={styles.editProfile}>
                                <h2>{user.username}</h2>
                                {ownProfile === true && (
                                    <Link href={`/profile/edit/${user.id}`}>
                                        <i className="large material-icons">mode_edit</i>
                                    </Link>
                                )}
                            </div>
                            <div className={styles.profileStats}>
                                <div>
                                <h4>tests completed</h4>
                                <h3>{results.length}</h3>
                                </div>
                                <div>
                                <h4>time typing</h4>
                                <h3>{timePlayed} sec</h3>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div id={styles.seperator}></div>
                <div className={styles.mobileContainer}>
                    <div className={styles.rightContainer}>
                        <h4>bio</h4>
                        <p>{user.bio || 'No bio available'}</p>
                        <h4>keyboard</h4>
                        <p>{user.keyboard || 'Not specified'}</p>
                    </div>
                </div>
            </div>
            <div className={styles.bottomContainer}>
                <div className={styles.statsContainer}>
                    <div className={styles.stats}>
                        <h3>WPM</h3>
                        <h2>{avgWpm}</h2>
                    </div>
                    <div className={styles.stats}>
                        <h3>CPM</h3>
                        <h2>{avgCpm}</h2>
                    </div>
                    <div className={styles.stats}>
                        <h3>ACC</h3>
                        <h2>{avgAccuracy}%</h2>
                    </div>
                </div>
            </div>
            <div className={styles.bottomContainer}>
                <ul className={styles.runsContainer}>
                    {results
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .map((result, i) => {
                        const timestamp = result.timestamp;
                        const date = new Date(timestamp);
                        const formattedDate = date.toLocaleString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        });

                        return (
                            <li className={styles.runsDisplay} key={result.id} onClick={() => handleRunRoute(result.id)}>
                                <h3>WPM: {result.wpm}</h3>
                                <h3>Acc: {result.accuracy}%</h3>
                                <h3>{result.time} sec</h3>
                                {width > 700 && (
                                    <h3>{formattedDate}</h3>
                                )}
                                {width > 950 && (
                                    <h3>Words: {result.words}</h3>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}