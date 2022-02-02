const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);
const { createRecord, deleteRecord } = require("../../Models/records/index");
const { createUser } = require("../../Models/user/index");
const { setupDB } = require("../testDbSetup");

setupDB();

const createEndpointTestCases = () => {
  it("Suppose to create new record", async () => {
    const newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const response = await request.post("/record").send({
      user_id: newUser._id,
      date: "123123",
      time: "10mins",
      distance: "20k",
    });
    expect(response.status).toBe(201);
    expect(response.body.data.date).toBe("123123");
    expect(response.body.data.distance).toBe("20k");
    expect(response.body.data.time).toBe("10mins");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const response = await request.post("/record").send({
      user_id: newUser._id,
      date: "",
      time: "10mins",
      distance: "20k",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const response = await request.post("/record").send({
      user_id: newUser._id,
      date: "123",
      time: "",
      distance: "20k",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const response = await request.post("/record").send({
      user_id: newUser._id,
      date: "123123",
      time: "10mins",
      distance: "",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const response = await request.post("/record").send({
      user_id: newUser._id,
      date: "",
      time: "10mins",
      distance: "20k",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
};
const readEndpointTestCases = () => {
  it("Suppose to get record by id", async () => {
    const newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const newRecord = await createRecord({
      user_id: newUser._id,
      date: "123123",
      time: "10mins",
      distance: "20k",
    });
    const response = await request.get(`/record/${newRecord._id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.date).toBe("123123");
    expect(response.body.data.distance).toBe("20k");
    expect(response.body.data.time).toBe("10mins");
  });
  it("Suppose to get error invalid record id ", async () => {
    const newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const newRecord = await createRecord({
      user_id: newUser._id,
      date: "123123",
      time: "10mins",
      distance: "20k",
    });
    let recordId = "Invalid record id";
    const response = await request.get(`/record/${recordId}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Record id must be objectid");
  });
  it("Suppose to get error record no longer exists ", async () => {
    const newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const newRecord = await createRecord({
      user_id: newUser._id,
      date: "123123",
      time: "10mins",
      distance: "20k",
    });
    await deleteRecord(newRecord._id);
    const response = await request.get(`/record/${newRecord._id}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Record no longer exists!");
  });
  //   it("Suppose to get error not authorizied ", async () => {
  //     let newUser = await createNewUser();
  //     const response = await request.get(`/users/${newUser._id}`);
  //     expect(response.status).toBe(401);
  //     expect(response.body.message).toBe("User not authorizied");
  //   });
  it("Suppose to get all records ", async () => {
    const newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const newRecord = await createRecord({
      user_id: newUser._id,
      date: "123123",
      time: "10mins",
      distance: "20k",
    });
    const response = await request.get("/record");
    expect(response.body.data[0].date).toBe("123123");
  });
};
const udpateEndpointTestCases = () => {
  it("Suppose to update record ", async () => {
    const newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const newRecord = await createRecord({
      user_id: newUser._id,
      date: "123123",
      time: "10mins",
      distance: "20k",
    });
    let oldDistance = newRecord.distance;
    const response = await request
      .put(`/record/${newRecord._id}`)
      .send({ distance: "10k" });
    let updatedRole = response.body.data.role;
    expect(response.status).toBe(201);
    expect(oldDistance).not.toEqual(updatedRole);
    expect(response.body.data.distance).toEqual("10k");
  });
  //   it("Suppose to get error not authorizied ", async () => {
  //     let newUser = await createNewUser();
  //     const response = await request
  //       .put(`/users/${newUser._id}`)
  //       .send({ username: "test name" });
  //     expect(response.status).toBe(401);
  //     expect(response.body.message).toEqual("User not authorizied");
  //   });
};
const deleteEndpointTestCases = () => {
  it("Suppose to delete user ", async () => {
    const newUser = await createUser({
      email: "a@a.com",
      password: "123123123",
      role: "Regular",
    });
    const newRecord = await createRecord({
      user_id: newUser._id,
      date: "123123",
      time: "10mins",
      distance: "20k",
    });
    let recordId = newRecord._id;
    let response = await request.delete(`/record/${recordId}`);
    expect(response.status).toBe(202);
    expect(response.body.message).toBe("Success");
  });
  //   it("Suppose to get error not authorizied ", async () => {
  //     let newUser = await createNewUser();
  //     let userId = newUser._id;
  //     let response = await request.delete(`/users/${userId}`);
  //     expect(response.status).toBe(401);
  //     expect(response.body.message).toEqual("User not authorizied");
  //   });
};

const recordTestCases = () => {
  createEndpointTestCases();
  readEndpointTestCases();
  udpateEndpointTestCases();
  deleteEndpointTestCases();
};
describe("Testing Restful API for records", recordTestCases);
