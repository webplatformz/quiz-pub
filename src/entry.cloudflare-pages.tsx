/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Cloudflare Pages when building for production.
 *
 * Learn more about the Cloudflare Pages integration here:
 * - https://qwik.builder.io/docs/deployments/cloudflare-pages/
 *
 */
import { createQwikCity, type PlatformCloudflarePages } from "@builder.io/qwik-city/middleware/cloudflare-pages";
import qwikCityPlan from "@qwik-city-plan";
import { manifest } from "@qwik-client-manifest";
import render from "./entry.ssr";
import { randomId } from "~/lib/utils/random-id";

declare global {
  interface QwikCityPlatform extends PlatformCloudflarePages {
  }
}

type Env = Record<string, any> & {
  ASSETS: {
    fetch: (req: Request) => Response;
  };
};

const fetch = async (request: Request, env: Env, ctx: PlatformCloudflarePages["ctx"]) => {
  const url = new URL(request.url);
  const path = url.pathname.slice(1).split("/");
  const isWebsocketRequest = request.headers.get("Upgrade") === "websocket";
  if (!path[0] && !isWebsocketRequest) {
    // Serve our HTML at the root path.
    return createQwikCity({ render, qwikCityPlan, manifest })(request, env, ctx);
  }

  if (isWebsocketRequest) {
    return env.QUIZ_PUB.fetch(request, env, ctx);
  }

  if (path[0] !== "quiz") {
    return new Response("Not found", { status: 404 });
  }

  if (request.method === "PUT") {
    const uuid = randomId();
    const value = await env.QUIZ_PUB_KV.get(uuid);
    if (value) {
      return new Response("uuid is already taken", { status: 500 });
    }
    const quiz = await request.json();
    await env.QUIZ_PUB_KV.put(uuid, JSON.stringify(quiz));
    return new Response(uuid);
  } else if (request.method === "GET") {
    const id = url.searchParams.get("id");
    const quiz = await env.QUIZ_PUB_KV.get(id);
    return new Response(quiz);
  }
};

export { fetch };