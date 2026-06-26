import { Router, type IRouter } from "express";
import healthRouter from "./health";
import translateRouter from "./translate";
import reportRequestsRouter from "./reportRequests";
import scanRequestsRouter from "./scanRequests";
import adminRouter from "./admin";
import narrateRouter from "./narrate";
import stripeRouter from "./stripe";
import webhooksRouter from "./webhooks";
import promoRouter from "./promo";
import practitionersRouter from "./practitioners";
import feedbackRouter from "./feedback";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(translateRouter);
router.use(reportRequestsRouter);
router.use(scanRequestsRouter);
router.use(adminRouter);
router.use(narrateRouter);
router.use(stripeRouter);
router.use(webhooksRouter);
router.use(promoRouter);
router.use(practitionersRouter);
router.use(feedbackRouter);
router.use(authRouter);

export default router;
