# 🏫 Student Grievance Desk

A web-based grievance management system for schools and colleges. Students can submit grievances online and track their status using a unique Ticket ID. The admin committee can review, categorize, and resolve grievances through a secure dashboard.

Built with **HTML/CSS/JavaScript** + **Supabase** (free PostgreSQL database).

---

## 📋 Features

### Student Side
- **Submit Grievance** — Fill out a form with name, roll number, class, category, and description
- **Track Status** — Enter your Ticket ID to see the current status with a timeline

### Admin Side
- **Secure Login** — Email/password authentication via Supabase Auth
- **Dashboard** — View all grievances in a sortable table with status filters
- **Manage Grievances** — Update status (Pending → Under Review → Resolved) and add resolution notes

---

## 🚀 Setup Instructions (30 minutes)

### Step 1: Create a Supabase Account

1. Go to **[supabase.com](https://supabase.com)** and click **"Start your project"**
2. Sign up (GitHub account recommended — fastest)
3. Create a new project:
   - **Organization**: Your choice
   - **Project name**: `school-grievance-desk`
   - **Database password**: Create a strong password and **save it**
   - **Region**: Choose the closest to your location
4. Wait ~2 minutes for the database to spin up

### Step 2: Set Up the Database

1. In your Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file `supabase-schema.sql` from this project
4. Copy-paste the entire content into the SQL Editor
5. Click **"Run"** — this creates the `grievances` table with auto-generated Ticket IDs
6. ✅ You should see "Success. No rows returned" or similar

### Step 3: Enable Supabase Auth (for Admin Login)

1. Go to **Authentication → Providers** in the Supabase Dashboard
2. Make sure **"Email"** is enabled
3. Under **"Allow users to sign up"** — you can leave it on for now

4. Go to **Authentication → Users**
5. Click **"Add User"** and create an admin account:
   - **Email**: e.g., `admin@school.edu`
   - **Password**: e.g., `Admin@123` (change this!)

### Step 4: Configure the Project

1. Go to **Project Settings → API** in Supabase Dashboard
2. Copy the **"Project URL"** (looks like `https://xxxxx.supabase.co`)
3. Copy the **"anon public"** key (starts with `eyJ...`)
4. Open `js/supabase-init.js` in this project
5. Replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';  // ← Replace this
const SUPABASE_ANON_KEY = 'your-anon-key-here';              // ← Replace this
```

### Step 5: Deploy to Vercel (Free Hosting)

1. Push this project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Go to **[vercel.com](https://vercel.com)** and sign up with GitHub
3. Click **"Add New → Project"**
4. Import your GitHub repository
5. Click **"Deploy"** — that's it!
6. Your site will be live at `https://your-project.vercel.app`

---

## 🧪 Testing Locally

Since this is a static site (HTML + JS), you can open the files directly in your browser:

1. Open `index.html` to test the submission form
2. Open `track.html` to test tracking (after submitting)
3. Open `admin/index.html` to test the admin dashboard

> ⚠️ **Note**: Supabase requires a real server. Opening files locally (`file://`) may cause CORS issues. For local testing, use a simple HTTP server:
> ```bash
> # If you have Python
> python -m http.server 3000
> # Or with Node.js
> npx serve .
> ```

---

## 📁 Project Structure

```
school-grievance-desk/
├── index.html              # Student: Submit grievance
├── track.html              # Student: Track grievance status
├── admin/
│   └── index.html          # Admin: Login + Dashboard
├── css/
│   └── style.css           # All styles
├── js/
│   ├── supabase-init.js    # Supabase config (EDIT THIS)
│   ├── submit.js           # Submission logic
│   ├── track.js            # Tracking logic
│   └── admin.js            # Admin dashboard logic
├── supabase-schema.sql     # Database schema (run in SQL Editor)
└── README.md               # This file
```

---

## 🔐 Security Notes

- The `supabase-anon-key` in `supabase-init.js` is safe to expose in frontend code
- Row Level Security (RLS) is enabled on the database
- Students can only **insert** and **read** grievances (by Ticket ID)
- Only authenticated admins can **update** grievance status
- The app uses Supabase Auth — passwords are never stored in the frontend code

---

## 📊 Database Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Auto-incrementing primary key |
| `ticket_id` | TEXT | Unique ID (e.g., GRV-2025-00001) |
| `student_name` | TEXT | Student's full name |
| `roll_number` | TEXT | Student's roll number |
| `class_division` | TEXT | Class and division |
| `category` | TEXT | Grievance category |
| `description` | TEXT | Grievance details |
| `contact` | TEXT | Optional contact info |
| `status` | TEXT | pending / under_review / resolved |
| `admin_notes` | TEXT | Resolution notes |
| `created_at` | TIMESTAMPTZ | Submission timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## 🆘 Troubleshooting

**"Failed to fetch" error in console**
→ Make sure your Supabase URL and anon key are correctly set in `supabase-init.js`

**"422 Unprocessable Entity" when submitting**
→ Check the database schema was created correctly in Supabase SQL Editor

**Admin login not working**
→ Check that you created a user in Supabase Authentication → Users

**"Relation 'grievances' does not exist"**
→ You haven't run the SQL schema yet. Go to SQL Editor and run `supabase-schema.sql`

---

Built with ❤️ for schools. Powered by Supabase (free tier).
