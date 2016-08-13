import { Router } from "express";
import ctrls from "./controllers";

const router = Router();

router
.get("/users", ctrls.users.list)
.all("*", ctrls.general.notFound);

export default router;
