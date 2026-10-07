# admin-user-management Specification

## Purpose
Lets an OrangeHRM administrator give an existing employee a login account (a system
user) with a chosen role and status, and find that account again in the System Users list.

## Requirements

### Requirement: Admin creates a system user for an existing employee
The Add User form (Admin → User Management → Users → Add) SHALL create a system user
from a User Role (Admin or ESS), an Employee Name chosen from the autocomplete
suggestions, a Status (Enabled or Disabled), a Username, a Password and a matching
Confirm Password. On success it SHALL show a "Successfully Saved" toast and return to
the System Users list.

#### Scenario: ADMUSR-01 — Create an enabled ESS user
- **GIVEN** an employee exists
- **WHEN** the admin selects role ESS, picks that employee from the suggestions, selects status Enabled, enters a valid unique username and a valid matching password, and saves
- **THEN** a "Successfully Saved" toast is shown and the System Users list is displayed
- Tags: @regression @critical

#### Scenario: ADMUSR-02 — Create an enabled Admin user
- **GIVEN** an employee exists
- **WHEN** the admin creates a user for that employee with role Admin and status Enabled
- **THEN** the user is saved and appears in the System Users list with role Admin
- Tags: @regression

### Requirement: An enabled system user can sign in
A system user created with status Enabled SHALL be able to sign in at the login screen
with its username and password and reach the Dashboard.

#### Scenario: ADMUSR-03 — Created ESS user signs in
- **GIVEN** an enabled ESS system user was created
- **WHEN** that user signs in from a fresh, logged-out session
- **THEN** the Dashboard is displayed
- Tags: @regression @critical

### Requirement: Role determines access to the Admin module
A signed-in user with role ESS SHALL NOT see the Admin entry in the main menu. A
signed-in user with role Admin SHALL see it.

#### Scenario: ADMUSR-04 — ESS user has no Admin menu
- **GIVEN** an enabled ESS system user was created
- **WHEN** that user signs in
- **THEN** the main menu does not contain "Admin"
- Tags: @regression

### Requirement: A disabled system user cannot sign in
A system user created with status Disabled SHALL be refused at the login screen with the
message "Account disabled" and SHALL stay on the login page.

#### Scenario: ADMUSR-05 — Disabled user is refused
- **GIVEN** a system user was created with status Disabled
- **WHEN** that user tries to sign in with correct credentials
- **THEN** "Account disabled" is shown and the login page remains displayed
- Tags: @regression

### Requirement: System Users list finds a user by username
Searching the System Users list by an exact username SHALL return that user's row,
showing the username, user role, employee name and status.

#### Scenario: ADMUSR-06 — Search by username
- **GIVEN** a system user was created
- **WHEN** the admin searches the System Users list by that username
- **THEN** exactly one row is returned, showing that username, its role, the employee name and its status
- Tags: @regression

### Requirement: Required fields block save
Saving the Add User form with no input SHALL show "Required" under User Role, Employee
Name, Status, Username and Password, and SHALL keep the form displayed.

#### Scenario: ADMUSR-07 — Empty form is rejected
- **WHEN** the admin saves the Add User form without entering anything
- **THEN** "Required" is shown under User Role, Employee Name, Status, Username and Password, and no user is created
- Tags: @regression

### Requirement: Username must be unique and at least 5 characters
The Username field SHALL show "Should be at least 5 characters" for a username shorter
than 5 characters, and "Already exists" for a username already in use. Either SHALL block save.

#### Scenario: ADMUSR-08 — Username too short
- **WHEN** the admin enters a 3-character username
- **THEN** "Should be at least 5 characters" is shown under Username
- Tags: @regression

#### Scenario: ADMUSR-09 — Duplicate username
- **GIVEN** a system user was created by the test
- **WHEN** the admin enters that same username on a new Add User form
- **THEN** "Already exists" is shown under Username and saving does not create a user
- Tags: @regression

### Requirement: Password must meet the strength rules and be confirmed
The Password field SHALL reject a password shorter than 7 characters with "Should have
at least 7 characters" and a password without a digit with "Your password must contain
minimum 1 number". Confirm Password SHALL show "Passwords do not match" when it differs.

#### Scenario: ADMUSR-10 — Password without a number
- **WHEN** the admin enters an 8-letter password with no digit
- **THEN** "Your password must contain minimum 1 number" is shown under Password
- Tags: @regression

#### Scenario: ADMUSR-11 — Passwords do not match
- **WHEN** Confirm Password differs from Password
- **THEN** "Passwords do not match" is shown under Confirm Password
- Tags: @regression

### Requirement: Cancel discards the form
Cancel on the Add User form SHALL return to the System Users list without creating a user.

#### Scenario: ADMUSR-12 — Cancel creates nothing
- **GIVEN** the admin has partly filled the Add User form with a unique username
- **WHEN** the admin clicks Cancel
- **THEN** the System Users list is displayed and a search for that username returns "No Records Found"
- Tags: @regression
