import { prisma } from "@/config";

//Listar todos os hoteis
async function findAllHotelsRepository() {
  return prisma.hotel.findMany();
}

//Listar os quartos do hotel
async function findTheRoomsRepository(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId
    },
    include: {
      Rooms: true
    }
  });
}

const hotelsRepository = {
  findAllHotelsRepository,
  findTheRoomsRepository
};
  
export default hotelsRepository;
