# PRD — PIM: Add Employee

**Product:** OrangeHRM (open-source demo)
**Module:** PIM (Personnel Information Management)
**Feature:** Add Employee
**Status:** Reference PRD for E2E test generation
**Primary source:** the live demo at `https://opensource-demo.orangehrmlive.com`

---

## 1. Overview

An HR administrator adds a new employee to the system. The core action is a short
form (name + employee id); optionally the admin also creates login credentials so
the employee can access the self-service portal. On success the employee record
exists, is visible in the Employee List, and the admin lands on that employee's
Personal Details page.

## 2. Goals

- An admin can create an employee record in under a minute.
- The employee id is unique and system-suggested but editable.
- Login credentials are optional and, when set, enforce basic password strength.
- The new record is immediately findable in the Employee List.

## 3. Actors

| Actor | Role |
|-------|------|
| Admin | Full PIM access. The only actor for this feature. (Demo: `Admin` / `admin123`.) |

## 4. Entry points

- Main menu **PIM → Add Employee**
- Direct URL: `/web/index.php/pim/addEmployee`
- **PIM → Employee List → “+ Add”** button

## 5. User stories

- **US-1** — As an admin, I add an employee by entering their first and last name so the record exists.
- **US-2** — As an admin, I keep or change the suggested employee id so it fits our numbering.
- **US-3** — As an admin, I optionally create login details so the employee can sign in.
- **US-4** — As an admin, I attach a profile photo so the record is identifiable.
- **US-5** — As an admin, I am stopped from creating a record with a duplicate employee id or username.

## 6. Functional requirements

| ID | Requirement |
|----|-------------|
| REQ-01 | The form shows First Name (required), Middle Name (optional), Last Name (required). |
| REQ-02 | An Employee Id is pre-filled with the next suggested value and remains editable. |
| REQ-03 | A profile-photo upload accepts a single image; it is optional. |
| REQ-04 | A “Create Login Details” toggle, off by default. When on, it reveals Username, Password, Confirm Password, and a Status control (Enabled / Disabled, default Enabled). |
| REQ-05 | **Save** submits the form. On success: a “Successfully Saved” toast, then redirect to `/web/index.php/pim/viewPersonalDetails/empNumber/{id}`. |
| REQ-06 | **Cancel** discards the form and returns to the Employee List without creating a record. |
| REQ-07 | A saved employee appears in **PIM → Employee List** and is returned by a search on their name or id. |
| REQ-08 | With “Create Login Details” on, the created user can authenticate at the login screen with the chosen username/password (when Status = Enabled). |

## 7. Business rules & validation

| ID | Rule | Message |
|----|------|---------|
| VAL-01 | First Name and Last Name are required. | `Required` under the empty field |
| VAL-02 | Name fields accept at most 30 characters. | input is capped; no error shown |
| VAL-03 | Employee Id is at most 10 characters. | `Should not exceed 10 characters` |
| VAL-04 | Employee Id must be unique. | `Employee Id already exists` |
| VAL-05 | Profile photo must be an image and ≤ 1 MB. | `File type not allowed` / `Attachment Size Exceeded` |
| VAL-06 | Username (login details on) is 5–40 characters and unique. | `Should be at least 5 characters` / `Already exists` |
| VAL-07 | Password is 7–64 characters and contains at least one lowercase, one uppercase, and one number. | strength meter + `Should have at least a lowercase, uppercase, digit …` |
| VAL-08 | Confirm Password must equal Password. | `Passwords do not match` |
| VAL-09 | Submitting the login-details section with any of its fields empty blocks save. | `Required` under each empty field |

## 8. Acceptance criteria

1. Creating an employee with only first + last name succeeds and lands on Personal Details showing that name.
2. The suggested employee id can be overridden with a custom value and the record saves with it.
3. Creating an employee with valid login details succeeds, and that user can then sign in.
4. Each validation rule in §7 blocks save and shows its message; fixing the field allows save.
5. A newly created employee is found by name and by id in the Employee List.
6. Cancel creates nothing.

## 9. Data requirements

| Need | How |
|------|-----|
| Logged-in admin | Shared `admin` storage state (already wired). |
| A pre-existing employee (for the duplicate-id test) | Seed one via the UI first, capture its id, then attempt to reuse it. |
| Unique names / usernames per run | `buildEmployee()` faker factory; usernames suffixed with a run-unique token. |
| Cleanup | Every created employee is deleted via **Employee List → select → Delete** in `afterEach`. |

> No public write API exists on this SUT. All seeding is UI-driven and counts
> toward test time; budget ~10–15 s per created employee.

## 10. Out of scope (this PRD)

- Editing an existing employee, termination, and the other Personal Details tabs.
- Bulk import.
- Role-based access differences (only Admin is covered).
- Reports and org-structure side effects.

## 11. E2E scenarios

See [`../scenarios.csv`](../scenarios.csv) for the flat list with priorities and
tags. Summary:

| Scenario | Priority | Tags |
|----------|----------|------|
| Create employee — name only — happy path | P1 | `@regression @critical` |
| Create employee — custom employee id | P2 | `@regression` |
| Create employee — with login details — happy path | P1 | `@regression @critical` |
| Created user can sign in | P1 | `@regression @critical` |
| Validation — first/last name required | P1 | `@regression` |
| Validation — duplicate employee id | P2 | `@regression` |
| Validation — password too weak | P2 | `@regression` |
| Validation — passwords do not match | P2 | `@regression` |
| Validation — username too short | P3 | `@regression` |
| Employee List — new employee found by name and id | P1 | `@regression` |
| Cancel creates nothing | P3 | `@regression` |
