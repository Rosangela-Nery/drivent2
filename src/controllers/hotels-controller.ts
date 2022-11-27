import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

//Listar todos os hoteis
export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req.body;

  try {
    const hotelsTypes = await hotelsService.getListAllHotels(userId);

    return res.status(httpStatus.OK).send(hotelsTypes);
  } catch (error) {
    if(error.name === "PaymentRequiredError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}

//Listar os quartos do hotel
export async function getHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId, hotelId } = req.body;

  try {
    const hotelsTypes = await hotelsService.getListHotelRooms(userId, hotelId);
  
    return res.status(httpStatus.OK).send(hotelsTypes);
  } catch (error) {
    if(error.name === "PaymentRequiredError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}
