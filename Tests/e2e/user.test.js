const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);
const { createUser, deleteUser } = require("../../Models/user/index");
const { setupDB } = require("../testDbSetup");

setupDB();

const createEndpointTestCases = () => {
  it("Suppose to create new user", async () => {
    const response = await request.post("/user/").send({
      email: "a12@a.com",
      password: "123123123",
      role: "Admin",
    });
    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe("a12@a.com");
    expect(response.body.data.role).toBe("Admin");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/user/").send({
      email: "@a.com",
      password: "123123123",
      role: "Admin",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/user/").send({
      email: "",
      password: "123123123",
      role: "Admin",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/user/").send({
      email: "a@a.com",
      password: "",
      role: "Admin",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/user/").send({
      email: "a@a.com",
      password: "123123123",
      role: "",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/user/").send({
      email: "a@a.com",
      password: "123123",
      role: "Admin",
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
      role: "Admin",
    });
    let response = await request
      .post("/userauth/signin")
      .send({ email: "a123@a.com", password: "123123123" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
    expect(response.headers["set-cookie"].length).toBe(1);
  });
  it("Suppose to get signin user validation error ", async () => {
    let newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Admin",
    });
    let response = await request
      .post("/userauth/signin")
      .send({ email: "@a.com", password: "123123123" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get signin user validation error ", async () => {
    let newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Admin",
    });
    let response = await request
      .post("/userauth/signin")
      .send({ email: "", password: "123123123" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get signin user validation error ", async () => {
    let newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Admin",
    });
    let response = await request
      .post("/userauth/signin")
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
      role: "Admin",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a@a.com", password: "123123123" });
    let response = await request
      .get("/userauth/signout")
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Success");
  });
};
const readEndpointTestCases = () => {
  it("Suppose to get user by id", async () => {
    const newUser = await createUser({
      email: "a1@a.com",
      password: "123123123",
      role: "Admin",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a1@a.com", password: "123123123" });
    const response = await request
      .get(`/user/${newUser._id}`)
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe("a1@a.com");
    expect(response.body.data.role).toBe("Admin");
  });
  it("Suppose to get error invalid user id ", async () => {
    const newUser = await createUser({
      email: "a2@a.com",
      password: "123123123",
      role: "Admin",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a2@a.com", password: "123123123" });
    let userId = "Invalid record id";
    const response = await request
      .get(`/user/${userId}`)
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User id must be objectid");
  });
  it("Suppose to get error not authorizied ", async () => {
    const newUser = await createUser({
      email: "a4@a.com",
      password: "123123123",
      role: "Admin",
    });
    const response = await request.get(`/user/${newUser._id}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("User not authorizied");
  });
  it("Suppose to get all users ", async () => {
    const newUser = await createUser({
      email: "a5@a.com",
      password: "123123123",
      role: "Admin",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a5@a.com", password: "123123123" });
    const response = await request
      .get("/user")
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.body.data[0].email).toBe("a5@a.com");
  });
};
const udpateEndpointTestCases = () => {
  it("Suppose to update user ", async () => {
    const newUser = await createUser({
      email: "a7@a.com",
      password: "123123123",
      role: "Admin",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a7@a.com", password: "123123123" });
    let oldRole = newUser.role;
    const response = await request
      .put(`/user/${newUser._id}`)
      .send({ role: "User Manager" })
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    let updatedRole = response.body.data.role;
    expect(response.status).toBe(201);
    expect(oldRole).not.toEqual(updatedRole);
    expect(response.body.data.role).toEqual("User Manager");
  });
  it("Suppose to get error not authorizied ", async () => {
    const newUser = await createUser({
      email: "a8@a.com",
      password: "123123123",
      role: "Admin",
    });
    const response = await request
      .put(`/user/${newUser._id}`)
      .send({ date: "test name" });
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("User not authorizied");
  });
};
const deleteEndpointTestCases = () => {
  it("Suppose to delete user ", async () => {
    const newUser = await createUser({
      email: "a9@a.com",
      password: "123123123",
      role: "Admin",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a9@a.com", password: "123123123" });
    let userId = newUser._id.valueOf();
    let response = await request
      .delete(`/user/${userId}`)
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(202);
    expect(response.body.message).toBe("Success");
  });
  it("Suppose to get error not authorizied ", async () => {
    const newUser = await createUser({
      email: "a99@a.com",
      password: "123123123",
      role: "Admin",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a@a.com", password: "123123123" });
    let response = await request.delete(`/user/${newUser._id}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("User not authorizied");
  });
};
const userTestCases = () => {
  createEndpointTestCases(),
    signinEndpointTestCases(),
    signoutEndpointTestCases(),
    deleteEndpointTestCases(),
    udpateEndpointTestCases(),
    readEndpointTestCases();
};
describe("Testing Restful API for users", userTestCases);
