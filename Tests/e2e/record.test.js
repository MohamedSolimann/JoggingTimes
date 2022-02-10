const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);
const { createRecord } = require("../../Models/records/index");
const { createUser } = require("../../Models/user/index");
const { setupDB } = require("../testDbSetup");

setupDB();

const createEndpointTestCases = () => {
  it("Suppose to create new record", async () => {
    const newUser = await createUser({
      email: "mohamed@gmail.com",
      password: "12312312311",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "mohamed@gmail.com", password: "12312312311" });
    const response = await request
      .post("/record")
      .send({
        date: { year: "2022", month: "2", day: "4" },
        time: "10",
        distance: "20",
      })
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(201);
    expect(response.body.data.date).toBe("2022-02-04T00:00:00.000Z");
    expect(response.body.data.distance).toBe("20");
    expect(response.body.data.time).toBe("10");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const newUser = await createUser({
      email: "a1234@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a1234@a.com", password: "123123123" });
    const response = await request
      .post("/record")
      .send({
        date: "",
        time: "10",
        distance: "20",
      })
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const newUser = await createUser({
      email: "ab@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "ab@a.com", password: "123123123" });
    const response = await request
      .post("/record")
      .send({
        date: "123",
        time: "",
        distance: "20",
      })
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const newUser = await createUser({
      email: "abb@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "abb@a.com", password: "123123123" });
    const response = await request
      .post("/record")
      .send({
        date: { year: "2022", month: "2", day: "4" },
        time: "10",
        distance: "",
      })
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const newUser = await createUser({
      email: "a1b@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a1b@a.com", password: "123123123" });
    const response = await request
      .post("/record")
      .send({
        date: "",
        time: "10",
        distance: "20",
      })
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
};
const readEndpointTestCases = () => {
  it("Suppose to get record by id", async () => {
    const newUser = await createUser({
      email: "a1@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a1@a.com", password: "123123123" });
    const newRecord = await createRecord(
      {
        date: { year: "2022", month: "2", day: "4" },
        time: "10",
        distance: "20",
      },
      newUser._id
    );
    const response = await request
      .get(`/record/${newRecord._id}`)
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(200);
    expect(response.body.data.date).toBe("2022-02-04T00:00:00.000Z");
    expect(response.body.data.distance).toBe("20");
    expect(response.body.data.time).toBe("10");
  });
  it("Suppose to get error invalid record id ", async () => {
    const newUser = await createUser({
      email: "a2@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a2@a.com", password: "123123123" });
    const newRecord = await createRecord(
      {
        date: { year: "2022", month: "2", day: "4" },
        time: "10",
        distance: "20",
      },
      newUser._id
    );
    let recordId = "Invalid record id";
    const response = await request
      .get(`/record/${recordId}`)
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please check the record id");
  });

  it("Suppose to get error not authorizied ", async () => {
    const newUser = await createUser({
      email: "a4@a.com",
      password: "123123123",
      role: "Regular",
    });
    const newRecord = await createRecord(
      {
        date: { year: "2022", month: "2", day: "4" },
        time: "10",
        distance: "20",
      },
      newUser._id
    );
    const response = await request.get(`/record/${newRecord._id}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("User not authorizied");
  });
  it("Suppose to get all records ", async () => {
    const newUser = await createUser({
      email: "a5@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a5@a.com", password: "123123123" });
    const newRecord = await createRecord(
      {
        date: { year: "2022", month: "02", day: "04" },
        time: "10",
        distance: "20",
      },
      newUser._id
    );
    const response = await request
      .get("/record")
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.body.data[0].date).toBe("2022-02-04T00:00:00.000Z");
  });
};
const udpateEndpointTestCases = () => {
  it("Suppose to update record distance", async () => {
    const newUser = await createUser({
      email: "a7@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a7@a.com", password: "123123123" });
    const newRecord = await createRecord(
      {
        date: { year: "2022", month: "2", day: "4" },
        time: "10",
        distance: "20",
      },
      newUser._id
    );
    let oldDistance = newRecord.distance;
    const response = await request
      .put(`/record/${newRecord._id}`)
      .send({ distance: "10" })
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    let updatedDistance = response.body.data.distance;
    expect(response.status).toBe(201);
    expect(oldDistance).not.toEqual(updatedDistance);
    expect(response.body.data.distance).toEqual("10");
  });
  it("Suppose to update record time", async () => {
    const newUser = await createUser({
      email: "a7@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a7@a.com", password: "123123123" });
    const newRecord = await createRecord(
      {
        date: { year: "2022", month: "2", day: "4" },
        time: "5",
        distance: "20",
      },
      newUser._id
    );
    let oldTime = newRecord.distance;
    const response = await request
      .put(`/record/${newRecord._id}`)
      .send({ time: "10" })
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    let updatedTime = response.body.data.time;
    expect(response.status).toBe(201);
    expect(oldTime).not.toEqual(updatedTime);
    expect(response.body.data.time).toEqual("10");
  });
  it("Suppose to update record distance and time", async () => {
    const newUser = await createUser({
      email: "a7@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a7@a.com", password: "123123123" });
    const newRecord = await createRecord(
      {
        date: { year: "2022", month: "2", day: "4" },
        time: "5",
        distance: "20",
      },
      newUser._id
    );
    let oldDistance = newRecord.distance;
    let oldTime = newRecord.distance;
    const response = await request
      .put(`/record/${newRecord._id}`)
      .send({ time: "10", distance: "10" })
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    let updatedTime = response.body.data.time;
    let updatedDistance = response.body.data.distance;
    expect(response.status).toBe(201);
    expect(oldTime).not.toEqual(updatedTime);
    expect(oldDistance).not.toEqual(updatedDistance);
    expect(response.body.data.distance).toEqual("10");
    expect(response.body.data.time).toEqual("10");
  });
  it("Suppose to get error not authorizied ", async () => {
    const newUser = await createUser({
      email: "a8@a.com",
      password: "123123123",
      role: "Regular",
    });
    const newRecord = await createRecord(
      {
        date: { year: "2022", month: "2", day: "4" },
        time: "10",
        distance: "20",
      },
      newUser._id
    );
    const response = await request
      .put(`/record/${newRecord._id}`)
      .send({ date: "test name" });
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("User not authorizied");
  });
};
const deleteEndpointTestCases = () => {
  it("Suppose to delete record ", async () => {
    const newUser = await createUser({
      email: "a9@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/userauth/signin")
      .send({ email: "a9@a.com", password: "123123123" });
    const newRecord = await createRecord(
      {
        date: { year: "2022", month: "2", day: "4" },
        time: "10",
        distance: "20",
      },
      newUser._id
    );
    let recordId = newRecord._id;
    let response = await request
      .delete(`/record/${recordId}`)
      .set({ Cookie: signinResponse.headers["set-cookie"] });
    expect(response.status).toBe(202);
    expect(response.body.message).toBe("Success");
  });
  it("Suppose to get error not authorizied ", async () => {
    const newUser = await createUser({
      email: "a99@a.com",
      password: "123123123",
      role: "Regular",
    });
    const signinResponse = await request
      .post("/user/signin")
      .send({ email: "a@a.com", password: "123123123" });
    const newRecord = await createRecord(
      {
        date: { year: "2022", month: "2", day: "4" },
        time: "10",
        distance: "20",
      },
      newUser._id
    );
    let response = await request.delete(`/record/${newRecord._id}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("User not authorizied");
  });
};

const recordTestCases = () => {
  createEndpointTestCases();
  readEndpointTestCases();
  udpateEndpointTestCases();
  deleteEndpointTestCases();
};
describe("Testing Restful API for records", recordTestCases);
