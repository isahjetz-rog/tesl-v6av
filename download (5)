# Tesla Inventory CMS - Laravel Full-Stack Project

This is a production-ready, highly polished full-stack clone of a Tesla Vehicle Inventory CMS and Booking System built on the Laravel Framework.

## Features Included
- **Dynamic Snapping Homepage**: Full-viewport vertical scrolling sliders showcasing active, featured electric cars.
- **Dynamic Grid Catalog**: Complete client-facing vehicle layouts displaying real-time specifications.
- **Admin Dashboard CMS**: Secure management panel for complete car inventory CRUD (with image upload/removal), customer inquiries overview (Change Status: Pending, Contacted, Completed), and Site dynamic branding settings (Logo, Title, Contacts, Social platforms).
- **Laravel Storage linkage**: Clean uploads handler utilizing Laravel's default local disks.

---

## 🛠️ Installation & Setup Guide

### 1. Prerequisites
- **PHP** >= 8.2 with curl, gd, mbstring, openssl, xml, zip, and pdo extension enabled
- **Composer** (PHP Package Manager)
- **MySQL** Database Server >= 8.0
- **Node.js & NPM** (For compiling Tailwind assets)

---

### 2. Project Bootstrapping

Extract this Laravel directory into your development workspace and execute the standard installation sequence:

```bash
# 1. Install all backend dependencies
composer install

# 2. Install and compile Tailwind frontend assets
npm install
npm run build
```

---

### 3. Environment Configuration

Copy the default environment template file and update your configurations:

```bash
cp .env.example .env
```

Open `.env` and configure your database and storage connections:

```ini
APP_NAME="Tesla Inventory CMS"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tesla_inventory
DB_USERNAME=root
DB_PASSWORD=your_password_here

FILESYSTEM_DISK=public
```

Generate your application security crypt key:

```bash
php artisan key:generate
```

---

### 4. Database Setup & Migration

Ensure your MySQL server is running and you have created the empty database named `tesla_inventory`.
Then compile the schema tables and seed administrative data:

```bash
# Run database migrations
php artisan migrate

# Seed administrative credentials and settings
php artisan db:seed
```

*(Note: Create a default admin seeder in `DatabaseSeeder.php` that maps `admin@tesla.com` with secure hashing for password `admin123`)*

---

### 5. Establish File Upload Linkage

To ensure that the images uploaded from the admin panel are accessible in the browser, run this crucial link command:

```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` pointing to `storage/app/public` where Laravel writes your car graphics.

---

### 6. Boot the Application Server

Start the local host dev server:

```bash
php artisan serve
```

Your system is now serving locally at **`http://localhost:8000`**!
To access the secure CMS, navigate to `/login` (or `/admin`) and utilize:
- **Email**: `admin@tesla.com`
- **Password**: `admin123`

---

## 📂 Eloquent Model Relationships

- **`Car`**:
  - `hasMany(CarImage)` (automatic cascade deletion of linked photos)
- **`CarImage`**:
  - `belongsTo(Car)` (maps relative `/storage/` paths on public disk)
- **`Inquiry`**:
  - `belongsTo(Car)` (links customer submissions to inventory items dynamically)
