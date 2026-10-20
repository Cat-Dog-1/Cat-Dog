import "dotenv/config";
import express from "express";
import cors from "cors";

import productosRouter from "./routes/productos.js";
import usuariosRouter from "./routes/usuarios.js";
import mensajesRouter from "./routes/mensajes.js";
import pedidosRouter from "./routes/pedidos.js";

const app = express();

app.use(cors()); // permite que la página (React o Live Server) hable con el backend
app.use(express.json());

app.get("/", (req, res) => res.send("API CatDog funcionando ✅"));

app.use("/api/productos", productosRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/mensajes", mensajesRouter);
app.use("/api/pedidos", pedidosRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor backend en http://localhost:${PORT}`));
