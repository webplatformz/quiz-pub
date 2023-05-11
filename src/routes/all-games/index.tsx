import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

type StoredQuiz = {
    id: string,
    lastSaved: string,
    name: string,
    rounds: string,
    questions: string,
}

export default component$(() => {
    const store = useStore({ quizzes: [] });
    useVisibleTask$(() => {
        store.quizzes = JSON.parse(localStorage.getItem("quizzes") ?? "[]");
    });
    return <div class="section bright container">
        <div class="flex flex-row justify-between mb-4">
            <h3>Quizzes</h3>
            <a href={"/edit"} class="button">Create Quiz</a>
        </div>

        <div class="flex flex-col gap-4">
            {
                store.quizzes.map((game: StoredQuiz, index: number) => (
                    <Quiz {...game} key={index} />
                ))
            }
        </div>
    </div>;
});


const Quiz = component$<StoredQuiz>(({ id, lastSaved, name, rounds, questions }) => {
    return <section class="w-full p-4 bg-slate-800 rounded flex flex-col gap-2">
        <span class="text-2xl font-bold">{name}</span>
        <span>Rounds: {rounds}</span>
        <span>Questions: {questions}</span>
        <span>{lastSaved}</span>
        <div class="flex flex-row w-full justify-between gap-4 mt-2">
            <Link class="button w-1/3 p-3" href={`/edit?code=${id}`}>Edit</Link>
            <button class="w-1/3 p-3">Run</button>
            <button class="w-1/3 p-3 bg-red-700">Delete</button>
        </div>
    </section>;
});

