import { $, component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { supabase } from "~/lib/db";

const useDBTest = routeLoader$(async (requestEv) => {
  const { data } = await supabase.from("game")
    .select("*")
    .eq("invite_code", requestEv.params.code)
    .single();
  return data;
});

export default component$(() => {
  const dbTest = useDBTest();
  const game = useStore({ ...dbTest.value });
  const code = useLocation().params.code;

  useVisibleTask$(() => {
    supabase
      .channel("changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game", filter: `invite_code=eq.${code}` },
        payload => game.name = payload.new.name)
      .subscribe();
  });

  const updateGameName = $(async (ev, game) => {
    await supabase
      .from("game")
      .update({ name: ev.target.value })
      .eq("id", game.id);
  });

  return (
    <>
      <h1>ROOM: {code}</h1>
      <>
        <h2>Game: {game.name}</h2>
        <input class="text-black" type="text" value={game.name} onInput$={ev => updateGameName(ev, game)} />
      </>
    </>
  );
});