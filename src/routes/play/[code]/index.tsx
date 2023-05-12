import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { StoredQuiz } from "~/routes/all-games";

export default component$(() => {
    const location = useLocation();
    const connected = useSignal(false);
    useVisibleTask$(({ cleanup }) => {
        const code = location.params.code;
        const quizzes: StoredQuiz[] = JSON.parse(localStorage.getItem("quizzes") ?? "[]");
        const quiz = quizzes.find(quiz => quiz.id === code);
        try {
            location.params;
            const auth = quiz ? `${quiz.adminToken}@` : "";
            const ws = new WebSocket(`wss://${auth}${window.location.host}/joinquiz/${code}`);
            ws.onmessage = (msg) => {
                console.log(msg.data);
            };
            ws.onopen = () => {
                connected.value = true;
                ws.send(JSON.stringify({ message: "whatup" }));
            };

            ws.onclose = () => {
                connected.value = false;
                console.log("closed");
            };
            cleanup(() => ws.close());
        } catch (e) {
            console.log(e);
        }
    });
    return <div>
        <span>Connected: {`${connected.value}`}</span>
    </div>;
});