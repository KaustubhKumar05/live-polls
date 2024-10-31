const express = require("express");
const Liveblocks = require("@liveblocks/node").Liveblocks;
const cors = require("cors");
const redis = require("redis");
const crypto = require("crypto");

require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: true, // Allow all origins - for development
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Redis Client Connected"));

const liveblocks = new Liveblocks({ secret: process.env.LB_SECRET_KEY });

async function startServer() {
  try {
    await client.connect();
    app.post("/api/create-room", async (req, res) => {
      try {
        const roomID = crypto.randomUUID();
        const quizID = (100000 + Math.floor(Math.random() * 909999)).toString();
        const { questions } = req.body;
        await client.set(quizID, JSON.stringify(questions));

        const room = await liveblocks.createRoom(roomID, {
          // The default room permissions. `[]` for private, `["room:write"]` for public.
          defaultAccesses: ["room:write"],
          metadata: {
            quizID,
            active: "true",
          },
        });
        return res
          .status(200)
          .json({ id: room.id, questions, quizID, active: true });
      } catch (err) {
        console.error("Failed", err);
        return res.status(500).json({ error: "Could not launch the quiz" });
      }
    });
    // ID is the quiz ID
    app.get("/api/get-room/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const reply = await client.get(id);
        const { data: rooms } = await liveblocks.getRooms({
          limit: 1,
          query: {
            metadata: {
              quizID: id.toString(),
            },
          },
        });

        if (rooms.length === 0) {
          return res.status(400).json({ error: "Quiz not found" });
        }

        return res.status(200).json({
          id: rooms[0].id,
          questions: reply,
          active: rooms[0].metadata.active,
        });
      } catch (err) {
        console.error(`Error fetching quiz:`, err);
        return res.status(500).json({ error: "Could not find the quiz" });
      }
    });

    app.post("/api/stop-quiz", async (req, res) => {
      try {
        const { roomID, quizID } = req.body;
        const room = await liveblocks.updateRoom(roomID, {
          metadata: { active: "false", quizID },
        });
        if (room.metadata.active === "false") {
          return res.status(200).json({ message: "Quiz stopped", ok: true });
        }
        throw "Could not update room metadata";
      } catch (err) {
        console.error(`Error stopping quiz:`, err);
        return res.status(500).json({ error: "Could not stop the quiz" });
      }
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start the server:", err);
    process.exit(1);
  }
}

startServer();
