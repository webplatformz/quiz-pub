import type { NoSerialize } from "@builder.io/qwik";
import { $, component$, noSerialize, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import type { StoredQuiz } from "~/routes/all-games";

type Message = {
    type: "PLAYER_UPDATE",
    value: string[]
};

export default component$(() => {
    const location = useLocation();
    const store = useStore<{ ws: NoSerialize<WebSocket | undefined> }>({ ws: undefined });
    const quiz = useStore<{ players: string[] }>({ players: [] });
    const join = $(() => {
        console.log("join");
        if (store.ws && store.ws.readyState !== WebSocket.CLOSED) {
            return;
        }
        console.log("join 2");
        const code = location.params.code;
        const name = new URL(location.url).searchParams.get("name");
        if (!name) {
            return;
        }
        const quizzes: StoredQuiz[] = JSON.parse(localStorage.getItem("quizzes") ?? "[]");
        const quiz = quizzes.find(quiz => quiz.id === code);

        try {
            const auth = quiz ? `&auth=${quiz.adminToken}` : "";
            const ws = new WebSocket(`wss://${window.location.host}/joinquiz/${code}?name=${name}${auth}`);
            ws.onopen = () => {
                store.ws = noSerialize(ws);
            };
        } catch (e) {
            console.log(e);
        }
    });

    useVisibleTask$(async () => {
        await join();
    });

    useVisibleTask$(({ track, cleanup }) => {
        track(() => store.ws);
        if (store.ws && store.ws.readyState === WebSocket.CLOSED) {

            store.ws.onmessage = (msg) => {
                try {
                    const message: Message = JSON.parse(msg.data);
                    switch (message.type) {
                        case "PLAYER_UPDATE": {
                            quiz.players = message.value;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            store.ws.onclose = async () => {
                console.log("close");
                await join();
            };
            store.ws.onerror = (error) => {
                console.log(error);
            };
        }
        cleanup(() => {
            console.log("cleanup");
            store.ws?.close();
        });
    });
    return <div>
        <span>Connected: {`${!!store.ws}`}</span>
        <ul>{
            quiz.players.map((player, index) => {
                return <li key={index}>{player}</li>;
            })
        }</ul>
    </div>;
});