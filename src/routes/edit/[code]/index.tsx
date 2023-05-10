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
                                            id={`round-${index}`}
                                            key={`round-${index}`}
                                            name={`round-${index}`}
                                            value={round.name}
                                            class={editStyles.input}
                                            onInput$={(e: any) => {
                                                const round = quiz.rounds[index];
                                                round.name = e.target.value;
                                                quiz.rounds = quiz.rounds.map((r, i) => (i === index ? round : r));
                                            }}
                                        />

                                        {(round.questions || []).map((question, qIndex) => (
                                            <>
                                                <label for={`round-${index}-Q-${qIndex}`}>
                                                    {`Question ${qIndex}`}
                                                </label>
                                                <input type="text"
                                                       id={`round-${index}-Q-${qIndex}`}
                                                       key={`round-${index}-Q-${qIndex}`}
                                                       name={`round-${index}-Q-${qIndex}`}
                                                       value={question}
                                                       class={editStyles.input}
                                                       onInput$={(e: any) => {
                                                           const round = quiz.rounds[index];
                                                           round.questions = round.questions.map((q, i) => (i === qIndex ? e.target.value : q));
                                                           quiz.rounds = quiz.rounds.map((r, i) => (i === index ? round : r));
                                                       }}
                                                />
                                            </>
                                        ))}
                                        <button type="button"
                                                onClick$={() => {
                                                    const round = quiz.rounds[index];
                                                    round.questions = [...round.questions, 'Here comes the question'];
                                                    quiz.rounds = quiz.rounds.map((r, i) => (i === index ? round : r));
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
