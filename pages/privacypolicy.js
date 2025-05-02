import styles from '../styles/agb.module.css';

export default function Privacypolicy() {
    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <h1 className={styles.title}>Datenschutzerklärung</h1>
                <p className={styles.date}>Stand: April 2025</p>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>1. Allgemeine Hinweise</h2>
                    <p className={styles.text}>
                        Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschliesslich auf Grundlage der gesetzlichen Bestimmungen.
                    </p>
                    <p className={styles.text}>
                        In dieser Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>2. Kontakt mit uns</h2>
                    <p className={styles.text}>
                        Wenn Sie per Formular auf der Website oder per E-Mail Kontakt mit uns aufnehmen, werden Ihre angegebenen Daten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen sechs Monate bei uns gespeichert.
                    </p>
                    <p className={styles.text}>
                        Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>3. Datenspeicherung</h2>
                    <p className={styles.text}>
                        Folgende Daten auch bei uns gespeichert: Username, Name, E-Mail-Adresse, Adresse, Zahlungsinformationen. Die von Ihnen bereitgestellten Daten sind zur Vertragserfüllung bzw. zur Durchführung vorvertraglicher Massnahmen erforderlich.
                    </p>
                    <p className={styles.text}>
                        Ohne diese Daten können wir den Vertrag mit Ihnen nicht abschliessen. Eine Datenübermittlung an Dritte erfolgt nicht, mit Ausnahme der Übermittlung an unsere Zahlungsdienstleister zur Abbuchung des Einkaufspreises sowie an unseren Steuerberater zur Erfüllung unserer steuerrechtlichen Verpflichtungen.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>4. Cookies</h2>
                    <p className={styles.text}>
                        Unsere Website verwendet sogenannte Cookies. Dabei handelt es sich um kleine Textdateien, die mit Hilfe des Browsers auf Ihrem Endgerät abgelegt werden. Sie richten keinen Schaden an.
                    </p>
                    <p className={styles.text}>
                        Wir nutzen Cookies dazu, unser Angebot nutzerfreundlich zu gestalten. Einige Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen.
                    </p>
                    <p className={styles.text}>
                        Sie ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen. Wenn Sie dies nicht wünschen, so können Sie Ihren Browser so einrichten, dass er Sie über das Setzen von Cookies informiert und Sie dies nur im Einzelfall erlauben.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>5. Web-Analyse</h2>
                    <p className={styles.text}>
                        Unsere Website verwendet Funktionen des Webanalysedienstes Google Analytics. Dazu werden Cookies verwendet, die eine Analyse der Benutzung der Website durch Ihre Benutzer ermöglicht.
                    </p>
                    <p className={styles.text}>
                        Die dadurch erzeugten Informationen werden auf den Server des Anbieters übertragen und dort gespeichert. Sie können dies verhindern, indem Sie Ihren Browser so einrichten, dass keine Cookies gespeichert werden.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>6. Ihre Rechte</h2>
                    <p className={styles.text}>
                        Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu.
                    </p>
                    <p className={styles.text}>
                        Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstösst oder Ihre datenschutzrechtlichen Ansprüche sonst in einer Weise verletzt worden sind, können Sie sich bei der Aufsichtsbehörde beschweren.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>7. Kontaktinformationen</h2>
                    <p className={styles.text}>
                        Verantwortlich für die Datenverarbeitung:
                    </p>
                    <p className={styles.text}>
                        DuckyType<br />
                        Engehaldenstrasse 26<br />
                        3000 Bern, Schweiz<br />
                        E-Mail: olivier@deszynskicom
                    </p>
                </section>
            </div>
        </div>
    );
}