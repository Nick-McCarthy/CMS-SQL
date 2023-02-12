const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

//----------------------MYSQL CONECTION-------------------------------
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE
    }, 
    console.log('Connected to the company_db database.')
);

//---------------------------------------------ADD FUNCTIONS---------------------------------
async function addDepartment() {
    try {
        const choices = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the department?'
                }
                ]);
        
        insertDepartment(choices);
    } catch (err) {
        console.log(err);
    };
};

async function addRole() {
    try {
        const departments = await db.promise().query('SELECT id AS value, name FROM departments');
        const choices = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the name of the role?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?'
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'Which department does the role belong to?',
                    choices: [...departments[0]]
                }
            ]);
        insertRole(choices);
    } catch (err) {
        console.log(err);
    };
};

async function addEmployee() {
    try {
        const employees = await db.promise().query("SELECT id AS value, CONCAT(first_name,' ', last_name) AS name FROM employees");
        const roles = await db.promise().query('SELECT id AS value, title AS name FROM roles');
        const choices = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the employee's first name?"
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the employee's last name?"
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: "What is the employee's role?",
                    choices: [...roles[0]]
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: "Who is the employee's manager?",
                    choices: [{value: null, name: 'none'}, ...employees[0]]
                }
            ]);

        insertEmployee(choices);
    } catch {
        console.log(err);
    };
};


//---------------------------------VIEW FUNCTIONS-------------------------------------
async function viewDepartments() {
    try {
        const res = await db.promise().query('SELECT * FROM departments');

        console.table('', res[0]);
        main();
    } catch (err) {
        console.log(err);
    };
};

async function viewRoles() {
    let sql = 'SELECT roles.id AS id, roles.title AS title, departments.name AS department, roles.salary AS salary FROM roles JOIN departments ON roles.department_id = departments.id';
    try {
        const res = await db.promise().query(sql);
        console.table('', res[0]);
        main();
    } catch (err) {
        console.log(err);
    };
};

async function viewEmployees() {
    let sql = "SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager FROM employees employee LEFT OUTER JOIN employees manager ON employee.manager_id = manager.id JOIN roles ON employee.role_id = roles.id JOIN departments ON roles.department_id = departments.id";
    try{
        const res = await db.promise().query(sql);
        console.table('', res[0]);
        main();
    } catch (err) {
        console.log(err);
    };
};

//---------------------------------INSERT FUNCTIONS-----------------------------------
async function insertDepartment(input) {
    let sql = 'INSERT INTO departments (name) VALUES (?)';
    let params = input.name;
    try{
        await db.promise().query(sql, params);
        console.log(`'${input.name}' department added to the database`);
        main();
    } catch (err) {
        console.log(err);
    };
}

async function insertRole(input) {
    let sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
    let params = [input.title, input.salary, input.department_id];
    try {
        await db.promise().query(sql, params);
        console.log(`'${input.title}' role added to the database`);
        main();
    } catch (err) {
        console.log(err);
    };
};

async function insertEmployee(input) {
    let sql = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    let params = [input.first_name, input.last_name, input.role_id, input.manager_id];
    try {
        await db.promise().query(sql, params);
        console.log(`'${input.first_name} ${input.last_name}' added to the database`);
        main();
    } catch (err) {
        console.log(err);
    };
};

//-------------------------UPDATE--------------------------------------
async function updateEmployeeRole() {
    try {
        const employees = await db.promise().query("SELECT id AS value, CONCAT(first_name,' ', last_name) AS name FROM employees");
        const roles = await db.promise().query('SELECT id AS value, title AS name FROM roles');
        const choices = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'id',
                        message: 'Which employee do you want to update?',
                        choices: [...employees[0]]
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'What is their new role?',
                        choices: [...roles[0]]
                    }]);
        
        updateDB(choices);
    } catch (err) {
        console.log(err);
    };
};

async function updateDB(input) {
    let sql = 'UPDATE employees SET role_id = ? WHERE id = ?';
    let params = [input.role_id, input.id];
    try {
        await db.promise().query(sql, params);
        console.log('Employee updated');
        main();
    } catch (err) {
        console.log(err);
    };
}

//-------------------------------------------MAIN-----------------------------------------------------
async function main() {
    try {
        const choices = await inquirer.prompt([{
                    type: 'list',
                    name: 'next',
                    message: ('What would you like to do?'),
                    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
                }]);

        switch (choices.next) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default: process.exit();
        };
    } catch (err) {
        console.log(err);
    };
};
//-------------------------------------INSTANCE--------------------------------------------
main();