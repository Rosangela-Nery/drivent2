import { prisma } from "@/config";

export async function createTicketTypeValid() {
  return prisma.ticketType.create({
    data: {
      name: "Valid",
      price: 1500,
      isRemote: false,
      includesHotel: true,
    }
  });
}
  
export async function createTicketTypeInvalid() {
  return prisma.ticketType.create({
    data: {
      name: "Invalid",
      price: 1500,
      isRemote: true,
      includesHotel: true,
    }
  });
}

export async function createHotels() {
  return prisma.hotel.create({
    data: {
      name: "Hotel Tubalina",
      image: "https://thumbcdn-z.hotelurbano.net/_DDFtBf8ruBMrYb4c1xVXEqzIdU=/444x270/center/middle/filters:quality(40)/https://novo-hu.s3.amazonaws.com/reservas/ota/prod/hotel/529028/enjoy-olimpia-park-resort-002_20191121131749.png",
    }
  });
}

export async function createRooms(id: number) {
  return prisma.room.create({
    data: {
      name: "Suíte Presidencial",
      capacity: 2,
      hotelId: id,
    }
  });
}
