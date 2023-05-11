import { component$, useStore, useStyles$ } from "@builder.io/qwik";
import { Form, routeAction$, useLocation, z, zod$ } from "@builder.io/qwik-city";

import editStyles from "../edit.module.css";
import styles from "../styles.css?inline";
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
        name: "",
        rounds: [{
            name: "Round 1",
            questions: ["Round 1 - Question 1"]
        }],
        date: new Date().getTime()
    } as QuizSave;
});

export default component$(() => {
    useStyles$(styles);
    const loc = useLocation();
    const action = useSubmitFormAction();
    const quiz = useStore(quizInitializier(), {deep: true});

    return (
        <section class="section bright container">
            <h3>Quiz (id: {loc.params.code}): «{quiz.name}»</h3>
            <div class="container container-center">
                <Form action={action} class={editStyles.createQuiz}>
                    <input
                        type="text"
                        name="name"
                        value={quiz.name}
                        placeholder="Quiz name"
                        class={editStyles.input}
                        onInput$={(e: any) => quiz.name = e.target.value}
                    />

                    {quiz.rounds.length && (
                        <ul class={editStyles.round}>
                            {quiz.rounds.map((round, index) => (
                                <RoundList
                                    key={`round-${index}`}
                                    quiz={quiz}
                                    roundIndex={index}
                                    roundName={round.name}
                                />
                            ))}
                        </ul>
                    )}

                    <AddRound quiz={quiz}/>

                    <input type="hidden" name="quizState" value={JSON.stringify(quiz)}/>
                    <button type="submit">save</button>
                </Form>
            </div>
        </section>
    );
});

interface QuizProps {
    quiz: QuizSave;
}

export const AddRound = component$<QuizProps>((props) => {
    const quiz = props.quiz;
    return (
        <button type="button"
                onClick$={() => {
                    quiz.rounds.push({
                        name: "Round " + (quiz.rounds.length + 1),
                        questions: [`Round ${quiz.rounds.length + 1} - Question 1`]
                    })
                }}>
            Add Round
        </button>
    );
});

interface QuestionProps {
    quiz: QuizSave;
    roundIndex: number;
    questionIndex: number;
    question: string;
}

export const QuestionList = component$<QuestionProps>((props) => {
    const quiz = props.quiz;
    const rIndex: number = props.roundIndex;
    const qIndex: number = props.questionIndex;
    const round = quiz.rounds[rIndex];
    console.log('BEFORE', props.question);
    const question: string = props.question || `${round.name} - Question ${qIndex + 1}`;
    console.log('AFTER', question);
    return (
        <>
            <label for={`round-${rIndex}-Q-${qIndex}`}>
                {`Question ${qIndex + 1}`}
            </label>
            <input type="text"
                   id={`round-${rIndex}-Q-${qIndex}`}
                   name={`round-${rIndex}-Q-${qIndex}`}
                   placeholder={question}
                   class={editStyles.input}
                   onInput$={(e: any) => {
                       round.questions = round.questions.map((q, i) => (i === qIndex ? e.target.value : q));
                       quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                   }}
            />
            <button
                type="button"
                onClick$={() => {
                    // round.questions.splice(qIndex, 1);
                    // round.questions = [...round.questions, `Question ${round.questions.length + 1}`];
                    // round.questions = (quiz.rounds[rIndex].questions || []).filter((r, i) => i !== qIndex);
                    round.questions = (round.questions || []).filter((q, i) => i !== qIndex);
                    quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                }}
            >
                X
            </button>
        </>
    );
});

interface RoundProps {
    quiz: QuizSave;
    roundIndex: number
    roundName: string
}

export const RoundList = component$<RoundProps>((props) => {
    const quiz = props.quiz;
    const rIndex: number = props.roundIndex;
    const roundName: string = props.roundName;
    return (
        <li>
            <label for={`round-${props.roundIndex}`}>
                {`Round ${props.roundIndex + 1}`}
            </label>
            <input
                type="text"
                id={`round-${rIndex}`}
                name={`round-${rIndex}`}
                placeholder={roundName}
                class={editStyles.input}
                onInput$={(e: any) => {
                    const round = quiz.rounds[rIndex];
                    round.name = e.target.value;
                    quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                }}
            />
            <div></div>

            {(quiz.rounds[rIndex].questions || []).map((question, qIndex) => (
                // TODO: ref QuestionList#key to properly update the UI when an item is deleted
                <QuestionList
                    key={`round-${rIndex}-Q-${qIndex}`}
                    quiz={quiz}
                    questionIndex={qIndex}
                    roundIndex={rIndex}
                    question={question}
                />
            ))}
            <button
                type="button"
                onClick$={() => {
                    const round = quiz.rounds[rIndex];
                    round.questions = [...round.questions, `${roundName} - Question ${round.questions.length + 1}`];
                    quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                }}
            >
                Add Question
            </button>
            <div></div>
            <div></div>
        </li>
    );
});
