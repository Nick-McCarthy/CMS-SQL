INSERT INTO departments (name)
VALUES  ("Sales"),
        ("Devops"),
        ("Accounting"),

INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Manager", 90000, 1),
        ("Sales Member", 70000, 1),
        ("Devops Manager", 125000, 2),
        ("Devops Member", 80000, 2),
        ("Accounting Manager", 110000, 3),
        ("Accounting Member", 100000, 3),
        


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Sleepy", "Dwarf", 1, null),
        ("Grumpy", "Dwarf", 2, 1),
        ("Happy", "Dwarf", 3, null),
        ("Bashful", "Dwarf", 4, 3),
        ("Sneezy", "Dwarf", 5, null),
        ("Dopey", "Dwarf", 6, 5),
        