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
    const quiz = useStore(quizInitializier(), {deep:true});
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
                            <ul>
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
    return (
        <button type="button"
                onClick$={() => {
                    props.quiz.rounds.push({
                        name: "Round - " + props.quiz.rounds.length,
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
    return (
        <div>
            <label for={`round-${props.roundIndex}-Q-${props.questionIndex}`}>
                {`Question ${props.questionIndex}`}
            </label>
            <input type="text"
                   id={`round-${props.roundIndex}-Q-${props.questionIndex}`}
                   name={`round-${props.roundIndex}-Q-${props.questionIndex}`}
                   value={props.question}
                   class={editStyles.input}
                   onInput$={(e: any) => {
                       const round = props.quiz.rounds[props.roundIndex];
                       round.questions = round.questions.map((q, i) => (i === props.questionIndex ? e.target.value : q));
                       props.quiz.rounds = props.quiz.rounds.map((r, i) => (i === props.roundIndex ? round : r));
                   }}
            />
        </div>
    );
});

interface RoundProps {
    quiz: QuizSave;
    roundIndex: number
    roundName: string
}
export const RoundList = component$<RoundProps>((props) => {
    return (
        <li>
            <input
                type="text"
                id={`round-${props.roundIndex}`}
                name={`round-${props.roundIndex}`}
                value={props.roundName}
                class={editStyles.input}
                onInput$={(e: any) => {
                    const round = props.quiz.rounds[props.roundIndex];
                    round.name = e.target.value;
                    props.quiz.rounds = props.quiz.rounds.map((r, i) => (i === props.roundIndex ? round : r));
                }}
            />

            {(props.quiz.rounds[props.roundIndex].questions || []).map((question, qIndex) => (
                <QuestionList key={`round-${props.roundIndex}-Q-${qIndex}`} quiz={props.quiz} questionIndex={qIndex} roundIndex={props.roundIndex} question={question} />
            ))}
            <button type="button"
                    onClick$={() => {
                        const round = props.quiz.rounds[props.roundIndex];
                        round.questions = [...round.questions, 'Here comes the question'];
                        props.quiz.rounds = props.quiz.rounds.map((r, i) => (i === props.roundIndex ? round : r));
                    }}>
                Add Question
            </button>
        </li>
    );
});
