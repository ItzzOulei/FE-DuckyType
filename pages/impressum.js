import styles from '../styles/impressum.module.css'

export default function Impressum() {
    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <h1 className={styles.title}>Impressum</h1>
                <p className={styles.text}>
                    ICT Campus Post<br />
                    Engehaldestrasse, 26<br />
                    3030, Bern<br />
                </p>
                <h3 className={styles.subtitle}>Kontakt</h3>
                <p className={styles.text}>
                    Telefon: +41 77 483 97 83<br />
                    E-Mail: info@duckytyping.com<br />
                </p>
                <p className={styles.text}>
                    Die Inhalte unserer Seiten wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                </p>
                <iframe className={styles.iframe} src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d572.4976203961685!2d7.440223232665073!3d46.956327557190185!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e391309a50b11%3A0xa737841ff19a9ded!2sICT%20Campus%20Post!5e0!3m2!1sde!2sch!4v1744362558539!5m2!1sde!2sch"  referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    );
}