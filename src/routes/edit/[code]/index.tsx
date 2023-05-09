import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export default component$(() => {
    const loc = useLocation();
    return (

        <section class="section bright">
            <h1>Adapting Quiz: {loc.params.code}!</h1>
            <h1>create questions...</h1>
        </section>
    );
});
