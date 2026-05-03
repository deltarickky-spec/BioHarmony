import { Router, type IRouter } from "express";
import healthRouter from "./health";
import translateRouter from "./translate";
import reportRequestsRouter from "./reportRequests";
import scanRequestsRouter from "./scanRequests";
import adminRouter from "./admin";
import narrateRouter from "./narrate";
import stripeRouter from "./stripe";

const router: IRouter = Router();

router.use(healthRouter);
router.use(translateRouter);
router.use(reportRequestsRouter);
router.use(scanRequestsRouter);
router.use(adminRouter);
router.use(narrateRouter);
router.use(stripeRouter);

export default router;
