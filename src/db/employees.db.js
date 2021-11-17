const pool = require("./connection.db");
const DEPARTAMENTOS_EMPLEADOS = "dept_emp";
const EMPLEADOS = "employees";
const DEPARTAMENTOS = "departments";
const SALARIOS = "salaries";
const DEPARTAMENTOS_MANAGER = "dept_manager";

/**
 * Retorna el empleados de un Departamento
 * @param {Object} departamento
 * @returns
 */
module.exports.getEmployeesByDept = async function (departamento) {
  let conn;

  try {
    conn = await pool.getConnection();

    const empleados = await conn.query(
      `
    SELECT e.* FROM ${EMPLEADOS} e
    INNER JOIN ${DEPARTAMENTOS_EMPLEADOS} de ON de.emp_no = e.emp_no
    INNER JOIN ${DEPARTAMENTOS} dp ON dp.dept_no = de.dept_no
    WHERE dp.dept_no=?
    `,
      [departamento.dept_no]
    );

    return empleados;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Retorna un departamento por su clave primaria
 * @returns
 */
module.exports.getById = async function (id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT * FROM ${EMPLEADOS} e WHERE e.emp_no=?`,
      [id]
    );
    return rows[0];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Cambiar departamento de un empleado
 * @returns
 */
module.exports.putEmployeeToDept = async function (empleado, departamento) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `UPDATE ${DEPARTAMENTOS_EMPLEADOS} dp SET dp.dept_no=?, dp.to_date="9999-01-01" WHERE dp.emp_no=?`,
      [departamento.dept_no, empleado.emp_no]
    );
    return rows[0];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Cambiar departamento de un manager
 * @returns
 */
module.exports.putManagerToDept = async function (manager, departamento) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `UPDATE ${DEPARTAMENTOS_MANAGER} dp SET dp.dept_no=?, dp.to_date="9999-01-01" WHERE dp.emp_no=?`,
      [departamento.dept_no, manager.emp_no]
    );
    return rows[0];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Retorna un salarios de un empleado
 * @returns
 */
module.exports.getSalariesByEmployee = async function (empleado) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT * FROM ${SALARIOS} s WHERE s.emp_no=?`,
      [empleado.emp_no]
    );
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Retorna un salarios de un empleado
 * @returns
 */
module.exports.postSalary = async function (empleado, salary) {
  let conn;
  try {
    conn = await pool.getConnection();
    let d = new Date();
    d = new Date(d.getTime() - 3000000);
    const date_format_str =
      d.getFullYear().toString() +
      "-" +
      ((d.getMonth() + 1).toString().length == 2
        ? (d.getMonth() + 1).toString()
        : "0" + (d.getMonth() + 1).toString()) +
      "-" +
      (d.getDate().toString().length == 2
        ? d.getDate().toString()
        : "0" + d.getDate().toString());

    const rows = await conn.query(
      `INSERT INTO ${SALARIOS} (emp_no,salary,from_date,to_date) VALUES(?,?,?,?)`,
      [empleado.emp_no, salary, date_format_str, "9999-01-01"]
    );
    const rows2 = await conn.query(
      `SELECT * FROM ${SALARIOS} s WHERE s.emp_no=?`,
      [empleado.emp_no]
    );
    return rows2;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};
