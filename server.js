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
function main() {
    inquirer
        .prompt(
            [
                {
                    type: 'list',
                    message: "What would you like to do?",
                    name: 'main',
                    choices: ['View Departments', 'View Roles', 'View Employees', 'New Department', 'New Role', 'New Employee', 'Update Employee'],
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

};

async function newRole() {

};

async function newEmployee() {

};

//-----------------------------VIEW FUNCTIONS--------------------------

async function viewDepartments() {

};

async function viewRoles() {

};

async function viewEmployees() {

}

// -----------------------------------------------INSERT INTO TABLE-------------------------------------------------
async function insertDepartment() {

}

async function insertRole() {

};

async function insertEmployee() {

};
//---------------------------------------------UPDATE ROLE----------------------------------------------------------
async function updateEmployeeRole() {

};
//-----------------------------------UPDATE DB---------------------------------------------
async function updateDB() {

}
//---------------------------------------------INSTANCE----------------------------------------------
main();