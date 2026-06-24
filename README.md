# 🚀 Web Hosting FTP & MySQL Setup Guide (Laravel Version)

This guide walks you through installing the **Laravel PHP version** of this Tesla Car Giveaway and CMS platform directly to any standard web hosting provider (e.g., Namecheap, HostGator, Bluehost, GoDaddy) using **FTP** and **MySQL/phpMyAdmin**.

---

## 📂 Step 1: Locate the Laravel Files & Database SQL
All files are pre-loaded and ready in this project folder:
* **Laravel Application**: Located in the `./laravel` directory.
* **Database Import File**: Quick restore file is located at `./laravel/database.sql`.

---

## 🗄️ Step 2: Create & Import the MySQL Database
You need a MySQL database where Laravel can store vehicles, specifications, customer claim forms, and admin logins.

1. **Log in to your Hosting cPanel** (or whatever hosting control panel you use).
2. Go to **MySQL® Database Wizard** (or Database Management).
3. **Create a Database**: Give it a name (e.g., `mywebsite_tesla`).
4. **Create a Database User**: Set a username and database password.
5. **Associate User**: Add that user to the database and check **"ALL PRIVILEGES"**.
6. **Import the SQL Structure**:
   * Find and open **phpMyAdmin** in your cPanel.
   * Click on your newly created database in the left sidebar.
   * Click the **Import** tab at the top.
   * Choose File: select the **`database.sql`** file you copied from this project directory.
   * Scroll down and click **Go** / **Import**. All tables are now instantly online!

---

## 🔑 Step 3: Configure environment settings (`.env`)
You must tell Laravel how to securely speak to your newly created MySQL database:

1. Inside your local `/laravel` folder, find the `.env.example` file and rename it to **`.env`** (or create a file named `.env` if none exists).
2. Open the `.env` file with a text editor and enter your settings:

```env
APP_NAME="Tesla Giveaway"
APP_ENV=production
APP_KEY=SomeRandomString32CharactersLong! # (Generate later or keep current)
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_created_database_name_here
DB_USERNAME=your_created_database_user_here
DB_PASSWORD=your_created_database_password_here
```

---

## 📤 Step 4: FTP Upload (Option A: Quick Setup vs. Option B: Secure Setup)

Open your preferred FTP Client (e.g. **FileZilla**, **Cyberduck**) or use the cPanel **File Manager**.

### OPTION A: Quick Setup (Simple & Instant)
This method is perfect if you are installing within a subdomain or a temporary testing workspace.

1. Connect to your server using your FTP developer credentials.
2. Navigate to the directory targeting your public website root—usually **`public_html`** or **`www`**.
3. Upload **ALL** contents of the `/laravel` directory *directly* into the `public_html` folder.
4. **Crucial Step**: Because Laravel looks for its entry point inside the `/public` folder, you need to route requests correctly. Rename `/public` to `/public_html` on your server, or create an `.htaccess` file in your root folder with these rules to redirect incoming traffic:
   ```apache
   <IfModule mod_rewrite.c>
       RewriteEngine on
       RewriteCond %{REQUEST_URI} !^/public/
       RewriteRule ^(.*)$ /public/$1 [L]
   </IfModule>
   ```

---

### OPTION B: Secure Professional Setup (Highly Recommended)
This isolates your configuration files, system dependencies, and environment files securely behind the public folder, preventing anyone from downloading your database password `.env` file!

1. Connect to your FTP root directory (one level **ABOVE** `public_html`).
2. Create a folder named **`tesla_system`** next to `public_html`.
3. Upload **ALL** folders and files inside your local `/laravel` directory (like `app`, `config`, `routes`, `vendor`, `.env`, etc.) into `tesla_system` **except for the `/public` folder**.
4. Now, open the local `/laravel/public` folder.
5. Upload **ONLY** the contents of the `/public` folder directly into your server's **`public_html`** directory.
6. **Edit public path link**: Open the `index.php` file inside your server's `public_html` folder using a text editor and update the paths to match the parent `tesla_system` folder:

   * Change:
     ```php
     require __DIR__.'/../vendor/autoload.php';
     $app = require_once __DIR__.'/../bootstrap/app.php';
     ```
   * To:
     ```php
     require __DIR__.'/../tesla_system/vendor/autoload.php';
     $app = require_once __DIR__.'/../tesla_system/bootstrap/app.php';
     ```
7. Set up write permissions (`775` or `755`) for `tesla_system/storage` and `tesla_system/bootstrap/cache` folders inside your FTP workspace.

---

## 🔐 Step 5: Log in to the CMS Admin Dashboard
Once your URL is active, you can access your pre-provisioned CMS dashboard:

* **Administration Route**: `https://yourdomain.com/admin` (or `/public/admin` under Option A)
* **Master Admin User**: `admin@tesla.com`
* **Secure Seed Password**: `admin123`

---

## 🛠️ Performance Tuning Commands (If terminal/SSH is available)
If your host permits terminal shell login or SSH:
```bash
# Set secure application encryption key
php artisan key:generate

# Cache your routes/config for massive speed boosts
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
