import { component$, useStyles$ } from "@builder.io/qwik";

import styles from "./styles.css?inline";

export const createShortGUID = () => {
    const firstPart = (Math.random() * 46656) | 0;
    return ("0000" + firstPart.toString(36)).slice(-4);
};

export default component$(() => {
    useStyles$(styles);
    const linkTemplate = `/edit/${createShortGUID()}`;

    return (
        <section class="section bright container">
            <h3>Quizzes</h3>
            <div class="container container-center">
                <a href={linkTemplate} class="button">Create Quiz</a>
            </div>
        </section>
    );
});
