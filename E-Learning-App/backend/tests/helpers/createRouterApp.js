import express from "express";

export function createRouterApp(router) {
    const app = express();
    app.use(express.json());
    app.use(router);
    return app;
}
