import { notFoundError, paymentRequiredError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Hotel, TicketStatus } from "@prisma/client";

//Listar todos os hoteis
async function getListAllHotels(userId: number) {
  const checkEnrollments = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!checkEnrollments) throw notFoundError();

  const checkTicketPayment = await ticketRepository.findTickeByUserId(userId);

  if(checkTicketPayment.status === "RESERVED") throw paymentRequiredError();

  if(checkTicketPayment.TicketType.isRemote === true || checkTicketPayment.TicketType.includesHotel === false) throw unauthorizedError();

  return await hotelsRepository.findAllHotelsRepository();
}

//Listar os quartos do hotel
async function getListHotelRooms(userId: number, hotelId: number) {
  const checkHotels = await hotelsRepository.findTheRoomsRepository(hotelId);

  if(!checkHotels) throw notFoundError();

  const checkEnrollments = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!checkEnrollments) throw notFoundError();

  const checkTicketPayment = await ticketRepository.findTickeByUserId(userId);

  if(checkTicketPayment.status === "RESERVED") throw paymentRequiredError();

  if(checkTicketPayment.TicketType.isRemote === true || checkTicketPayment.TicketType.includesHotel === false) throw unauthorizedError();

  return checkHotels;
}

const hotelsService = {
  getListAllHotels,
  getListHotelRooms
};
  
export default hotelsService;
