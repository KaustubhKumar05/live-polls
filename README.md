# Live Polls

Polls built on top of [Liveblocks](https://liveblocks.io) (client, react and node SDKs). This project uses:

- React + Vite
- Zustand
- Express
- Redis

## Flow:

After adding questions, the author can launch the quiz. First, a quiz ID is created which is used to map quiz to a liveblocks room and also the key to the redis entries. This quiz ID and an `active` field are set in the room metadata and the questions are stored in redis. After completion, the author is also redirected to the attempt view.

The room ID is fetched in the attempt flow using metadata filters to match the quiz ID. Then the questions are fetched from redis. The responses are stored in a LiveList. The author can stop the quiz through the UI - this sets the `active` field in the room metadata to `false` and broadcasts an event to all peers in the room, updating their UI as well. Once the quiz is stopped, existing and new joinees can still see the questions and submitted responses but cannot submit new ones.

### Hosting

The frontend is hosted on [Vercel](https://vercel.com): [Deployment link](https://live-polls-demo.vercel.app)

The node server is hosted on [Railway](https://railway.app)

### Further improvements

- Quizzes - specify correct answers
- Multicorrect type
- Metrics for time taken to submit per question
- Leaderboard?

### Other dependencies

TailwindCSS, react-router-dom, react-toastify, lucide-icons
