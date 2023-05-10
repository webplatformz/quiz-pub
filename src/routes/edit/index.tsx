import {component$} from '@builder.io/qwik';

export const createShortGUID = () => {
    const firstPart = (Math.random() * 46656) | 0;
    return ("0000" + firstPart.toString(36)).slice(-4);
};

export default component$(() => {
    const linkTemplate = `/edit/${createShortGUID()}`;
    return (
        <section class="section bright">
            <a href={linkTemplate} class="button">Create Quiz</a>
        </section>
    );
});
