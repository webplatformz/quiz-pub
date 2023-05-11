import { component$, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { QuizContext } from "~/routes";


export default component$(() => {
    const location = useLocation();
    const connected = useSignal(false);
    useVisibleTask$(({ track, cleanup }) => {
        track(() => connected.value);
        const code = location.params.code;
        try {
            location.params;
            const ws = new WebSocket(`wss://${window.location.host}/${code}`);
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
        <span>Connected: {connected.value}</span>
    </div>;
});