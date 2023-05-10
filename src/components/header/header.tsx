import { component$ } from "@builder.io/qwik";
import { QwikLogo } from "~/components/starter/icons/qwik";

export default component$(() => {
  return (
    <header>
      <a href="/" title="qwik">
        <QwikLogo height={50} width={143} />
      </a>

    </header>
  );
});
