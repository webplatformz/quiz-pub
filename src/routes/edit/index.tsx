import { $, component$, useStore, useStyles$ } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";

import editStyles from "./edit.module.css";
import styles from "./styles.css?inline";
import type { QuizSave } from "~/lib/models/quiz-save.model";
import { fetch} from "undici";

export const quizInitializer = (() => {
    return {
        name: "",
        rounds: [{
            name: "Round - 1",
            questions: [""]
        }],
        date: new Date().getTime()
    } as QuizSave;
});

export const useSavedQuiz = routeLoader$(async (requestEvent) => {
    const searchParams = requestEvent.url.searchParams;
    const code = searchParams.get("code");
    if (!code) {
        return quizInitializer();
    }

    const quiz = await fetch(`/api/quiz?id=${code}`, {
        method: "GET"
    }).then(res => res.json());
    console.log(quiz);
    return quizInitializer();
});

export default component$(() => {
    useStyles$(styles);
    const savedQuiz = useSavedQuiz();
    const loc = useLocation();
    const quiz = useStore(savedQuiz.value, { deep: true });
    // useVisibleTask$(async () => {
    //     const query = new URLSearchParams(window.location.search);
    //     const code = query.get("code");
    //     if (!code) {
    //         return;
    //     }
    //
    // });

    const save = $(async () => {
        console.log(JSON.stringify(quiz));
        try {
            const newQuizId = await fetch("/api/quiz", {
                method: "PUT",
                body: JSON.stringify(quiz)
            }).then(res => res.text());
            const newQuiz = {
                id: newQuizId,
                name: quiz.name,
                rounds: quiz.rounds.length,
                questions: quiz.rounds.reduce((prev, current) => prev + current.questions.length, 0),
                lastSaved: quiz.date
            };
            const quizzes = JSON.parse(localStorage.getItem("quizzes") ?? "[]");
            quizzes.push(newQuiz);
            localStorage.setItem("quizzes", JSON.stringify(quizzes));
            // await nav(`/all-games?new-game=${newQuizId}`);
        } catch (e) {
            console.log(e);
        }

    });

    return (
        <section class="section bright container">
            <h3>Quiz (id: {loc.params.code}): «{quiz.name}»</h3>
            <div class="container container-center">
                <div class={editStyles.createQuiz}>
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

                    <AddRound quiz={quiz} />
                    <button type="submit" onClick$={save}>save</button>
                </div>
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
                        questions: [""]
                    });
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
    const question: string = props.question;
    return (
        <>
            <label for={`round-${rIndex}-Q-${qIndex}`}>
                {`Question ${qIndex + 1}`}
            </label>
            <input type="text"
                   id={`round-${rIndex}-Q-${qIndex}`}
                   name={`round-${rIndex}-Q-${qIndex}`}
                   placeholder={`${round.name} - Question ${qIndex + 1}`}
                   value={question}
                   class={editStyles.input}
                   onInput$={(e: any) => {
                       round.questions = round.questions.map((q, i) => (i === qIndex ? e.target.value : q));
                       quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                   }}
            />
            <button
                type="button"
                onClick$={() => {
                    console.log('deleting BEFORE', qIndex, question, round.questions);
                    round.questions = (round.questions || []).filter((q, i) => i !== qIndex);
                    console.log('deleting AFTER', qIndex, question, round.questions);
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
    roundIndex: number;
    roundName: string;
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
                    round.questions = [...round.questions, ""];
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
