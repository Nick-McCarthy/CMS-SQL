const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE
    },
    console.log('Connected to the company_db.')
);

//-------------------------------------------MAIN----------------------------------------------------
async function main() {
        inquirer.prompt(
            [
                {
                    type: 'list',
                    message: "What would you like to do?",
                    name: 'main',
                    choices: ['View Departments', 'View Roles', 'View Employees', 'New Department', 'New Role', 'New Employee', 'Update Employee', 'End'],
                    validate: (value) => { if (value) { return true } else { return "Please Select an Option" } },
                },

            ])
        .then(({ main }) => {
            if (main === 'View Departments') {
                viewDepartments();
            } else if (main === 'View Roles') {
                viewRoles();
            } else if (main === 'View Employees') {
                viewEmployees();
            } else if (main === 'New Department') {
                newDepartment();
            } else if (main === 'New Role') {
                newRole();
            } else if (main === 'New Employee') {
                newEmployee();
            } else if (main === 'Update Employee') {
                updateEmployeeRole();
            } else {
                process.exit();
            }
        })
        .catch((error) => {
            console.log(error)
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
                console.log(error)
            } else {
                // Something else went wrong
                console.log("beats me hoss")
            }
        });

};

//-----------------------------NEW ENTRY FUNCTIONS--------------------------

async function newDepartment() {
    try {
        const userInputs = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the department name?'
            }
        ]);
        insertDepartment(userInputs);
    } catch (err) {
        console.log(err);
    };
};

async function newRole() {
    try {
        const departments = await db.promise().query('SELECT id AS value, name FROM departments');

        const userInputs = await inquirer.prompt([
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

        insertRole(userInputs);
    } catch (err) {
        console.log(err);
    };
};

async function newEmployee() {
    try {
        const employees = await db.promise().query("SELECT id AS value, CONCAT(first_name,' ', last_name) AS name FROM employees");
        const roles = await db.promise().query('SELECT id AS value, title AS name FROM roles');
        const userInputs = await inquirer.prompt([
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
                choices: [{ value: null, name: 'none' }, ...employees[0]]
            }
        ]);
        insertEmployee(userInputs);
    } catch {
        console.log(err);
    };
};

//-----------------------------VIEW FUNCTIONS--------------------------

async function viewDepartments() {
    try {
        const results = await db.promise().query('SELECT * FROM departments');

        console.table('', results[0]);
        main();
    } catch (err) {
        console.log(err);
    };
};

async function viewRoles() {
    let sql = 'SELECT roles.id AS id, roles.title AS title, departments.name AS department, roles.salary AS salary FROM roles JOIN departments ON roles.department_id = departments.id';
    try {
        const results = await db.promise().query(sql);

        console.table('', results[0]);
        main();
    } catch (err) {
        console.log(err);
    };
};

async function viewEmployees() {
    let sql = "SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager FROM employees employee LEFT OUTER JOIN employees manager ON employee.manager_id = manager.id JOIN roles ON employee.role_id = roles.id JOIN departments ON roles.department_id = departments.id";
    try {
        const results = await db.promise().query(sql);

        console.table('', results[0]);
        main();
    } catch (err) {
        console.log(err);
    };
};


// -----------------------------------------------INSERT INTO TABLE-------------------------------------------------
async function insertDepartment(input) {
    let sql = 'INSERT INTO departments (name) VALUES (?)';
    let params = input.name;
    try {
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
//---------------------------------------------UPDATE ROLE----------------------------------------------------------
async function updateEmployeeRole() {
    try {
        const employees = await db.promise().query("SELECT id AS value, CONCAT(first_name,' ', last_name) AS name FROM employees");

        const roles = await db.promise().query('SELECT id AS value, title AS name FROM roles');

        const userInputs = await inquirer.prompt([
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

        updateDB(userInputs);
    } catch (err) {
        console.log(err);
    };
};
//-----------------------------------UPDATE DB---------------------------------------------
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
//---------------------------------------------INSTANCE----------------------------------------------
main();