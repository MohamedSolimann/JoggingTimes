const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);
const mongoose = require("mongoose");
const { createUser } = require("../../Models/user/index");
const { setupDB } = require("../testDbSetup");

setupDB();

const singupEndpointTestCases = () => {
  it("Suppose to create new user", async () => {
    const response = await request.post("/user/signup").send({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe("a@a.com");
    expect(response.body.data.role).toBe("Regular");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/user/signup").send({
      email: "@a.com",
      password: "123123123",
      role: "Regular",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/user/signup").send({
      email: "",
      password: "123123123",
      role: "Regular",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/user/signup").send({
      email: "a@a.com",
      password: "",
      role: "Regular",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/user/signup").send({
      email: "a@a.com",
      password: "123123123",
      role: "",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/user/signup").send({
      email: "a@a.com",
      password: "123123",
      role: "Regular",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
};
const restApiTestCases = () => {
  singupEndpointTestCases();
};
describe("Testing Restful API for users", restApiTestCases);
