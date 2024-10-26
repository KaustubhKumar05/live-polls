const express = require("express");
const redis = require("redis");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
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

async function startServer() {
  try {
    await client.connect();

    // Add new board
    app.post("/api/boards", async (req, res) => {
      try {
        const { key, config } = req.body;
        await client.set(key, JSON.stringify(config));
        console.log(`Board saved - ${key}`);
        res.status(200).json({ message: "Board saved successfully" });
      } catch (err) {
        console.error(`Could not save board ${key}`, err);
        res.status(500).json({ error: "Error saving board" });
      }
    });

    // Retrieve keys -> board names
    app.get("/api/boards", async (_, res) => {
      try {
        const keys = await client.keys("*");
        console.log(`Fetched ${keys.length} boards`);
        res.json(keys);
      } catch (err) {
        console.error(`Error fetching board names:`, err);
        res.status(500).json({ error: "Error retrieving boards" });
      }
    });

    // Get board
    app.get("/api/boards/:key", async (req, res) => {
      try {
        const { key } = req.params;
        const reply = await client.get(key);
        if (reply) {
          console.log(`Fetched config for board - ${key}`);
          res.json(JSON.parse(reply));
        } else {
          console.log(`Could not find config for board - ${key}`);
          res.status(404).json({ error: "Board not found" });
        }
      } catch (err) {
        console.error(`Error fetching board - ${key}:`, err);
        res.status(500).json({ error: "Error retrieving board" });
      }
    });

    // Update board
    app.put("/api/board/:key", async (req, res) => {
      try {
        const { key } = req.params;
        const { config } = req.body;
        if (key === "Default") {
          return res
            .status(400)
            .json({ error: "Default board cannot be updated" });
        }
        const exists = await client.exists(key);
        if (exists) {
          await client.set(key, JSON.stringify(config));
          console.log(`Board updated - ${key}`);
          res.json({ message: "Board updated successfully" });
        } else {
          console.error(`Board not found - ${key}. Could not be updated`);
          res.status(404).json({ error: "Board not found" });
        }
      } catch (err) {
        console.error(`Error updating board ${key}:`, err);
        res.status(500).json({ error: "Error updating board" });
      }
    });

    // Delete board
    app.delete("/api/boards/:key", async (req, res) => {
      try {
        const { key } = req.params;
        if (key === "Default") {
          return res
            .status(400)
            .json({ error: "Default board cannot be deleted" });
        }
        const reply = await client.del(key);
        if (reply === 1) {
          console.log(`Board deleted - ${key}`);
          res.json({ message: "Board deleted successfully" });
        } else {
          console.log(`Board not found for deletion - ${key}`);
          res.status(404).json({ error: "Board not found" });
        }
      } catch (err) {
        console.error(`Error deleting board ${key}:`,err);
        res.status(500).json({ error: "Error deleting board" });
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
