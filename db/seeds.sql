INSERT INTO departments (name)
VALUES  ("Sales"),
        ("Devops"),
        ("Finance"),
        ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Lead", 90000, 1),
        ("Sales Member", 70000, 1),
        ("Devops Lead", 150000, 2),
        ("Devops Member", 100000, 2),
        ("Accounting Lead", 120000, 3),
        ("Accounting Member", 90000, 3),
        ("Legal Lead", 200000, 4),
        ("Legal Member", 150000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Mark", "Pleet", 1, null),
        ("Matt", "Brenton", 2, 1),
        ("Joe", "Polk", 3, null),
        ("Jane", "Bagel", 4, 3),
        ("Julie", "Smith", 5, null),
        ("Amanda", "Turk", 6, 5),
        ("Mandy", "Thorn", 7, null),
        ("Nick", "Booker", 8, 7);