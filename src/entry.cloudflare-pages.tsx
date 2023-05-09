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
  if (request.headers.get("upgrade") === "websocket") {
    return new Response("yo");
  }
  return createQwikCity({ render, qwikCityPlan, manifest })(request, env, ctx);
};

class ChatRoom {
  private state: DurableObjectState;
  private env: Env;
  private sessions: any[];

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    this.sessions = [];
  }

  async fetch() {
    const pair = new WebSocketPair();
    await this.handleSession(pair[1]);
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  private async handleSession(webSocket: WebSocket) {
    // @ts-ignore
    webSocket.accept();
    this.sessions.push(webSocket);

    webSocket.onmessage = msg => {
      webSocket.send(msg.data);
    }
  }
}

export { fetch, ChatRoom };
