import express from "express"
import 'dotenv/config'
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from 'cors'
import { auth } from "./lib/auth.js"

const app = express()

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.all("/api/auth/*splat", toNodeHandler(auth))

app.use(express.json());


app.get("/device", async (req, res) => {
    const { user_code } = req.query
    res.redirect(`http://localhost:3000/device?user_code=${user_code}`)
})

app.get('/health', (req, res) => {
    res.send("OK")
})

app.get("/api/me", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
});


app.listen(process.env.PORT, () => {
    console.log(`Server Running on ${process.env.PORT}`);
})