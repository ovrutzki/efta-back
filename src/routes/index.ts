import express from "express";
import courseRouter from "./course.route";
import daysRouter from "./days.route";
import mondayRouter from "./monday.route";
import userRouter from "./user.route";
import attendanceRouter from "./attendanceRouter";

const router = express.Router();

router.use("/api/users/", userRouter);
router.use("/api/course/", courseRouter);
router.use("/api/days/", daysRouter);
router.use("/api/monday/", mondayRouter);
router.use("/api/attendance/", attendanceRouter);

export default router;

  