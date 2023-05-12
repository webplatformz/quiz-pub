import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { ActionStore, Form, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { supabase } from "~/lib/db";
import { AuthChangeEvent } from "@supabase/supabase-js";

export const useLogin = routeAction$(async ({ email, name }, re) => {
    if (email && name) {
      const redirectUrl = `${re.url.origin}/login`;
      await supabase.auth.signInWithOtp({
        email,
        options: { data: { name }, emailRedirectTo: redirectUrl }
      });
    }
  },
  zod$({
    name: z.string(),
    email: z.string()
  })
);

export default component$(() => {
  const login = useLogin();
  const user = useStore<{ data: any, state: AuthChangeEvent }>({ data: undefined, state: "INITIAL_SESSION" });
  useVisibleTask$(async () => {
    supabase.auth.onAuthStateChange(event => user.state = event);
    const response = await supabase.auth.getUser();
    console.log(response.data.user);
    user.data = response.data.user;
  });
  return <>
    {
      user.data
        ? <p>Hello {user.data.user_metadata.name}!</p>
        : <section>
          <LoginForm login={login} />
        </section>
    }</>;
});

const LoginForm = (props: { login: ActionStore<unknown, any, any> }) => <Form action={props.login}>
  <label class="block my-2">
    <span>Name</span>
    <input type="text" name="name" class="text-black" />
  </label>
  <label class="block my-2">
    <span>E-Mail</span>
    <input type="email" name="email" class="text-black" />
  </label>
  <button type="submit">Login / Signup</button>
</Form>;
