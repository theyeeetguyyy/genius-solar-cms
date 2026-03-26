/* ======================================================
   Genius Solar CMS — Data Layer (Firebase-only)
   ====================================================== */
const Data = (() => {
  const STORAGE_KEY = 'solarCMS';

  const defaultData = () => ({
    customers: [],
    admin: {
      panelCompanies: ['Adani Solar', 'Tata Power Solar', 'Vikram Solar', 'Waaree Energies', 'Loom Solar'],
      inverterBrands: ['Growatt', 'Sungrow', 'Havells', 'ABB', 'Delta', 'Fronius'],
      technicians: ['Rahul', 'Amit', 'Suresh']
    }
  });

  // In-memory data store (Firebase is the source of truth)
  let _data = defaultData();

  /* --- Core read/write --- */
  function _load() {
    return _data;
  }

  function _save(data) {
    _data = data;
    // Write to Firebase (sole data persistence)
    if (typeof FirebaseSync !== 'undefined' && FirebaseSync.isReady()) {
      FirebaseSync.save(data);
    }
  }

  // Called by FirebaseSync when data arrives from cloud
  function setData(data) {
    if (!data) { _data = defaultData(); return; }
    if (!data.admin) data.admin = defaultData().admin;
    if (!data.customers) data.customers = [];
    _data = data;
  }

  // Get raw data for export / initial push
  function getRawData() {
    return JSON.parse(JSON.stringify(_data));
  }

  // One-time migration: check if localStorage has old data
  function migrateFromLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (d && d.customers && d.customers.length > 0) {
        console.log('%c📦 Found existing localStorage data — will migrate to Firebase', 'color:#f59e0b;font-weight:600');
        localStorage.removeItem(STORAGE_KEY); // Clean up
        return d;
      }
      localStorage.removeItem(STORAGE_KEY); // Clean up empty data too
    } catch (e) { /* ignore */ }
    return null;
  }

  /* --- CRUD --- */
  function getAllCustomers() { return _load().customers; }
  function getCustomer(id) { return _load().customers.find(c => c.id === id) || null; }

  function addCustomer(cust) {
    const data = _load();
    cust.id = _uid();
    cust.services = generateServices(cust.installDate);
    if (!cust.cleaningLog) cust.cleaningLog = [];
    data.customers.push(cust);
    _save(data);
    return cust;
  }

  function updateCustomer(id, updates) {
    const data = _load();
    const idx = data.customers.findIndex(c => c.id === id);
    if (idx === -1) return null;
    if (updates.installDate && updates.installDate !== data.customers[idx].installDate) {
      const oldServices = data.customers[idx].services || [];
      const newServices = generateServices(updates.installDate);
      newServices.forEach((ns, i) => {
        if (oldServices[i] && (oldServices[i].status === 'completed' || oldServices[i].status === 'skipped')) {
          ns.status = oldServices[i].status;
          ns.doneDate = oldServices[i].doneDate;
          ns.technician = oldServices[i].technician;
          ns.notes = oldServices[i].notes;
        }
      });
      updates.services = newServices;
    }
    Object.assign(data.customers[idx], updates);
    _save(data);
    return data.customers[idx];
  }

  function deleteCustomer(id) {
    const data = _load();
    data.customers = data.customers.filter(c => c.id !== id);
    _save(data);
  }

  /* --- Service Generation --- */
  function generateServices(installDateStr) {
    const services = [];
    const base = new Date(installDateStr);
    for (let i = 1; i <= 10; i++) {
      const due = new Date(base);
      due.setMonth(due.getMonth() + i * 6);
      services.push({
        id: _uid(),
        serviceNumber: i,
        dueDate: due.toISOString().split('T')[0],
        status: 'pending',
        doneDate: null,
        technician: null,
        notes: null
      });
    }
    return services;
  }

  function markServiceDone(custId, serviceId, details) {
    const data = _load();
    const cust = data.customers.find(c => c.id === custId);
    if (!cust) return;
    const svc = cust.services.find(s => s.id === serviceId);
    if (!svc) return;
    svc.status = 'completed';
    svc.doneDate = details.doneDate;
    svc.technician = details.technician;
    svc.notes = details.notes;
    _save(data);
  }

  function skipService(custId, serviceId) {
    const data = _load();
    const cust = data.customers.find(c => c.id === custId);
    if (!cust) return;
    const svc = cust.services.find(s => s.id === serviceId);
    if (!svc) return;
    svc.status = 'skipped';
    _save(data);
  }

  function unskipService(custId, serviceId) {
    const data = _load();
    const cust = data.customers.find(c => c.id === custId);
    if (!cust) return;
    const svc = cust.services.find(s => s.id === serviceId);
    if (!svc) return;
    svc.status = 'pending';
    svc.doneDate = null;
    svc.technician = null;
    svc.notes = null;
    _save(data);
  }

  /* --- AMC / Cleaning --- */
  function addCleaningEntry(custId, entry) {
    const data = _load();
    const cust = data.customers.find(c => c.id === custId);
    if (!cust) return;
    if (!cust.cleaningLog) cust.cleaningLog = [];
    entry.id = _uid();
    cust.cleaningLog.push(entry);
    _save(data);
    return entry;
  }

  function updateCleaningEntry(custId, entryId, updates) {
    const data = _load();
    const cust = data.customers.find(c => c.id === custId);
    if (!cust) return;
    const entry = (cust.cleaningLog || []).find(e => e.id === entryId);
    if (!entry) return;
    Object.assign(entry, updates);
    _save(data);
  }

  function deleteCleaningEntry(custId, entryId) {
    const data = _load();
    const cust = data.customers.find(c => c.id === custId);
    if (!cust) return;
    cust.cleaningLog = (cust.cleaningLog || []).filter(e => e.id !== entryId);
    _save(data);
  }

  /* --- Admin --- */
  function getAdminLists() { return _load().admin; }

  function addAdminItem(listName, value) {
    const data = _load();
    if (!data.admin[listName]) data.admin[listName] = [];
    if (!data.admin[listName].includes(value)) {
      data.admin[listName].push(value);
      _save(data);
    }
  }

  function updateAdminItem(listName, oldVal, newVal) {
    const data = _load();
    const arr = data.admin[listName];
    if (!arr) return;
    const idx = arr.indexOf(oldVal);
    if (idx !== -1) { arr[idx] = newVal; _save(data); }
  }

  function deleteAdminItem(listName, value) {
    const data = _load();
    if (!data.admin[listName]) return;
    data.admin[listName] = data.admin[listName].filter(v => v !== value);
    _save(data);
  }

  /* --- Queries --- */
  function getUpcomingServices() {
    const results = [];
    _load().customers.forEach(cust => {
      (cust.services || []).forEach(svc => {
        if (svc.status === 'pending') {
          results.push({ ...svc, customerId: cust.id, customerName: cust.name, customerMobile: cust.mobile });
        }
      });
    });
    results.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    return results;
  }

  function getOverdueServices() {
    const today = _todayStr();
    return getUpcomingServices().filter(s => s.dueDate < today);
  }

  function getDueThisMonth() {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const start = new Date(y, m, 1).toISOString().split('T')[0];
    const end = new Date(y, m + 1, 0).toISOString().split('T')[0];
    return getUpcomingServices().filter(s => s.dueDate >= start && s.dueDate <= end);
  }

  function getActiveAMCCount() {
    return _load().customers.filter(c => c.amcEnabled).length;
  }

  /* --- Export / Import --- */
  function exportData() {
    return JSON.stringify(_load(), null, 2);
  }

  function importData(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.customers || !data.admin) throw new Error('Invalid format');
      _save(data);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }

  function clearAllData() {
    _save(defaultData());
  }

  /* --- Utilities --- */
  function _uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 9); }
  function _todayStr() { return new Date().toISOString().split('T')[0]; }

  function getServiceStatus(dueDate, status) {
    if (status === 'completed') return 'completed';
    if (status === 'skipped') return 'skipped';
    const today = _todayStr();
    if (dueDate < today) return 'overdue';
    return 'pending';
  }

  function getDaysRemaining(dueDateStr) {
    const due = new Date(dueDateStr);
    const today = new Date(); today.setHours(0,0,0,0);
    return Math.ceil((due - today) / 86400000);
  }

  return {
    getAllCustomers, getCustomer, addCustomer, updateCustomer, deleteCustomer,
    generateServices, markServiceDone, skipService, unskipService,
    addCleaningEntry, updateCleaningEntry, deleteCleaningEntry,
    getAdminLists, addAdminItem, updateAdminItem, deleteAdminItem,
    getUpcomingServices, getOverdueServices, getDueThisMonth, getActiveAMCCount,
    exportData, importData, clearAllData,
    getServiceStatus, getDaysRemaining,
    setData, getRawData, migrateFromLocalStorage
  };
})();
