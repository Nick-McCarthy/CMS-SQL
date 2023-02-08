-- view departments
SELECT * FROM departments;
-- view role
SELECT roles.id AS id, roles.title AS title, departments.name AS department, roles.salary AS salary FROM roles JOIN departments ON roles.department_id = departments.id;
-- view employee
SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager
FROM employees employee
LEFT OUTER JOIN employees manager ON employee.manager_id = manager.id
JOIN roles ON employee.role_id = roles.id
JOIN departments ON roles.department_id = departments.id;

-- add department 
INSERT INTO departments (name) VALUES (?)
-- add a role 
INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)
-- add an employee 
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)

-- id/name
SELECT id AS value, name FROM departments;
-- id/title
SELECT id AS value, title AS name FROM roles;
-- id/first/last
SELECT id AS value, CONCAT(first_name,' ', last_name) AS name FROM employees

-- update an employee role 
UPDATE employees SET role_id = ? WHERE id = ?
-- update employee manager
UPDATE employees SET manager_id = ? WHERE manager_id = ?;