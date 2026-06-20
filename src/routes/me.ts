import { Router } from "express";
import { requireAccessToken } from "../middleware/permissions/auth";
import { container } from "../config/dependencies";

const router = Router();
const { meController } = container.controllers;

router.get('/tickets', requireAccessToken, meController.getMyTickets);
