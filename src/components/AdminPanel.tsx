import React, { useState, useEffect } from 'react';
import {
  Lock, BarChart3, Car, Inbox, Settings, FileCode, CheckCircle, Clock, CheckCircle2,
  Trash2, Plus, Edit2, LogOut, Check, X, ShieldX, Upload, Copy, ExternalLink, Loader2
} from 'lucide-react';
import { Car as CarType, Inquiry, SiteSettings } from '../types.js';

interface AdminPanelProps {
  settings: SiteSettings;
  onSettingsUpdate: (newSettings: SiteSettings) => void;
  cars: CarType[];
  onCarsUpdate: () => void;
  inquiries: Inquiry[];
  onInquiriesUpdate: () => void;
  onClose: () => void;
}

export default function AdminPanel({
  settings,
  onSettingsUpdate,
  cars,
  onCarsUpdate,
  inquiries,
  onInquiriesUpdate,
  onClose
}: AdminPanelProps) {
  // Login credentials states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('tesla_admin_token'));
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active workspace panels
  const [activeTab, setActiveTab] = useState<'stats' | 'cars' | 'inquiries' | 'settings' | 'laravel'>('stats');

  // Car list forms actions states
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [carName, setCarName] = useState('');
  const [carBrand, setCarBrand] = useState('Tesla');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState(new Date().getFullYear());
  const [carPrice, setCarPrice] = useState(50000);
  const [carDesc, setCarDesc] = useState('');
  const [specRange, setSpecRange] = useState('');
  const [specSpeed, setSpecSpeed] = useState('');
  const [specZeroSixty, setSpecZeroSixty] = useState('');
  const [specDrivetrain, setSpecDrivetrain] = useState('Dual Motor AWD');
  const [carImages, setCarImages] = useState<string[]>([]);
  const [carFeatured, setCarFeatured] = useState(false);
  const [carActive, setCarActive] = useState(true);
  const [carFormError, setCarFormError] = useState('');
  const [isSavingCar, setIsSavingCar] = useState(false);

  // Settings CMS forms states
  const [siteTitle, setSiteTitle] = useState(settings.title || '');
  const [siteLogo, setSiteLogo] = useState(settings.logo || '');
  const [siteFavicon, setSiteFavicon] = useState(settings.favicon || '');
  const [siteMail, setSiteMail] = useState(settings.contactEmail || '');
  const [sitePhone, setSitePhone] = useState(settings.contactPhone || '');
  const [siteAddr, setSiteAddr] = useState(settings.contactAddress || '');
  const [siteTwitter, setSiteTwitter] = useState(settings.socialTwitter || '');
  const [siteInsta, setSiteInsta] = useState(settings.socialInstagram || '');
  const [siteYouTube, setSiteYouTube] = useState(settings.socialYoutube || '');
  const [siteFB, setSiteFB] = useState(settings.socialFacebook || '');
  const [siteColor, setSiteColor] = useState(settings.primaryColor || '#e82127');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Code exporter states
  const [laravelFiles, setLaravelFiles] = useState<{ name: string; path: string; content: string }[]>([]);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copiedFileIndex, setCopiedFileIndex] = useState<number | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  // Fetch Laravel source files
  useEffect(() => {
    if (token) {
      setIsLoadingFiles(true);
      fetch('/api/laravel-files')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setLaravelFiles(data);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingFiles(false));
    }
  }, [token]);

  // Auth processing
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      localStorage.setItem('tesla_admin_token', data.token);
      setToken(data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid admin credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tesla_admin_token');
    setToken(null);
  };

  // Car Management Triggers
  const openAddCarModal = () => {
    setEditingCar(null);
    setCarName('');
    setCarBrand('Tesla');
    setCarModel('');
    setCarYear(new Date().getFullYear());
    setCarPrice(50000);
    setCarDesc('');
    setSpecRange('320 mi');
    setSpecSpeed('155 mph');
    setSpecZeroSixty('3.5 s');
    setSpecDrivetrain('Dual Motor AWD');
    setCarImages([]);
    setCarFeatured(false);
    setCarActive(true);
    setCarFormError('');
    setIsCarModalOpen(true);
  };

  const openEditCarModal = (car: CarType) => {
    setEditingCar(car);
    setCarName(car.name);
    setCarBrand(car.brand);
    setCarModel(car.model);
    setCarYear(car.year);
    setCarPrice(car.price);
    setCarDesc(car.description);
    setSpecRange(car.specifications?.range || '');
    setSpecSpeed(car.specifications?.topSpeed || '');
    setSpecZeroSixty(car.specifications?.zeroToSixty || '');
    setSpecDrivetrain(car.specifications?.drivetrain || 'Dual Motor AWD');
    setCarImages(car.images || []);
    setCarFeatured(car.featured);
    setCarActive(car.active);
    setCarFormError('');
    setIsCarModalOpen(true);
  };

  // Multi Image File upload handler parsing to Base64 first
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          // Send base64 to API, which saves as a static file in sandbox
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ image: base64String, name: file.name })
          });
          const uploadResult = await res.json();
          if (uploadResult.url) {
            setCarImages(prev => [...prev, uploadResult.url]);
          }
        } catch (error) {
          console.error('File write error:', error);
          setCarFormError('Failed to capture uploaded file.');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCarImage = (indexToRemove: number) => {
    setCarImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Save/Update Car
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarFormError('');
    setIsSavingCar(true);

    if (!carName || !carModel || !carPrice) {
      setCarFormError('Required fields: Name, Model, and Price.');
      setIsSavingCar(false);
      return;
    }

    const payload = {
      name: carName,
      brand: carBrand,
      model: carModel,
      year: carYear,
      price: carPrice,
      description: carDesc,
      specifications: {
        range: specRange,
        topSpeed: specSpeed,
        zeroToSixty: specZeroSixty,
        drivetrain: specDrivetrain
      },
      images: carImages,
      featured: carFeatured,
      active: carActive
    };

    try {
      const url = editingCar ? `/api/cars/${editingCar.id}` : '/api/cars';
      const method = editingCar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save vehicle details');
      }

      setIsCarModalOpen(false);
      onCarsUpdate();
    } catch (err: any) {
      setCarFormError(err.message || 'Server error. Please save again.');
    } finally {
      setIsSavingCar(false);
    }
  };

  // Inactive / Active Toggle
  const handleToggleActive = async (car: CarType) => {
    try {
      const response = await fetch(`/api/cars/${car.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...car, active: !car.active })
      });
      if (!response.ok) throw new Error('Toggle active state failed.');
      onCarsUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Car
  const handleDeleteCar = async (carId: string) => {
    if (!window.confirm('Warning: Are you sure you want to completely remove this vehicle?')) return;
    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete car');
      onCarsUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // Inquiry Status updates
  const handleInquiryStatusChange = async (inqId: string, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${inqId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Status modify failure');
      onInquiriesUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (inqId: string) => {
    if (!window.confirm('Delete customer request permanently?')) return;
    try {
      const res = await fetch(`/api/inquiries/${inqId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Delete Inquiry failure');
      onInquiriesUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: siteTitle,
          logo: siteLogo,
          favicon: siteFavicon,
          contactEmail: siteMail,
          contactPhone: sitePhone,
          contactAddress: siteAddr,
          socialTwitter: siteTwitter,
          socialInstagram: siteInsta,
          socialYoutube: siteYouTube,
          socialFacebook: siteFB,
          primaryColor: siteColor
        })
      });

      if (!res.ok) throw new Error('Failed to save settings.');
      const settingsData = await res.json();
      onSettingsUpdate(settingsData);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Copy Code to Clipboard helper
  const handleCopyCode = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedFileIndex(index);
    setTimeout(() => setCopiedFileIndex(null), 2000);
  };

  // --- RENDERING VIEWS ---

  if (!token) {
    /* ADMIN LOGIN SCREEN */
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md animate-fadeIn text-white">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-neutral-900 border border-white/5 rounded-3xl p-8 shadow-2xl relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-neutral-400 hover:text-white p-1 hover:bg-white/5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-red-600/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-display uppercase tracking-widest text-lg font-bold">Admin Portal Access</h3>
            <p className="text-neutral-400 text-xs mt-1">Authenticate to manage vehicle reservation catalog</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-lg mb-6 flex items-center space-x-2">
              <ShieldX className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-neutral-400 block uppercase tracking-wider font-semibold mb-1 text-[10px]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@tesla.com"
                required
                className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-400 block uppercase tracking-wider font-semibold mb-1 text-[10px]">Security Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="admin123"
                required
                className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-red-600 hover:bg-red-700 font-semibold uppercase text-xs tracking-widest py-3.5 rounded transition-all mt-6 flex items-center justify-center space-x-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validating credentials...</span>
                </>
              ) : (
                <span>Access Dashboard System</span>
              )}
            </button>
          </div>

          <div className="mt-8 text-center border-t border-white/5 pt-4 text-[10px] text-neutral-500 font-mono">
            <span>Demo: <strong>admin@tesla.com</strong> / <strong>admin123</strong></span>
          </div>
        </form>
      </div>
    );
  }

  /* MAIN CMS SYSTEM FOR AUTHENTICATED ADMINS */
  const pendingCount = inquiries.filter(i => i.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col md:flex-row overflow-hidden animate-fadeIn">
      {/* Sidebar navigation panel */}
      <aside className="w-full md:w-64 bg-neutral-900 border-r border-white/5 flex flex-col justify-between p-6 shrink-0 z-10">
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/5">
            <span className="font-display font-bold tracking-widest text-white text-sm uppercase">
              {settings.logo || 'TESLA'} ADMIN
            </span>
            <button
              onClick={onClose}
              className="md:hidden text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu links */}
          <nav className="space-y-1.5 text-xs uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-left ${
                activeTab === 'stats'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Statistics Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('cars')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors font-medium text-left ${
                activeTab === 'cars'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Car className="w-4 h-4" />
                <span>Fleet Inventory</span>
              </div>
              <span className="bg-neutral-950 text-neutral-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                {cars.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors font-medium text-left ${
                activeTab === 'inquiries'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Inbox className="w-4 h-4" />
                <span>Client Inquiries</span>
              </div>
              {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-left ${
                activeTab === 'settings'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Brand CMS Panel</span>
            </button>

            <button
              onClick={() => setActiveTab('laravel')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-left ${
                activeTab === 'laravel'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span className="text-red-400 font-bold font-mono">Laravel Files</span>
            </button>
          </nav>
        </div>

        {/* Foot lock buttons */}
        <div className="pt-6 border-t border-white/5 space-y-3">
          <div className="flex items-center space-x-2 px-3 text-[10px] font-mono text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active: admin@tesla.com</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="flex-grow flex items-center justify-center space-x-2 border border-white/10 text-neutral-400 hover:text-white px-3 py-2.5 rounded text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="border border-white/10 text-neutral-400 hover:text-white px-3 py-2.5 rounded text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </aside>

      {/* Main workplace arena */}
      <main className="flex-grow p-8 overflow-y-auto min-h-0 bg-neutral-950">
        
        {/* TAB 1: STATISTICS HUB */}
        {activeTab === 'stats' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <div>
              <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase font-semibold">Workspace / Core Statistics</span>
              <h2 className="text-white font-display uppercase tracking-widest text-2xl font-bold mt-1">Control Operations Overview</h2>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
              <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Total Inventory Fleet</span>
                <span className="text-white text-4xl font-bold mt-4 font-mono">{cars.length}</span>
                <span className="text-[10px] text-neutral-500 mt-2 block">Standard vehicles in DB schema</span>
              </div>
              <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Active Visibility Web</span>
                <span className="text-emerald-400 text-4xl font-bold mt-4 font-mono">{cars.filter(c=>c.active).length}</span>
                <span className="text-[10px] text-neutral-500 mt-2 block">Publicly accessible listings</span>
              </div>
              <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Total Inquiry Inboxes</span>
                <span className="text-white text-4xl font-bold mt-4 font-mono">{inquiries.length}</span>
                <span className="text-[10px] text-neutral-500 mt-2 block flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {pendingCount} Pending Requests
                </span>
              </div>
              <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Configuration Completes</span>
                <span className="text-red-400 text-4xl font-bold mt-4 font-mono">
                  {inquiries.filter(i=>i.status==='completed').length}
                </span>
                <span className="text-[10px] text-neutral-500 mt-2 block">Marked as completed</span>
              </div>
            </div>

            {/* Recent inquiries list */}
            <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display uppercase tracking-widest text-sm font-bold text-neutral-300">Recent Customer Submissions</h3>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-red-500 text-[10px] uppercase font-bold tracking-wider hover:underline"
                >
                  View full inbox
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-xs font-mono">
                  Inbox empty. Submit some forms on the catalog page!
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-neutral-950/60 rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-sans"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold">{inq.name}</span>
                          <span className="text-[10px] text-neutral-500">{inq.email}</span>
                        </div>
                        <p className="text-neutral-400 mt-1 italic leading-relaxed font-serif line-clamp-1">"{inq.message}"</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-red-400 font-semibold bg-red-400/10 border border-red-500/10 px-2 py-0.5 rounded font-mono uppercase">
                          {inq.carName}
                        </span>
                        
                        {/* Status label */}
                        <span className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold font-sans ${
                          inq.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          inq.status === 'contacted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FLEET INVENTORY CMS */}
        {activeTab === 'cars' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase font-semibold">Workspace / Inventory</span>
                <h2 className="text-white font-display uppercase tracking-widest text-2xl font-bold mt-1">Car Reserve System</h2>
              </div>
              <button
                onClick={openAddCarModal}
                className="bg-white text-neutral-950 px-4 py-2.5 rounded font-bold uppercase text-[10px] tracking-widest flex items-center space-x-1.5 shadow-lg active:scale-95 duration-150"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Vehicle</span>
              </button>
            </div>

            {/* Cars listing Table */}
            <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-950 font-mono text-[9px] uppercase tracking-widest text-neutral-500 border-b border-white/5">
                      <th className="p-5 font-semibold">Visual Preview</th>
                      <th className="p-5 font-semibold">Specifications Info</th>
                      <th className="p-5 font-semibold">Financial Value</th>
                      <th className="p-5 font-semibold">Visibility Panel</th>
                      <th className="p-5 font-semibold text-right">Actions Drawer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-neutral-500 font-mono">
                          No cars loaded in database cache. Press Add Vehicle above!
                        </td>
                      </tr>
                    ) : (
                      cars.map((car) => {
                        const img = car.images && car.images.length > 0 ? car.images[0] : '';

                        return (
                          <tr
                            key={car.id}
                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="p-5 font-sans">
                              <div className="flex items-center space-x-4">
                                {img ? (
                                  <img
                                    src={img}
                                    alt={car.name}
                                    className="w-16 h-10 object-cover bg-neutral-950 rounded-lg border border-white/10"
                                  />
                                ) : (
                                  <div className="w-16 h-10 flex items-center justify-center bg-neutral-950 rounded-lg border border-white/10 text-neutral-600 font-mono text-[9px]">
                                    N/A
                                  </div>
                                )}
                                <div>
                                  <div className="text-white font-bold text-sm tracking-wide">{car.name}</div>
                                  <div className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider">{car.brand} / {car.model}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 font-mono text-[10px] text-neutral-400">
                              <div className="flex gap-4">
                                <div>
                                  <span className="text-[8px] text-neutral-600 uppercase block leading-none">Range</span>
                                  <span className="text-neutral-300 font-semibold">{car.specifications?.range || 'N/A'}</span>
                                </div>
                                <div className="border-l border-white/10 pl-4">
                                  <span className="text-[8px] text-neutral-600 uppercase block leading-none">Accel</span>
                                  <span className="text-neutral-300 font-semibold">{car.specifications?.zeroToSixty || 'N/A'}</span>
                                </div>
                                <div className="border-l border-white/10 pl-4">
                                  <span className="text-[8px] text-neutral-600 uppercase block leading-none">Drivetrain</span>
                                  <span className="text-neutral-300 font-semibold max-w-[80px] truncate block">{car.specifications?.drivetrain || 'N/A'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 font-mono text-sm text-red-500 font-bold">
                              ${car.price.toLocaleString()}
                            </td>
                            <td className="p-5 font-sans">
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => handleToggleActive(car)}
                                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase border tracking-wider transition-colors ${
                                    car.active
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      : 'bg-neutral-800 text-neutral-500 border-white/5'
                                  }`}
                                >
                                  {car.active ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                      <span>Active Web</span>
                                    </>
                                  ) : (
                                    <>
                                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                      <span>Disabled</span>
                                    </>
                                  )}
                                </button>
                                
                                {car.featured && (
                                  <span className="text-[8px] tracking-widest text-[9px] bg-red-600/10 border border-red-500/10 text-red-400 px-2 py-0.5 rounded font-bold uppercase">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-5 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => openEditCarModal(car)}
                                  className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCar(car.id)}
                                  className="p-2 text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-lg border border-white/5 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CLIENT INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <div>
              <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase font-semibold">Workspace / Inbox</span>
              <h2 className="text-white font-display uppercase tracking-widest text-2xl font-bold mt-1">Client Inquiries Ledger</h2>
            </div>

            {/* Inquiries list Grid / Table */}
            <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-950 font-mono text-[9px] uppercase tracking-widest text-neutral-500 border-b border-white/5">
                      <th className="p-5 font-semibold">Customer Metadata</th>
                      <th className="p-5 font-semibold">Linked Car</th>
                      <th className="p-5 font-semibold">Submission Message</th>
                      <th className="p-5 font-semibold">Request Progress</th>
                      <th className="p-5 font-semibold text-right">Actions Drawer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-neutral-500 font-mono">
                          Inboxes completely empty.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((inq) => (
                        <tr
                          key={inq.id}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-5 font-sans">
                            <div className="text-white font-bold text-sm tracking-wide">{inq.name}</div>
                            <div className="text-neutral-400 text-xs mt-0.5">{inq.email}</div>
                            <div className="text-neutral-500 text-[10px] font-mono mt-0.5">{inq.phone}</div>
                          </td>
                          <td className="p-5 font-mono text-xs">
                            <span className="text-red-500 font-semibold uppercase">{inq.carName}</span>
                            <span className="block text-[8px] text-neutral-500 mt-1 uppercase">
                              {new Date(inq.createdAt).toLocaleDateString()} / {new Date(inq.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </td>
                          <td className="p-5 font-sans text-xs text-neutral-400">
                            <p className="max-w-sm whitespace-pre-line leading-relaxed italic font-serif">
                              "{inq.message}"
                            </p>
                          </td>
                          <td className="p-5 font-sans">
                            <select
                              value={inq.status}
                              onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                              className={`text-[9px] font-mono uppercase font-bold tracking-widest px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer ${
                                inq.status === 'completed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                                  : inq.status === 'contacted'
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                              }`}
                            >
                              <option value="pending" className="bg-neutral-900 border text-amber-500">PENDING</option>
                              <option value="contacted" className="bg-neutral-900 border text-blue-400">CONTACTED</option>
                              <option value="completed" className="bg-neutral-900 border text-emerald-400">COMPLETED</option>
                            </select>
                          </td>
                          <td className="p-5 text-right">
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-lg border border-white/5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BRAND CMS PANEL */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn text-xs">
            <div>
              <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase font-semibold">Workspace / CMS</span>
              <h2 className="text-white font-display uppercase tracking-widest text-2xl font-bold mt-1">Branding settings Control</h2>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-neutral-900 border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl font-sans">
              
              {settingsSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center space-x-2 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dynamic brand metadata settings updated successfully. Public screens synchronized.</span>
                </div>
              )}

              {/* Standard info */}
              <div className="space-y-4">
                <h3 className="font-display uppercase tracking-widest text-xs font-bold border-b border-white/5 pb-2 text-neutral-400">General Branding</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">Website Header Title</label>
                    <input
                      type="text"
                      value={siteTitle}
                      onChange={e => setSiteTitle(e.target.value)}
                      required
                      className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">Logo Label</label>
                    <input
                      type="text"
                      value={siteLogo}
                      onChange={e => setSiteLogo(e.target.value)}
                      required
                      className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">Primary Branding Color Code (Hex)</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={siteColor}
                      onChange={e => setSiteColor(e.target.value)}
                      className="w-10 h-10 bg-transparent rounded cursor-pointer mt-0 border-0"
                    />
                    <input
                      type="text"
                      value={siteColor}
                      onChange={e => setSiteColor(e.target.value)}
                      required
                      pattern="^#[a-fA-F0-9]{6}$"
                      className="bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs font-mono focus:ring-1 focus:ring-red-500 focus:outline-none w-32"
                    />
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="font-display uppercase tracking-widest text-xs font-bold border-b border-white/5 pb-2 text-neutral-400">Contact Information Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">Administration Mailbox</label>
                    <input
                      type="email"
                      value={siteMail}
                      onChange={e => setSiteMail(e.target.value)}
                      required
                      className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">Customer Support Hotline</label>
                    <input
                      type="text"
                      value={sitePhone}
                      onChange={e => setSitePhone(e.target.value)}
                      required
                      className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">Company Address Location</label>
                  <input
                    type="text"
                    value={siteAddr}
                    onChange={e => setSiteAddr(e.target.value)}
                    required
                    className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Socials */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="font-display uppercase tracking-widest text-xs font-bold border-b border-white/5 pb-2 text-neutral-400">Social Networks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">X (Twitter) URL</label>
                    <input
                      type="url"
                      value={siteTwitter}
                      onChange={e => setSiteTwitter(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">Instagram URL</label>
                    <input
                      type="url"
                      value={siteInsta}
                      onChange={e => setSiteInsta(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">YouTube URL</label>
                    <input
                      type="url"
                      value={siteYouTube}
                      onChange={e => setSiteYouTube(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">Facebook URL</label>
                    <input
                      type="url"
                      value={siteFB}
                      onChange={e => setSiteFB(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-3 text-white text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit trigger */}
              <button
                type="submit"
                disabled={isSavingSettings}
                className="w-full bg-white hover:bg-neutral-200 disabled:bg-neutral-800 text-neutral-950 font-bold uppercase text-xs tracking-widest py-3.5 rounded transition-all flex items-center justify-center space-x-2"
              >
                {isSavingSettings ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving dynamic changes...</span>
                  </>
                ) : (
                  <span>Commit Dynamic CMS Settings</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: LARAVEL DEVELOPMENT EXPORTER */}
        {activeTab === 'laravel' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn text-xs h-full flex flex-col justify-between">
            <div className="shrink-0">
              <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase font-semibold">Development / Production Delivery</span>
              <h2 className="text-white font-display uppercase tracking-widest text-2xl font-bold mt-1">Laravel Codebase Exporter</h2>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                This dynamic browser lets you read, examine, and copy the physical production-ready PHP Laravel code (and migrations) that maps completely to this live interface!
              </p>
            </div>

            {isLoadingFiles ? (
              <div className="flex-grow flex items-center justify-center py-20 text-neutral-400 font-mono text-sm gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Load workspace files tree...
              </div>
            ) : laravelFiles.length === 0 ? (
              <div className="flex-grow text-center py-12 text-neutral-500 font-mono">
                No Laravel files fetched. Check if Laravel migrations have been created properly in workspace.
              </div>
            ) : (
              <div className="flex-grow flex flex-col lg:flex-row gap-6 h-[500px] min-h-0 font-sans">
                {/* File selectors (Left) */}
                <div className="w-full lg:w-72 bg-neutral-900 border border-white/5 rounded-2xl overflow-y-auto p-4 shrink-0 space-y-1.5 flex flex-col">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2 px-2">Laravel Code Tree</span>
                  {laravelFiles.map((file, idx) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFileIdx(idx)}
                      className={`w-full flex flex-col text-left px-3 py-2.5 rounded transition-colors ${
                        selectedFileIdx === idx
                          ? 'bg-neutral-800 text-red-500 border-l-2 border-red-500 font-semibold'
                          : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <span className="text-xs font-semibold block">{file.name}</span>
                      <span className="text-[9px] text-neutral-500 font-mono mt-0.5 truncate max-w-xs">{file.path}</span>
                    </button>
                  ))}
                </div>

                {/* Code Window Display (Right) */}
                <div className="flex-grow bg-neutral-950 rounded-2xl border border-white/5 flex flex-col overflow-hidden">
                  <div className="bg-neutral-900 px-5 py-3 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div>
                      <span className="text-red-500 text-[10px] font-mono font-bold uppercase tracking-wider block">Currently Inspecting</span>
                      <span className="text-white font-mono text-[11px] mt-0.5 font-bold block">
                        laravel/{laravelFiles[selectedFileIdx]?.path}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(laravelFiles[selectedFileIdx]?.content, selectedFileIdx)}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded flex items-center space-x-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all active:scale-95 duration-100"
                    >
                      {copiedFileIndex === selectedFileIdx ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Copied Code</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy file code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex-grow overflow-auto p-6 bg-neutral-950/80 font-mono text-xs text-neutral-300 leading-relaxed max-h-[440px]">
                    <pre className="whitespace-pre">{laravelFiles[selectedFileIdx]?.content}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* DYNAMIC VEHICLE MODAL BOX (ADD/EDIT CAR) */}
      {isCarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn text-white">
          <form
            onSubmit={handleSaveCar}
            className="w-full max-w-4xl bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-neutral-950 border-b border-white/5 flex items-center justify-between shrink-0">
              <h3 className="font-display uppercase tracking-widest text-sm font-bold text-neutral-300">
                {editingCar ? `Edit Car: ${editingCar.name}` : 'Add New Vehicle Asset'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCarModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-400 font-sans">
              
              {carFormError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3.5 rounded-lg">
                  {carFormError}
                </div>
              )}

              {/* General details */}
              <div className="space-y-4">
                <span className="text-white block font-display uppercase tracking-wider text-xs font-bold border-b border-white/5 pb-1">General Specifications Metadata</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-neutral-500 block uppercase tracking-wider font-semibold mb-1 text-[10px]">Name Display Label</label>
                    <input
                      type="text"
                      value={carName}
                      onChange={e => setCarName(e.target.value)}
                      placeholder="e.g. Model S Plaid"
                      required
                      className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-2.5 text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-500 block uppercase tracking-wider font-semibold mb-1 text-[10px]">Brand Manufacturer</label>
                    <input
                      type="text"
                      value={carBrand}
                      onChange={e => setCarBrand(e.target.value)}
                      placeholder="e.g. Tesla"
                      required
                      className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-500 block uppercase tracking-wider font-semibold mb-1 text-[10px]">Design Model Code</label>
                    <input
                      type="text"
                      value={carModel}
                      onChange={e => setCarModel(e.target.value)}
                      placeholder="e.g. Plaid S"
                      required
                      className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-500 block uppercase tracking-wider font-semibold mb-1 text-[10px]">Release Year</label>
                    <input
                      type="number"
                      value={carYear}
                      onChange={e => setCarYear(parseInt(e.target.value) || new Date().getFullYear())}
                      min="1900"
                      max="2030"
                      className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-500 block uppercase tracking-wider font-semibold mb-1 text-[10px]">Est. Retail Value ($ USD)</label>
                    <input
                      type="number"
                      value={carPrice}
                      onChange={e => setCarPrice(parseFloat(e.target.value) || 0)}
                      min="0"
                      required
                      className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-500 block uppercase tracking-wider font-semibold mb-1 text-[10px]">Vehicle Description</label>
                  <textarea
                    value={carDesc}
                    onChange={e => setCarDesc(e.target.value)}
                    rows={3}
                    placeholder="Provide performance details, seating capacity, interior accent packages, and dynamic drivetrain details..."
                    className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-2.5 text-white text-xs focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Technical constraints */}
              <div className="space-y-4">
                <span className="text-white block font-display uppercase tracking-wider text-xs font-bold border-b border-white/5 pb-1">Performance Specs (JSON Schema)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-[11px]">
                  <div>
                    <label className="text-neutral-500 block uppercase tracking-wider font-semibold mb-1 text-[9px] font-sans">Est. Range (EPA)</label>
                    <input
                      type="text"
                      value={specRange}
                      onChange={e => setSpecRange(e.target.value)}
                      placeholder="e.g. 359 mi"
                      className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-2 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-500 block uppercase tracking-wider font-semibold mb-1 text-[9px] font-sans">Top Speed Velocity</label>
                    <input
                      type="text"
                      value={specSpeed}
                      onChange={e => setSpecSpeed(e.target.value)}
                      placeholder="e.g. 200 mph"
                      className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-2 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-500 block uppercase tracking-wider font-semibold mb-1 text-[9px] font-sans">0-60 MPH Acceleration</label>
                    <input
                      type="text"
                      value={specZeroSixty}
                      onChange={e => setSpecZeroSixty(e.target.value)}
                      placeholder="e.g. 1.99 s"
                      className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-2 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-500 block uppercase tracking-wider font-semibold mb-1 text-[9px] font-sans">Drivetrain</label>
                    <input
                      type="text"
                      value={specDrivetrain}
                      onChange={e => setSpecDrivetrain(e.target.value)}
                      placeholder="e.g. Tri-Motor AWD"
                      className="w-full bg-neutral-950 border border-white/10 rounded px-3 py-2 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Image file uploads */}
              <div className="space-y-4">
                <span className="text-white block font-display uppercase tracking-wider text-xs font-bold border-b border-white/5 pb-1">Media Files Assets</span>
                <div className="space-y-4">
                  {/* File Selector */}
                  <div className="border border-dashed border-white/10 rounded-2xl p-6 bg-neutral-950/40 text-center relative hover:border-red-500/30 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                    <span className="font-semibold text-white block">Upload Car Graphics</span>
                    <span className="text-neutral-500 text-[10px] mt-1 block">Compatible: JPEG, PNG, WEBP, GIF (Drag and Drop available)</span>
                  </div>

                  {/* Upload list preview */}
                  {carImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      {carImages.map((path, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-neutral-950 group border border-white/10">
                          <img
                            src={path}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeCarImage(idx)}
                            className="absolute top-2 right-2 bg-neutral-950/80 p-1 text-neutral-400 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-neutral-950/70 text-white font-mono text-[8px] rounded h-max">
                            Slot {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status checkboxes */}
              <div className="flex flex-col sm:flex-row gap-6 bg-neutral-950 p-4 rounded-xl border border-white/5">
                <label className="flex items-center space-x-3 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={carActive}
                    onChange={e => setCarActive(e.target.checked)}
                    className="w-4 h-4 rounded Accent-red bg-neutral-900 border-white/10 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-white block font-bold">Active Visibility Status</span>
                    <span className="text-[10px] text-neutral-500">Makes page available for users on the public frontend website catalog</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer text-xs sm:border-l sm:border-white/10 sm:pl-6">
                  <input
                    type="checkbox"
                    checked={carFeatured}
                    onChange={e => setCarFeatured(e.target.checked)}
                    className="w-4 h-4 rounded Accent-red bg-neutral-900 border-white/10 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-white block font-bold">Featured status</span>
                    <span className="text-[10px] text-neutral-500">Prioritizes listing at the top scrolling slides for higher visibility</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Modal actions */}
            <div className="px-6 py-4 bg-neutral-950 border-t border-white/5 flex justify-end space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsCarModalOpen(false)}
                className="bg-neutral-800 text-neutral-400 hover:text-white px-5 py-2.5 rounded font-bold uppercase text-[10px] tracking-widest border border-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingCar}
                className="bg-white hover:bg-neutral-200 text-neutral-950 px-6 py-2.5 rounded font-bold uppercase text-[10px] tracking-widest flex items-center space-x-2 shadow-lg"
              >
                {isSavingCar ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving dynamic changes...</span>
                  </>
                ) : (
                  <span>Commit Specifications</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
