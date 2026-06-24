import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { DatabaseState, Car, Inquiry, SiteSettings } from './src/types.js';

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'src/db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'src/assets/images');

// Ensure upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Read database helper
function readDB(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading DB:', error);
  }
  return { cars: [], inquiries: [], settings: {} as SiteSettings };
}

// Write database helper
function writeDB(data: DatabaseState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing DB:', error);
  }
}

async function startServer() {
  const app = express();

  // Increase body limit to handle base64 image uploads smoothly
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Helper middleware for super-simple bearer authentication
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader === 'Bearer mock-tesla-admin-token-abcdef') {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized. Admin credential required.' });
    }
  };

  // --- API ROUTES ---

  // Auth admin login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@tesla.com' && password === 'admin123') {
      res.json({
        token: 'mock-tesla-admin-token-abcdef',
        user: { email: 'admin@tesla.com', role: 'admin' }
      });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials. Use admin@tesla.com and admin123.' });
    }
  });

  // Get Settings
  app.get('/api/settings', (req, res) => {
    const db = readDB();
    res.json(db.settings);
  });

  // Update Settings
  app.put('/api/settings', requireAdmin, (req, res) => {
    const db = readDB();
    db.settings = { ...db.settings, ...req.body };
    writeDB(db);
    res.json(db.settings);
  });

  // Get Cars (all for admin, only active for public)
  app.get('/api/cars', (req, res) => {
    const db = readDB();
    const isAdmin = req.headers.authorization === 'Bearer mock-tesla-admin-token-abcdef';
    
    if (isAdmin) {
      res.json(db.cars);
    } else {
      // Filter out non-active cars for the public frontend
      res.json(db.cars.filter(car => car.active));
    }
  });

  // Create Car
  app.post('/api/cars', requireAdmin, (req, res) => {
    const db = readDB();
    const newCar: Car = {
      id: req.body.id || `car_${Date.now()}`,
      name: req.body.name,
      brand: req.body.brand || 'Tesla',
      model: req.body.model,
      year: parseInt(req.body.year) || new Date().getFullYear(),
      price: parseFloat(req.body.price) || 0,
      description: req.body.description || '',
      specifications: req.body.specifications || {},
      images: req.body.images || [],
      featured: req.body.featured === true || req.body.featured === 'true',
      active: req.body.active === true || req.body.active === 'true',
      createdAt: new Date().toISOString()
    };

    db.cars.unshift(newCar); // Add to the top
    writeDB(db);
    res.status(201).json(newCar);
  });

  // Update Car
  app.put('/api/cars/:id', requireAdmin, (req, res) => {
    const db = readDB();
    const carId = req.params.id;
    const index = db.cars.findIndex(car => car.id === carId);

    if (index === -1) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    const existingCar = db.cars[index];
    const updatedCar: Car = {
      ...existingCar,
      name: req.body.name,
      brand: req.body.brand || existingCar.brand,
      model: req.body.model,
      year: parseInt(req.body.year) || existingCar.year,
      price: parseFloat(req.body.price) || existingCar.price,
      description: req.body.description || existingCar.description,
      specifications: req.body.specifications || existingCar.specifications,
      images: req.body.images || existingCar.images,
      featured: req.body.featured === true || req.body.featured === 'true',
      active: req.body.active === true || req.body.active === 'true'
    };

    db.cars[index] = updatedCar;
    writeDB(db);
    res.json(updatedCar);
  });

  // Delete Car
  app.delete('/api/cars/:id', requireAdmin, (req, res) => {
    const db = readDB();
    const carId = req.params.id;
    const filteredCars = db.cars.filter(car => car.id !== carId);
    
    if (db.cars.length === filteredCars.length) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    db.cars = filteredCars;
    writeDB(db);
    res.json({ success: true, message: 'Car deleted, remaining quantity: ' + db.cars.length });
  });

  // Get Inquiries
  app.get('/api/inquiries', requireAdmin, (req, res) => {
    const db = readDB();
    res.json(db.inquiries);
  });

  // Create Inquiry
  app.post('/api/inquiries', (req, res) => {
    const db = readDB();
    const newInquiry: Inquiry = {
      id: `inq_${Date.now()}`,
      carId: req.body.carId || 'general',
      carName: req.body.carName || 'General Inquiry',
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (!newInquiry.name || !newInquiry.email || !newInquiry.phone) {
      res.status(400).json({ error: 'Name, email, and phone are required.' });
      return;
    }

    db.inquiries.unshift(newInquiry);
    writeDB(db);
    res.status(201).json(newInquiry);
  });

  // Update Inquiry Status
  app.put('/api/inquiries/:id', requireAdmin, (req, res) => {
    const db = readDB();
    const inquiryId = req.params.id;
    const index = db.inquiries.findIndex(inq => inq.id === inquiryId);

    if (index === -1) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    const { status } = req.body;
    if (!['pending', 'contacted', 'completed'].includes(status)) {
      res.status(400).json({ error: 'Invalid status value. Must be pending, contacted, or completed.' });
      return;
    }

    db.inquiries[index].status = status;
    writeDB(db);
    res.json(db.inquiries[index]);
  });

  // Delete Inquiry
  app.delete('/api/inquiries/:id', requireAdmin, (req, res) => {
    const db = readDB();
    const inquiryId = req.params.id;
    const filtered = db.inquiries.filter(inq => inq.id !== inquiryId);

    if (db.inquiries.length === filtered.length) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    db.inquiries = filtered;
    writeDB(db);
    res.json({ success: true });
  });

  // Handle Base64 Uploads dynamically (converting them to static files in the sandbox)
  app.post('/api/upload', requireAdmin, (req, res) => {
    try {
      const { image, name } = req.body;
      if (!image) {
        res.status(400).json({ error: 'No image data provided.' });
        return;
      }

      // Parse matches, e.g. data:image/png;base64,iVBOR...
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        res.status(400).json({ error: 'Invalid image format. Must be base64 stream.' });
        return;
      }

      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      
      // Determine file extension
      let ext = 'jpg';
      if (mimeType.includes('png')) ext = 'png';
      else if (mimeType.includes('gif')) ext = 'gif';
      else if (mimeType.includes('webp')) ext = 'webp';

      const fileName = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      fs.writeFileSync(filePath, buffer);
      
      const fileUrl = `/assets/images/${fileName}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Internal server error during upload writing.' });
    }
  });

  // API to retrieve Laravel source files dynamically for the code preview dashboard
  app.get('/api/laravel-files', (req, res) => {
    const filePaths = [
      { name: 'Migration: Create Cars', path: 'database/migrations/2026_06_22_000001_create_cars_table.php' },
      { name: 'Migration: Create Car Images', path: 'database/migrations/2026_06_22_000002_create_car_images_table.php' },
      { name: 'Migration: Create Inquiries', path: 'database/migrations/2026_06_22_000003_create_inquiries_table.php' },
      { name: 'Migration: Create Settings', path: 'database/migrations/2026_06_22_000004_create_settings_table.php' },
      { name: 'Model: Car', path: 'app/Models/Car.php' },
      { name: 'Model: CarImage', path: 'app/Models/CarImage.php' },
      { name: 'Model: Inquiry', path: 'app/Models/Inquiry.php' },
      { name: 'Model: Setting', path: 'app/Models/Setting.php' },
      { name: 'Controller: Home', path: 'app/Http/Controllers/HomeController.php' },
      { name: 'Controller: Inquiry', path: 'app/Http/Controllers/InquiryController.php' },
      { name: 'Controller: Admin', path: 'app/Http/Controllers/AdminController.php' },
      { name: 'Controller: AdminCar', path: 'app/Http/Controllers/AdminCarController.php' },
      { name: 'Controller: AdminSetting', path: 'app/Http/Controllers/AdminSettingController.php' },
      { name: 'Routes: Web', path: 'routes/web.php' },
      { name: 'Setup README', path: 'README.md' }
    ];

    try {
      const files = filePaths.map(item => {
        const fullPath = path.join(process.cwd(), 'laravel', item.path);
        let content = 'File not found.';
        if (fs.existsSync(fullPath)) {
          content = fs.readFileSync(fullPath, 'utf-8');
        }
        return { name: item.name, path: item.path, content };
      });
      res.json(files);
    } catch (error) {
      console.error('Error reading Laravel files:', error);
      res.status(500).json({ error: 'Failed to construct code file tree' });
    }
  });

  // --- STATIC ASSET SERVING & WEB INTEGRATION ---

  // Serve static generated assets directly
  app.use('/assets/images', express.static(UPLOADS_DIR));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve static files also from src/assets/images just in case
    app.use('/src/assets/images', express.static(UPLOADS_DIR));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tesla Inventory CMS Full-Stack development running on port ${PORT}`);
  });
}

startServer();
