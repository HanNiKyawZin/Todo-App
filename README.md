# Everyone To-Do App

This is a simple **To-Do List Web Application** using **Supabase** as a backend and **Vercel** for hosting.  
Anyone can use this app **without login**. All tasks are stored online in Supabase, so users can add, edit, delete, and mark tasks as complete.

## Features

- Add new tasks with **title**, **description**, and optional **due date**
- Edit tasks
- Delete tasks
- Mark tasks as **completed** or **pending**
- Filter tasks: All / Pending / Completed
- Status text color-coded:
  - Pending → Yellow
  - Completed → Green
- All users see the same tasks (public access)
- No login required
- Responsive UI with Bootstrap

## Tech Stack

- **Frontend:** HTML, CSS, Bootstrap, JavaScript (Vanilla JS)
- **Backend:** Supabase (PostgreSQL database + REST API)
- **Hosting:** Vercel (Frontend deployment)

## Setup Instructions

### 1. Supabase

1. Go to [Supabase](https://supabase.com/) and create a free account.
2. Create a new project.
3. Create a table named `tasks` with the following columns:

| Column      | Type       | Default / Notes        |
|------------ |----------- |---------------------- |
| id          | bigint     | auto-increment, PK     |
| title       | text       | required              |
| description | text       | optional              |
| status      | text       | default: 'pending'    |
| due_date    | date       | optional              |
| created_at  | timestamp  | default: now()        |

4. Copy your **Supabase URL** and **ANON Key**.

### 2. Configure Project

1. Clone this repository:

```bash
git clone https://github.com/HanNiKyawZin/Todo-App.git

