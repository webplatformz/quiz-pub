import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import styles from "./styles.css?inline";
import global from "../global.css?inline";
import Header from "~/components/header/header";

export const useServerTimeLoader = routeLoader$(() => {
    return {
        date: new Date().toISOString()
    };
});

export default component$(() => {
    useStyles$(global);
    useStyles$(styles);
    return (
        <>
            <Header />
            <main>
                <Slot />
            </main>
        </>
    );
});
