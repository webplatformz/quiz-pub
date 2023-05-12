const test = {
    id: "HMHTPQ",
    name: "Quiz 1",
    rounds: [
        {
            name: "Round 1",
            questions: ["Question 1", "Q 2asdf"]
        }
    ],
    date: 1683808403140,
    adminToken: "51506aa2-e6ca-4c85-83d0-a287df88f3b1"
};

// states:
// - REGISTRATION
// - ROUND X
// -


class ChatRoom {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessions = [];
        this.host = undefined;

        this.state.blockConcurrencyWhile(async () => {
            this.quiz = await this.state.storage.get("quiz");
            this.adminToken = await this.state.storage.get("adminToken");
            this.answers = await this.state.storage.get("answers") ?? [];
            this.quizState = await this.state.storage.get("state") ?? "REGISTRATION";
            await this.state.storage.put("state", "REGISTRATION");
        });
    }

    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname.slice(1).split("/");
        if (!this.quiz) {
            await this.state.blockConcurrencyWhile(async () => {
                const storedQuiz = JSON.parse(await this.env.QUIZ_PUB_KV.get(path[1]));
                const adminToken = storedQuiz.adminToken;
                delete storedQuiz.adminToken;
                this.quiz = storedQuiz;
                this.adminToken = adminToken;
                await this.state.storage.put("quiz", storedQuiz);
                await this.state.storage.put("adminToken", adminToken);
            });
        }
        const pair = new WebSocketPair();
        const auth = url.searchParams.get("auth");
        if (auth && auth === this.adminToken) {
            await this.createHostSession(pair[1]);
        } else {
            const name = url.searchParams.get("name");
            await this.handleSession(pair[1], name);
        }
        return new Response(null, { status: 101, webSocket: pair[0] });
    }

    async createHostSession(webSocket) {
        webSocket.accept();
        this.host = webSocket;

        webSocket.onopen = () => {
            const players = this.sessions.map(session => session.name);
            const msg = {
                type: "PLAYER_UPDATE",
                value: players
            };
            this.broadcast(msg);
        };

        webSocket.onmessage = msg => {
            webSocket.send(`You are the host ${ msg.data }`);
        };
    }

    async handleSession(webSocket, name) {
        webSocket.accept();

        webSocket.onopen = () => {
            this.sessions.push({ webSocket, name });
            const players = this.sessions.map(session => session.name);
            const msg = {
                type: "PLAYER_UPDATE",
                value: players
            };
            this.broadcast(msg);
        };

        webSocket.onmessage = msg => {
            webSocket.send(`You are a player ${ msg.data }`);
        };
    }

    broadcast(msg) {
        const serializedMsg = JSON.stringify(msg);
        this.sessions.forEach(session => {
            session.webSocket.send(serializedMsg);
        });
        this.host.send(serializedMsg);
    }
}

// name
// quiz

export { ChatRoom };