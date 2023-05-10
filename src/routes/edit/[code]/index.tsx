import { component$, useStore, useStyles$ } from '@builder.io/qwik';
import { Form, routeAction$, useLocation, z, zod$ } from '@builder.io/qwik-city';

import editStyles from '../edit.module.css';
import styles from '../../styles.css?inline';
import type { QuizSave } from "~/lib/models/quiz-save.model";

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
                                {quiz.rounds.map((round, index) => (
                                    <>
                                        <input
                                            type="text"
                                            name={`round-${index}`}
                                            value={round.name}
                                            class={editStyles.input}
                                            onInput$={(e: any) => {
                                                // quiz.rounds[index] = {
                                                //     name: e.target.value,
                                                //     questions: round.questions
                                                // };
                                                quiz.rounds.push({
                                                    name: e.target.value,
                                                    questions: quiz.rounds[index].questions
                                                })
                                                quiz.rounds.splice(index, 1);
                                            }}
                                        />

                                        {(round.questions || []).map((question, qIndex) => (
                                            <>
                                                <label for={`Q${qIndex}`}>
                                                    {`Q${qIndex}`}
                                                </label>
                                                <input type="text"
                                                       id={`Q${qIndex}`}
                                                       name={`Q${qIndex}`}
                                                       value={question}
                                                       class={editStyles.input}
                                                       onInput$={(e: any) => {
                                                           const qs = [...quiz.rounds[index].questions];
                                                           qs.push(e.target.value);
                                                           qs.splice(qIndex, 1);

                                                           quiz.rounds.push({
                                                               name: quiz.rounds[index].name,
                                                               questions: qs
                                                           })
                                                           quiz.rounds.splice(index, 1);
                                                       }}
                                                />
                                            </>
                                        ))}
                                        <button type="button"
                                                onClick$={() => {
                                                    quiz.rounds[index].questions = ['default'];
                                                }}>
                                            Add Question
                                        </button>
                                    </>
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
