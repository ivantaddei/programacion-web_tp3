require("dotenv").config();
const app = require("../src/app");
const request = require("supertest");

describe("Rest API Empleados", () => {
  it("GET /api/v1/empleados/departamento/:id", async () => {
    const response = await request(app).get(
      "/api/v1/empleados/departamento/d009"
    );
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const empleados = response.body;
    expect(empleados.length).toBeGreaterThan(0);
  });

  it("GET /api/v1/empleados/departamento/:id empleados existentes", async () => {
    const response = await request(app).get(
      "/api/v1/empleados/departamento/d009"
    );
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const empleados = response.body;
    expect(empleados.length).toBeGreaterThan(0);
  });

  it("GET /api/v1/empleados/departamento/d00099", async () => {
    const response = await request(app).get(
      "/api/v1/empleados/departamento/d00099"
    );
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Departamento no encontrado!!!");
  });

  it("GET /api/v1/empleados/departamento/ sin parámetros", async () => {
    const response = await request(app)
      .post("/api/v1/empleados/departamento/")
      .send();
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(404);
  });

  it("GET /api/v1/empleados/:emp_no/salarios traer más de un salario", async () => {
    const response = await request(app)
      .get("/api/v1/empleados/10001/salarios")
      .send();
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const salarios = response.body;
    expect(salarios.length).toBeGreaterThan(0);
  });

  it("GET /api/v1/empleados/:emp_no/salarios salarios pertenecientes a un empleado", async () => {
    const response = await request(app)
      .get("/api/v1/empleados/10001/salarios")
      .send();
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const salarios = response.body;
    for (let salario of salarios) {
      expect(salario.emp_no).toBe(10001);
    }
  });

  it("POST /api/v1/empleados/:emp_no/salarios crear nuevo salario", async () => {
    const firstResponse = await request(app)
      .get("/api/v1/empleados/10003/salarios")
      .send();
    const response = await request(app)
      .post("/api/v1/empleados/10003/salarios")
      .send({ salary: 50 });
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const secondResponse = await request(app)
      .get("/api/v1/empleados/10003/salarios")
      .send();
    expect(firstResponse.body.length).toBe(secondResponse.body.length - 1);
  });

  it("POST /api/v1/empleados/:emp_no/salarios crear nuevo salario", async () => {
    const response = await request(app)
      .post("/api/v1/empleados/10008/salarios")
      .send({ salary: 50 });
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    console.log(response.body);
    expect(response.body.to_date).toBe("9999-01-01T03:00:00.000Z");
  });

  it("PUT /api/v1/empleados/:emp_no/departamento/:dept_no no encontrar emp", async () => {
    const response = await request(app)
      .put("/api/v1/empleados/1/departamento/d009")
      .send();
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Empleado no encontrado!!!");
  });

  it("PUT /api/v1/empleados/:emp_no/departamento/:dept_no no encontrar dept", async () => {
    const response = await request(app)
      .put("/api/v1/empleados/10001/departamento/d0009")
      .send();
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Departamento no encontrado!!!");
  });

  it("PUT /api/v1/empleados/:emp_no/departamento/:dept_no no encontrar dept", async () => {
    const res = await request(app)
      .get("/api/v1/empleados/departamento/d009")
      .send();
    expect(res.body.emp_no).not.toBe(10001);
    expect(res).toBeDefined();
  });
});
