const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);
const { createUser } = require("../../Models/user/index");
const { setupDB } = require("../testDbSetup");

setupDB();

const signupEndpointTestCases = () => {
  it("Suppose to create new user", async () => {
    const response = await request.post("/user/signup").send({
      email: "a12@a.com",
      password: "123123123",
      role: "Regular",
    });
    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe("a12@a.com");
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
const signinEndpointTestCases = () => {
  it("Suppose to signin user ", async () => {
    let newUser = await createUser({
      email: "a123@a.com",
      password: "123123123",
      role: "Regular",
    });
    let response = await request
      .post("/user/signin")
      .send({ email: "a123@a.com", password: "123123123" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
    expect(response.headers["set-cookie"].length).toBe(1);
  });
  it("Suppose to get signin user validation error ", async () => {
    let newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    let response = await request
      .post("/user/signin")
      .send({ email: "@a.com", password: "123123123" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get signin user validation error ", async () => {
    let newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    let response = await request
      .post("/user/signin")
      .send({ email: "", password: "123123123" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get signin user validation error ", async () => {
    let newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    let response = await request
      .post("/user/signin")
      .send({ email: "a@a.com", password: "" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
};
const signoutEndpointTestCases = () => {
  it("Suppose to signout user ", async () => {
    let newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/user/signin")
      .send({ email: "a@a.com", password: "123123123" });
    let response = await request
      .get("/user/signout")
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Success");
  });
};
const userTestCases = () => {
  signupEndpointTestCases(),
    signinEndpointTestCases(),
    signoutEndpointTestCases();
};
describe("Testing Restful API for users", userTestCases);
