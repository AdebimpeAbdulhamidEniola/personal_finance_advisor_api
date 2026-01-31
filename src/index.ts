import { createApp } from "./config/app";

const app = createApp();

const port = Number(process.env.PORT)  

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});