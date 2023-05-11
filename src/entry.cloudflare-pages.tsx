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
import type { QuizSave } from "~/lib/models/quiz-save.model";
import { uuid as randomUUID } from "@cfworker/uuid";

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

    if (isWebsocketRequest) {
        return env.QUIZ_PUB.fetch(request, env, ctx);
    }

    if (path[0] === "api") {
        if (path[1] === "quiz") {
            if (request.method === "PUT") {
                // case 1: new quiz
                // - new uuid
                // - put quiz with new uuid + admin token
                // - return quiz uuid + admin token


                // case 2: update quiz
                // - get quiz id and get quiz obj
                // - does quiz obj exist?
                // - does auth header match with admin token in quiz obj?
                // - update quiz with given uuid
                // - return quiz uuid + new admin token
                const quiz: QuizSave = await request.json();

                if (quiz.id) {
                    // update quiz
                    const value = await env.QUIZ_PUB_KV.get(quiz.id);
                    if (!value) {
                        return new Response("quiz does not exist yet", { status: 400 });
                    }
                    const oldQuiz: QuizSave = JSON.parse(value);
                    const adminToken = request.headers.get("authorization");
                    if (oldQuiz.adminToken !== adminToken) {
                        return new Response("not authorized to update this quiz", { status: 403 });
                    }
                    const newAdminToken = randomUUID();
                    const stringifyQuiz = JSON.stringify({
                        ...quiz,
                        adminToken: newAdminToken
                    } as QuizSave);
                    await env.QUIZ_PUB_KV.put(quiz.id, stringifyQuiz);

                    return new Response(JSON.stringify({ uuid: quiz.id, adminToken: newAdminToken }));
                } else {
                    // add new quiz
                    const uuid = randomId();
                    const value = await env.QUIZ_PUB_KV.get(uuid);
                    if (value) {
                        return new Response("uuid is already taken", { status: 500 });
                    }
                    const adminToken = randomUUID();
                    const stringifyQuiz = JSON.stringify({
                        ...quiz,
                        adminToken
                    } as QuizSave);
                    await env.QUIZ_PUB_KV.put(uuid, stringifyQuiz);
                    return new Response(JSON.stringify({ uuid, adminToken }));
                }
            } else if (request.method === "GET") {
                const id = url.searchParams.get("id");
                const quiz: QuizSave = await env.QUIZ_PUB_KV.get(id);
                quiz.adminToken = undefined;
                return new Response(JSON.stringify(quiz ?? {}));
            }
        }
    }

    return createQwikCity({ render, qwikCityPlan, manifest })(request, env, ctx);
};

export { fetch };
