import { component$, useSignal } from '@builder.io/qwik';
import { Form, routeAction$, routeLoader$, useLocation, z, zod$ } from '@builder.io/qwik-city';
import type { QuizState } from '~/lib/models/quiz-state.model';

import styles from '../edit.module.css';

const quiz = {} as QuizState;

export const useUpdateNameAction = routeAction$(
    (props) => {
        quiz.name = props.name;
        console.log('props', props);
        return {
            success: true,
        };
    },
    zod$({
        name: z.string().trim(),
    })
);

export const useQuizLoader = routeLoader$(() => {
    return quiz;
});

export default component$(() => {
    const loc = useLocation();
    const quiz = useQuizLoader();
    const action = useUpdateNameAction();
    const name = useSignal('');
    return (

        <section class="section bright">
            <h1>Adapting Quiz: {loc.params.code} signal: {name.value} quiz: {quiz.value.name}!</h1>
            <Form action={action}>

                <input type="text" name="name" value={quiz.value.name} class={styles.input} onInput$={(e: any) => {
                    name.value = e.target.value;
                }} />
                <button type="submit">save</button>
            </Form>

        </section>
    );
});
