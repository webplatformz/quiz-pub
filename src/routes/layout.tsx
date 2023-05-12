import { component$, Slot, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";

import styles from "./styles.css?inline";
import global from "../global.css?inline";
import Header from "~/components/header/header";
import { supabase } from "~/lib/db";

export const useServerTimeLoader = routeLoader$(async () => {
  const session = await supabase.auth.getSession();
  console.log(session);
  return {
    date: new Date().toISOString()
  };
});

export default component$(() => {
  useStyles$(global);
  useStyles$(styles);
  useVisibleTask$(() =>{
    console.log(location.hash);
  });
  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
    </>
  );
});
