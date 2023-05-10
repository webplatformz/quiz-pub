import {component$, useStore, useStyles$} from '@builder.io/qwik';
import {Form, routeAction$, useLocation, z, zod$} from '@builder.io/qwik-city';
import type {QuizState} from '~/lib/models/quiz-state.model';

import editStyles from '../edit.module.css';
import styles from '../../styles.css?inline';

export const useSubmitFormAction = routeAction$(
    (props: QuizState) => {
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
            <div class="container container-center">
                <Form action={action}>
                    <input type="text" name="name" value={quiz.name} class={editStyles.input}
                           onInput$={(e: any) => quiz.name = e.target.value}/>
                    <button type="button"
                            onClick$={() => {
                                quiz.rounds.push({
                                    id: quiz.rounds.length,
                                    text: "Init Roundname - " + quiz.rounds.length
                                })
                            }}>
                        Add Round
                    </button>
                    <p>
                        {(quiz.rounds.length && (
                            <ul>
                                {quiz.rounds.map((item, index) => (
                                    <li key={`items-${index}`}>{item.text}</li>
                                ))}
                            </ul>
                        )) || <span>No rounds present</span>}
                    </p>
                    <input type="hidden" name="quizState" value={JSON.stringify(quiz)}/>
                    <p>
                        <button type="submit">save</button>
                    </p>
                </Form>
            </div>

        </section>
    );
});
