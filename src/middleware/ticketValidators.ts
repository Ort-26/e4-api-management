import { body, param } from 'express-validator';
import { validateRequest } from './validateRequest';

export const validateCreateTicket = [
  body('ticketTitle')
    .exists({ values: 'falsy' }).withMessage('ticketTitle is required')
    .bail().isString().withMessage('ticketTitle must be a string')
    .bail().trim().notEmpty().withMessage('ticketTitle cannot be empty'),
  body('ticketDesc')
    .optional().isString().withMessage('ticketDesc must be a string').trim(),
  body('statusId')
    .optional().isInt({ min: 1 }).withMessage('statusId must be a positive integer').toInt(),
  validateRequest,
];

export const validateTicketIdParam = [
  param('ticketId')
    .isInt({ min: 1 }).withMessage('ticketId must be a positive integer').toInt(),
  validateRequest,
];

export const validateTicketIdStatus = [
  param('ticketId')
    .isInt({ min: 1 }).withMessage('ticketId must be a positive integer').toInt(),
  param('statusId')
    .isInt({ min: 1 }).withMessage('statusId must be a positive integer').toInt(),
  validateRequest,
];

export const validateTicketIdAgent = [
  param('ticketId')
    .isInt({ min: 1 }).withMessage('ticketId must be a positive integer').toInt(),
  param('agentId')
    .isInt({ min: 1 }).withMessage('agentId must be a positive integer').toInt(),
  validateRequest,
];

export const validateCreateTicketComment = [
  param('ticketId')
    .isInt({ min: 1 }).withMessage('ticketId must be a positive integer').toInt(),
  body('content')
    .exists({ values: 'falsy' }).withMessage('content is required')
    .bail().isString().withMessage('content must be a string')
    .bail().trim().notEmpty().withMessage('content cannot be empty'),
  validateRequest,
];
