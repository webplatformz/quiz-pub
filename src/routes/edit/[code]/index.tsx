import { component$, useStore, useStyles$ } from '@builder.io/qwik';
import { Form, routeAction$, useLocation, z, zod$ } from '@builder.io/qwik-city';

import editStyles from '../edit.module.css';
import styles from '../styles.css?inline';
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
        rounds: [],
        date: new Date().getTime()
    } as QuizSave;
});

export default component$(() => {
    useStyles$(styles);
    const loc = useLocation();
    const action = useSubmitFormAction();
    const quiz = useStore(quizInitializier(), {deep: true});
    return (
        <section class="section bright">
            <h1>Quiz: {loc.params.code} quiz: {quiz.name}! rounds: {quiz.rounds.length}</h1>
            <div class="container container-center">
                <Form action={action}>
                    <input type="text" name="name" value={quiz.name} class={editStyles.input}
                           onInput$={(e: any) => quiz.name = e.target.value}/>
                    <AddRound quiz={quiz} />
                    <p>
                        {(quiz.rounds.length && (
                            <ul class={editStyles.list}>
                                {quiz.rounds.map((round, index) => (
                                    <RoundList key={`round-${index}`} quiz={quiz} roundIndex={index} roundName={round.name}/>
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

interface QuizProps {
    quiz: QuizSave;
}

export const AddRound = component$<QuizProps>((props) => {
    const quiz = props.quiz;
    return (
        <button type="button"
                onClick$={() => {
                    quiz.rounds.push({
                        name: "Round - " + quiz.rounds.length,
                        questions: []
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
    const question: string = props.question;
    return (
        <>
            <label for={`round-${rIndex}-Q-${qIndex}`}>
                {`Question ${qIndex}`}
            </label>
            <input type="text"
                   id={`round-${rIndex}-Q-${qIndex}`}
                   name={`round-${rIndex}-Q-${qIndex}`}
                   placeholder={question}
                   class={editStyles.input}
                   onInput$={(e: any) => {
                       const round = quiz.rounds[rIndex];
                       round.questions = round.questions.map((q, i) => (i === qIndex ? e.target.value : q));
                       quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                   }}
            />
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
                {`Round ${props.roundIndex}`}
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

            {(quiz.rounds[rIndex].questions || []).map((question, qIndex) => (
                <QuestionList key={`round-${rIndex}-Q-${qIndex}`} quiz={quiz} questionIndex={qIndex} roundIndex={rIndex} question={question} />
            ))}
            <button type="button"
                    onClick$={() => {
                        const round = quiz.rounds[rIndex];
                        round.questions = [...round.questions, 'Here comes the question'];
                        quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                    }}>
                Add Question
            </button>
            <div></div>
        </li>
    );
});
