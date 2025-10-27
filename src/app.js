import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roleRoutes from "./routes/role.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import notFound from "./middlewares/notFound.js";

// Express
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use(notFound);

export default app;
