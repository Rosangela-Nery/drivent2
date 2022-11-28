import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import httpStatus from "http-status";
import { TicketStatus } from "@prisma/client";
import { createEnrollmentWithAddress, createUser, createHotels, createTicket, createTicketTypeValid, createTicketTypeInvalid, createRooms } from "../factories";

beforeAll(async () => {
  await init();
});
  
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
      const token = await generateValidToken();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 if ticket was booked!", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeValid();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 401 if the bill has not been paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeInvalid();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and with hotels data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeValid();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      await createHotels();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`); 

      expect(response.status).toBe(httpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/:hotelId");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
    const token = await generateValidToken();

    const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("should respond with status 402 if ticket was booked!", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeValid();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    const hotels = await createHotels();

    const response = await server.get(`/hotels/${hotels.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it("should respond with status 401 if the bill has not been paid", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeInvalid();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotels = await createHotels();

    const response = await server.get(`/hotels/${hotels.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 200 and with rooms data", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeValid();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotels = await createHotels();
    const room = await createRooms(hotels.id);

    const response = await server.get(`/hotels/${hotels.id}`).set("Authorization", `Bearer ${token}`); 

    expect(response.status).toBe(httpStatus.OK);
    expect.arrayContaining([
      expect.objectContaining({
        id: hotels.id,
        name: hotels.name,
        image: hotels.image,
        createdAt: hotels.createdAt.toISOString(),
        updatedAt: hotels.updatedAt.toISOString(),
        Rooms: expect.arrayContaining([
          expect.objectContaining({
            id: room.id,
            hotelId: room.hotelId,
            name: room.name,
            capacity: room.capacity,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
          }),
        ]),
      }),
    ]);
  });
});
