import { component$ } from "@builder.io/qwik";
import { QwikLogo } from "~/components/starter/icons/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <header>
      <Link href="/" title="qwik">
        <QwikLogo height={50} width={143} />
      </Link>

    </header>
  );
});
