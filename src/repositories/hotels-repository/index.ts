import { prisma } from "@/config";

//Listar todos os hoteis
async function findAllHotelsRepository() {
  return prisma.hotel.findMany();
}

//Listar os quartos do hotel
async function findTheRoomsRepository(hotelId: number) {
  return prisma.room.findMany({
    where: {
      id: hotelId
    }
  });
}

const hotelsRepository = {
  findAllHotelsRepository,
  findTheRoomsRepository
};
  
export default hotelsRepository;
