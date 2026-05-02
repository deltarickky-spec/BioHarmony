import { Router, type IRouter } from "express";
import healthRouter from "./health";
import translateRouter from "./translate";
import reportRequestsRouter from "./reportRequests";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(translateRouter);
router.use(reportRequestsRouter);
router.use(adminRouter);

export default router;
