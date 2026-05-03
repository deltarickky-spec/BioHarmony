import { Router, type IRouter } from "express";
import healthRouter from "./health";
import translateRouter from "./translate";
import reportRequestsRouter from "./reportRequests";
import scanRequestsRouter from "./scanRequests";
import adminRouter from "./admin";
import narrateRouter from "./narrate";
import stripeRouter from "./stripe";
import webhooksRouter from "./webhooks";

const router: IRouter = Router();

router.use(healthRouter);
router.use(translateRouter);
router.use(reportRequestsRouter);
router.use(scanRequestsRouter);
router.use(adminRouter);
router.use(narrateRouter);
router.use(stripeRouter);
router.use(webhooksRouter);

export default router;
