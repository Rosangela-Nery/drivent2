import { AuthenticatedRequest } from "@/middlewares";
import ticketService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    // const ticketTypes = await ticketService.getTicketTypes();

    return res.status(httpStatus.OK).send();
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getHotelId(req: AuthenticatedRequest, res: Response) {
  try {
    //   const ticketTypes = await ticketService.getTicketTypes();
  
    return res.status(httpStatus.OK).send();
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
