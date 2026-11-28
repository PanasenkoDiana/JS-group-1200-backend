// Відповідає за запуск всього серверу

import { createApp } from "./app.js";
import { config } from "./config.js";

const app = createApp(config);

app.listen(config.port, "0.0.0.0", () => {
	console.log(`Локальный адрес: http://localhost:${config.port}`);
});
