import {component$, useStore, useStyles$} from '@builder.io/qwik';
import {Form, routeAction$, useLocation, z, zod$} from '@builder.io/qwik-city';

import editStyles from '../edit.module.css';
import styles from '../../styles.css?inline';
import type {QuizSave} from "~/lib/models/quiz-save.model";

export const useSubmitFormAction = routeAction$(
    (props) => {
        console.log('props', props);
        const newQuiz = JSON.parse(props.quizState);
        console.log('Name deserialized', newQuiz.name);
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
        id: "",
        name: "",
        rounds: [],
        date: new Date().getTime(),
        deleted: false
    } as QuizSave;
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
                                    name: "Round - " + quiz.rounds.length,
                                    questions: []
                                })
                            }}>
                        Add Round
                    </button>
                    <p>
                        {(quiz.rounds.length && (
                            <ul>
                                {quiz.rounds.map((item, index) => (
                                    <li key={`items-${index}`}>{item.name}</li>
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
