import styles from '../styles/agb.module.css';

export default function TermsOfUse() {
    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <h1 className={styles.title}>Nutzungsbedingungen</h1>
                <p className={styles.date}>Stand: Mai 2025</p>
                <section className={styles.section}>
                    <h2 className={styles.subtitle}>1. Geltungsbereich</h2>
                    <p className={styles.text}>
                        Diese Nutzungsbedingungen gelten für die Nutzung der Webseite <strong>www.oulei.ch</strong> und aller damit verbundenen Dienste.
                        Mit dem Zugriff auf die Plattform erklärst du dich mit diesen Bedingungen einverstanden.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>2. Zweck der Plattform</h2>
                    <p className={styles.text}>
                        Duckytype bietet eine Onlineplattform zur Messung und Verbesserung der Tippgeschwindigkeit.
                        Die Nutzung ist grundsätzlich kostenlos, es sei denn, explizit anders angegeben.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>3. Verbotene Nutzungen</h2>
                    <p className={styles.text}>
                        Die folgenden Verhaltensweisen sind auf oulei.ch untersagt:
                    </p>
                    <p className={styles.text}>
                        - Unbefugtes Eindringen in Systeme (Hacking), <br/>
                        - Versuche, Sicherheitsfunktionen zu umgehen,<br/>
                        - Nutzung von automatisierten Skripten, Bots oder Scraper-Software,<br/>
                        - Verbreitung von Viren oder schädlichem Code,<br/>
                        - Veröffentlichung oder Verlinkung von rechtswidrigen Inhalten.<br/>
                    </p>
                    <p className={styles.text}>
                        Zuwiderhandlungen können zur Sperrung des Zugangs führen und rechtliche Schritte nach sich ziehen.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>4. Urheberrecht</h2>
                    <p className={styles.text}>
                        Alle Inhalte, insbesondere Texte, Grafiken, Software und Logos auf oulei.ch,
                        unterliegen dem Urheberrecht und dürfen ohne schriftliche Zustimmung nicht kopiert, verändert
                        oder kommerziell genutzt werden.
                    </p>
                    <p className={styles.text}>
                        Eigene Beiträge der Nutzer verbleiben im geistigen Eigentum der jeweiligen Ersteller,
                        dem Betreiber wird jedoch ein nicht-exklusives Nutzungsrecht eingeräumt, um die Inhalte auf der Plattform darzustellen.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>5. Haftung</h2>
                    <p className={styles.text}>
                        Duckytype übernimmt keine Haftung für die Richtigkeit, Vollständigkeit oder Verfügbarkeit der Inhalte.
                        Für Schäden, die durch die Nutzung der Webseite entstehen, haftet der Betreiber nur bei vorsätzlichem oder grob fahrlässigem Verhalten.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>6. Änderungen</h2>
                    <p className={styles.text}>
                        Der Betreiber behält sich das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern.
                        Nutzer werden über wesentliche Änderungen auf der Webseite informiert.
                        Die weitere Nutzung gilt als Zustimmung zu den Änderungen.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>7. Kontakt</h2>
                    <p className={styles.text}>
                        Bei Fragen oder Meldungen zu Verstössen gegen diese Nutzungsbedingungen:
                        <a href="mailto:olivier@deszynski.com"> olivier@deszynski.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
