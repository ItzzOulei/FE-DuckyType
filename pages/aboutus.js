import Link from 'next/link';
import styles from '../styles/aboutus.module.css';
import Image from 'next/image';

export default function AboutUs() {
  return (
    <div className={styles.body}>
        <div className={styles.imgContainer}>
            <div className={styles.images}>
                <Link href="/profile/161"><img id={styles.levy} src="/Levy.png" alt="Levy"/></Link>
                <h1>Levy</h1>
                <h3>Italian</h3>
            </div>
            
            <div className={styles.images}>
                <Link href="/profile/132"><img id={styles.oli} src="/Oli.png" alt="Oli"/></Link>
                <h1>Oli</h1>
                <h3>K*rwa Bober</h3>
            </div>
        </div>
    </div>
  );
}