import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Form, routeAction$, routeLoader$, useLocation, z, zod$ } from '@builder.io/qwik-city';
import type { QuizState } from '~/lib/models/quiz-state.model';

import editStyles from '../edit.module.css';
import styles from '../../styles.css?inline';

export const useSubmitFormAction = routeAction$(
    (props : QuizState) => {
        console.log('props', props);
        const newQuiz = JSON.parse(props.quizState);
        console.log('Name deserialized', newQuiz.name);
        //console.log('props', props.quizState.name);
        return {
            success: true,
        };
    },
    zod$({
        quizState: z.any()
    })
);

export const quizInitializier = (() => {
    return {
        name: "",
        joinCode: "",
        adminCode: "",
        players: [],
        rounds: [],
        questions: [],
        answers: [],
        currentRound: 1
    } as QuizState;
});

export default component$(() => {
    useStyles$(styles);
    const loc = useLocation();
    const action = useSubmitFormAction();
    const quiz = useStore(quizInitializier());
    return (
        <section class="section bright">
            <h1>Quiz: {loc.params.code} quiz: {quiz.name}! rounds: {quiz.rounds.length}</h1>
            <Form action={action}>
                <input type="text" name="name" value={quiz.name} class={editStyles.input} onInput$={(e: any) => quiz.name = e.target.value}/>
                <button type="button"
                    onClick$={() => {
                        quiz.rounds.push({id: quiz.rounds.length,
                            text: "Init Roundname - " + quiz.rounds.length})
                    }}>
                    Add Round
                </button>
                <div class="container container-center">
                    {(quiz.rounds.length && (
                        <ul>
                            {quiz.rounds.map((item, index) => (
                                <li key={`items-${index}`}>{item.text}</li>
                            ))}
                        </ul>
                    )) || <span>No items found</span>}
                </div>
                <input type="hidden" name="quizState" value={JSON.stringify(quiz)} />
                <button type="submit">save</button>

            </Form>

        </section>
    );
});
