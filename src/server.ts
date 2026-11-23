import { config } from "./config.js";
import { createApp } from "./app.js";

const app = createApp(config);

app.listen(config.port, "0.0.0.0", () => {
    console.log(`Локальный адрес: http://localhost:${config.port}`);
});