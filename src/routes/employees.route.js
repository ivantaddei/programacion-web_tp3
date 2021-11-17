const express = require("express");
const router = express.Router();
const DB = require("../db");

// GET /api/v1/empleados/departamento/:id
router.get("/departamento/:id", async (req, res) => {
  const depto = await DB.Departmens.getById(req.params.id);
  if (depto) {
    const empleados = await DB.Employees.getEmployeesByDept(depto);
    res.status(200).json(empleados);
  } else {
    res.status(404).send("Departamento no encontrado!!!");
  }
});

// PUT /api/v1/empleados/:emp_no/departamento/:dept_no
router.put("/:emp_no/departamento/:dept_no", async (req, res) => {
  const depto = await DB.Departmens.getById(req.params.dept_no);
  if (!depto) {
    res.status(404).send("Departamento no encontrado!!!");
    return;
  }

  const empleado = await DB.Employees.getById(req.params.emp_no);
  if (!empleado) {
    res.status(404).send("Empleado no encontrado!!!");
    return;
  }

  const nuevoEmpleado = await DB.Employees.putEmployeeToDept(empleado, depto);
  res.status(200).json(nuevoEmpleado);
});
// PUT /api/v1/empleados/manager/:emp_no/departamento/:dept_no
router.put("/manager/:emp_no/departamento/:dept_no", async (req, res) => {
  const depto = await DB.Departmens.getById(req.params.dept_no);
  if (!depto) {
    res.status(404).send("Departamento no encontrado!!!");
    return;
  }

  const empleado = await DB.Employees.getById(req.params.emp_no);
  if (!empleado) {
    res.status(404).send("Manager no encontrado!!!");
    return;
  }

  const nuevoEmpleado = await DB.Employees.putManagerToDept(empleado, depto);
  res.status(200).json(nuevoEmpleado);
});

// PUT /api/v1/empleados/:emp_no/salarios
router.get("/:emp_no/salarios", async (req, res) => {
  const empleado = await DB.Employees.getById(req.params.emp_no);

  if (!empleado) {
    res.status(404).send("Empleado no encontrado!!!");
    return;
  }

  const salarios = await DB.Employees.getSalariesByEmployee(empleado);
  res.status(200).json(salarios);
});

// POST /api/v1/empleados/:emp_no/salarios
router.post("/:emp_no/salarios", async (req, res) => {
  const empleado = await DB.Employees.getById(req.params.emp_no);
  if (!empleado) {
    res.status(404).send("Empleado no encontrado!!!");
    return;
  }
  if (!req.body.salary) {
    res.status(404).send("Ingrese un salario nuevo!!!");
    return;
  }
  const salarios = await DB.Employees.postSalary(empleado, req.body.salary);
  res.status(200).json(salarios[salarios.length - 1]);
});

module.exports = router;
