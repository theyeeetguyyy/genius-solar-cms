/* ======================================================
   Genius Solar CMS — UI Rendering
   ====================================================== */
const UI = (() => {
  /* -------- SVG Icon Library -------- */
  const icons = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    customers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    add: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    admin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    skip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>',
    undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>'
  };

  /* -------- Utility -------- */
  function _formatDate(ds) {
    if (!ds) return '—';
    return new Date(ds).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function _daysRemainingBadge(dueDate) {
    const days = Data.getDaysRemaining(dueDate);
    if (days < 0) return `<span class="badge badge-overdue">Overdue ${Math.abs(days)}d</span>`;
    if (days <= 7) return `<span class="badge badge-due-soon">${days}d left</span>`;
    if (days <= 30) return `<span class="badge badge-due-month">${days}d left</span>`;
    return `<span class="badge badge-pending">${days}d left</span>`;
  }

  function _statusBadge(dueDate, status) {
    const s = Data.getServiceStatus(dueDate, status);
    const labels = { completed: 'Completed', overdue: 'Overdue', pending: 'Pending', skipped: 'Skipped' };
    const classes = { completed: 'badge-completed', overdue: 'badge-overdue', pending: 'badge-pending', skipped: 'badge-skipped' };
    return `<span class="badge ${classes[s]}">${labels[s]}</span>`;
  }

  function _comboboxField(name, label, listName, value) {
    const admin = Data.getAdminLists();
    const items = admin[listName] || [];
    const dlId = 'dl_' + name + '_' + Date.now();
    return `
      <div class="form-group">
        <label for="${name}">${label}</label>
        <div class="combobox-wrapper">
          <input type="text" id="${name}" name="${name}" list="${dlId}" value="${value || ''}" autocomplete="off" placeholder="Select or type...">
          <datalist id="${dlId}">
            ${items.map(it => `<option value="${_escHtml(it)}">`).join('')}
          </datalist>
        </div>
      </div>`;
  }

  function _escHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function _getNextServiceDue(customer) {
    const pending = (customer.services || [])
      .filter(s => s.status === 'pending')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    return pending.length > 0 ? pending[0] : null;
  }

  /* -------- Toast Notification -------- */
  function showToast(message, type) {
    type = type || 'success';
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  /* ======== PAGE RENDERERS ======== */

  /* -------- DASHBOARD -------- */
  function renderDashboard() {
    const customers = Data.getAllCustomers();
    const overdue = Data.getOverdueServices();
    const dueThisMonth = Data.getDueThisMonth();
    const activeAMC = Data.getActiveAMCCount();
    const upcoming = Data.getUpcomingServices().slice(0, 20);

    return `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back — here's your service overview</p>
        </div>
      </div>

      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon blue">${icons.customers}</div>
          <div class="card-info"><h3>${customers.length}</h3><p>Total Customers</p></div>
        </div>
        <div class="summary-card">
          <div class="card-icon red">${icons.alert}</div>
          <div class="card-info"><h3>${overdue.length}</h3><p>Overdue Services</p></div>
        </div>
        <div class="summary-card">
          <div class="card-icon orange">${icons.calendar}</div>
          <div class="card-info"><h3>${dueThisMonth.length}</h3><p>Due This Month</p></div>
        </div>
        <div class="summary-card">
          <div class="card-icon green">${icons.shield}</div>
          <div class="card-info"><h3>${activeAMC}</h3><p>Active AMC Contracts</p></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">${icons.calendar} Upcoming Services</div>
        ${upcoming.length === 0 ? '<div class="empty-state"><h3>No pending services</h3><p>All caught up!</p></div>' : `
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>Customer</th><th>Mobile</th><th>Service #</th><th>Due Date</th><th>Status</th>
            </tr></thead>
            <tbody>
              ${upcoming.map(s => `
                <tr class="clickable" data-navigate="#customer/${s.customerId}">
                  <td><strong>${_escHtml(s.customerName)}</strong></td>
                  <td><a href="tel:${_escHtml(s.customerMobile)}" class="phone-link" onclick="event.stopPropagation()">${icons.phone} ${_escHtml(s.customerMobile)}</a></td>
                  <td>#${s.serviceNumber}</td>
                  <td>${_formatDate(s.dueDate)}</td>
                  <td>${_daysRemainingBadge(s.dueDate)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`}
      </div>

      <div class="card">
        <div class="card-title">${icons.sun} 5-Year Service Timeline</div>
        <div id="timeline-chart" class="timeline-container"></div>
      </div>
    </div>`;
  }

  /* -------- CUSTOMERS LIST -------- */
  function renderCustomersList(searchQuery, filterType, sortBy) {
    let customers = Data.getAllCustomers();
    searchQuery = (searchQuery || '').toLowerCase();
    filterType = filterType || 'all';
    sortBy = sortBy || 'name';

    if (searchQuery) {
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery) ||
        c.mobile.toLowerCase().includes(searchQuery) ||
        c.address.toLowerCase().includes(searchQuery)
      );
    }
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    if (filterType === 'amc') customers = customers.filter(c => c.amcEnabled);
    if (filterType === 'noamc') customers = customers.filter(c => !c.amcEnabled);
    if (filterType === 'overdue') {
      customers = customers.filter(c => (c.services || []).some(s => s.status === 'pending' && s.dueDate < today));
    }
    if (filterType === 'duemonth') {
      customers = customers.filter(c => (c.services || []).some(s => s.status === 'pending' && s.dueDate >= monthStart && s.dueDate <= monthEnd));
    }

    customers.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'installDate') return (a.installDate || '').localeCompare(b.installDate || '');
      if (sortBy === 'nextService') {
        const na = _getNextServiceDue(a), nb = _getNextServiceDue(b);
        const da = na ? na.dueDate : '9999', db = nb ? nb.dueDate : '9999';
        return da.localeCompare(db);
      }
      return 0;
    });

    return `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h2>Customers</h2>
          <p>${customers.length} customer${customers.length !== 1 ? 's' : ''}</p>
        </div>
        <button class="btn btn-primary" data-navigate="#add-customer">${icons.add} Add Customer</button>
      </div>

      <div class="toolbar">
        <div class="search-box">
          ${icons.search}
          <input type="text" id="customer-search" placeholder="Search by name, mobile, address..." value="${_escHtml(searchQuery)}">
        </div>
        <div class="filter-group">
          <button class="filter-btn ${filterType==='all'?'active':''}" data-filter="all">All</button>
          <button class="filter-btn ${filterType==='amc'?'active':''}" data-filter="amc">AMC Active</button>
          <button class="filter-btn ${filterType==='noamc'?'active':''}" data-filter="noamc">No AMC</button>
          <button class="filter-btn ${filterType==='overdue'?'active':''}" data-filter="overdue">Overdue</button>
          <button class="filter-btn ${filterType==='duemonth'?'active':''}" data-filter="duemonth">Due This Month</button>
        </div>
      </div>

      <div class="card" style="padding:0;overflow:hidden">
        <div style="padding:12px 16px;display:flex;gap:8px;align-items:center;border-bottom:1px solid var(--gray-200);font-size:.82rem;color:var(--gray-500)">
          <span>Sort by:</span>
          <button class="filter-btn btn-xs ${sortBy==='name'?'active':''}" data-sort="name">Name</button>
          <button class="filter-btn btn-xs ${sortBy==='installDate'?'active':''}" data-sort="installDate">Install Date</button>
          <button class="filter-btn btn-xs ${sortBy==='nextService'?'active':''}" data-sort="nextService">Next Service</button>
        </div>
        ${customers.length === 0 ? '<div class="empty-state"><h3>No customers found</h3><p>Try adjusting your search or filters</p></div>' : `
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>Name</th><th>Mobile</th><th>Address</th><th>Installed</th><th>kW</th><th>Next Service</th><th>AMC</th>
            </tr></thead>
            <tbody>
              ${customers.map(c => {
                const nxt = _getNextServiceDue(c);
                return `
                <tr class="clickable" data-navigate="#customer/${c.id}">
                  <td><strong>${_escHtml(c.name)}</strong></td>
                  <td>${_escHtml(c.mobile)}</td>
                  <td>${_escHtml(c.address)}</td>
                  <td>${_formatDate(c.installDate)}</td>
                  <td>${c.kw || '—'}</td>
                  <td>${nxt ? _daysRemainingBadge(nxt.dueDate) : '<span class="badge badge-completed">All Done</span>'}</td>
                  <td>${c.amcEnabled ? '<span class="badge badge-active">Active</span>' : '<span class="badge badge-inactive">No</span>'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>`}
      </div>
    </div>`;
  }

  /* -------- ADD / EDIT CUSTOMER FORM -------- */
  function renderAddEditCustomer(customerId) {
    const isEdit = !!customerId;
    const c = isEdit ? Data.getCustomer(customerId) : {};
    if (isEdit && !c) return '<div class="empty-state"><h3>Customer not found</h3></div>';

    return `
    <div class="fade-in">
      <a class="back-link" href="javascript:void(0)" data-navigate="${isEdit ? '#customer/' + customerId : '#customers'}">${icons.back} Back</a>
      <div class="page-header">
        <h2>${isEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
      </div>

      <div class="card">
        <form id="customer-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="cust-name">Customer Name *</label>
              <input type="text" id="cust-name" name="name" value="${_escHtml(c.name || '')}" required>
            </div>
            <div class="form-group">
              <label for="cust-mobile">Mobile Number *</label>
              <input type="text" id="cust-mobile" name="mobile" value="${_escHtml(c.mobile || '')}" required>
            </div>
            <div class="form-group full-width">
              <label for="cust-address">Address *</label>
              <input type="text" id="cust-address" name="address" value="${_escHtml(c.address || '')}" required>
            </div>
            <div class="form-group">
              <label for="cust-installDate">Date of Installation *</label>
              <input type="date" id="cust-installDate" name="installDate" value="${c.installDate || ''}" required>
            </div>
            <div class="form-group">
              <label for="cust-kw">kW of Solar Panel</label>
              <input type="number" id="cust-kw" name="kw" value="${c.kw || ''}" step="0.1" min="0">
            </div>
            <div class="form-group">
              <label for="cust-numPanels">Number of Panels</label>
              <input type="number" id="cust-numPanels" name="numPanels" value="${c.numPanels || ''}" min="0">
            </div>
            ${_comboboxField('cust-panelCompany', 'Panel Company', 'panelCompanies', c.panelCompany)}
            ${_comboboxField('cust-inverterBrand', 'Inverter Brand', 'inverterBrands', c.inverterBrand)}
            <div class="form-group">
              <label for="cust-panelWarranty">Panel Warranty (years)</label>
              <input type="number" id="cust-panelWarranty" name="panelWarranty" value="${c.panelWarranty || ''}" min="0" max="30">
            </div>
            <div class="form-group">
              <label for="cust-inverterWarranty">Inverter Warranty (years)</label>
              <input type="number" id="cust-inverterWarranty" name="inverterWarranty" value="${c.inverterWarranty || ''}" min="0" max="30">
            </div>
          </div>

          <div id="service-preview" class="service-preview" style="${c.installDate ? '' : 'display:none'}">
            <h4>📅 Scheduled Services Preview (10 services, every 6 months)</h4>
            <div class="preview-grid" id="preview-grid">
              ${c.installDate ? _renderServicePreview(c.installDate) : ''}
            </div>
          </div>

          <div style="margin-top:24px;display:flex;gap:12px;justify-content:flex-end">
            <button type="button" class="btn btn-outline" data-navigate="${isEdit ? '#customer/' + customerId : '#customers'}">Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Update Customer' : 'Add Customer'}</button>
          </div>

          <input type="hidden" id="cust-id" value="${customerId || ''}">
        </form>
      </div>
    </div>`;
  }

  function _renderServicePreview(installDate) {
    const svcs = Data.generateServices(installDate);
    return svcs.map(s => `
      <div class="preview-item">
        <span class="preview-dot"></span>
        <span>Service #${s.serviceNumber}: ${_formatDate(s.dueDate)}</span>
      </div>`).join('');
  }

  /* -------- CUSTOMER DETAIL -------- */
  function renderCustomerDetail(customerId) {
    const c = Data.getCustomer(customerId);
    if (!c) return '<div class="empty-state"><h3>Customer not found</h3></div>';

    let panelWarrantyExpiry = '', inverterWarrantyExpiry = '';
    let panelExpired = false, inverterExpired = false;
    if (c.installDate && c.panelWarranty) {
      const d = new Date(c.installDate); d.setFullYear(d.getFullYear() + parseInt(c.panelWarranty));
      panelWarrantyExpiry = _formatDate(d.toISOString().split('T')[0]);
      panelExpired = d < new Date();
    }
    if (c.installDate && c.inverterWarranty) {
      const d = new Date(c.installDate); d.setFullYear(d.getFullYear() + parseInt(c.inverterWarranty));
      inverterWarrantyExpiry = _formatDate(d.toISOString().split('T')[0]);
      inverterExpired = d < new Date();
    }

    return `
    <div class="fade-in">
      <a class="back-link" href="javascript:void(0)" data-navigate="#customers">${icons.back} Back to Customers</a>

      <div class="page-header">
        <div>
          <h2>${_escHtml(c.name)}</h2>
          <p>${_escHtml(c.address)}</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <a href="tel:${_escHtml(c.mobile)}" class="btn btn-outline btn-sm">${icons.phone} Call</a>
          <button class="btn btn-outline btn-sm" onclick="window.print()">${icons.print} Print</button>
          <button class="btn btn-secondary btn-sm" data-navigate="#edit-customer/${c.id}">${icons.edit} Edit</button>
          <button class="btn btn-danger btn-sm" id="btn-delete-customer" data-customer-id="${c.id}">${icons.trash} Delete</button>
        </div>
      </div>

      <div class="card">
        <div class="card-title">${icons.sun} System Information</div>
        <div class="info-grid">
          <div class="info-item"><label>Mobile</label><p><a href="tel:${_escHtml(c.mobile)}" class="phone-link">${icons.phone} ${_escHtml(c.mobile)}</a></p></div>
          <div class="info-item"><label>Installation Date</label><p>${_formatDate(c.installDate)}</p></div>
          <div class="info-item"><label>System Size</label><p>${c.kw ? c.kw + ' kW' : '—'}</p></div>
          <div class="info-item"><label>Number of Panels</label><p>${c.numPanels || '—'}</p></div>
          <div class="info-item"><label>Panel Company</label><p>${_escHtml(c.panelCompany) || '—'}</p></div>
          <div class="info-item"><label>Inverter Brand</label><p>${_escHtml(c.inverterBrand) || '—'}</p></div>
        </div>

        ${(panelWarrantyExpiry || inverterWarrantyExpiry) ? `
        <div class="warranty-info">
          ${panelWarrantyExpiry ? `<div class="warranty-tag ${panelExpired ? 'expired' : ''}">${icons.shield} Panel warranty ${panelExpired ? 'expired' : 'expires'}: ${panelWarrantyExpiry}</div>` : ''}
          ${inverterWarrantyExpiry ? `<div class="warranty-tag ${inverterExpired ? 'expired' : ''}">${icons.shield} Inverter warranty ${inverterExpired ? 'expired' : 'expires'}: ${inverterWarrantyExpiry}</div>` : ''}
        </div>` : ''}
      </div>

      <!-- Service History Section -->
      <div class="card">
        <div class="card-title">${icons.calendar} Service History</div>
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>#</th><th>Due Date</th><th>Status</th><th>Done Date</th><th>Technician</th><th>Notes</th><th>Actions</th>
            </tr></thead>
            <tbody>
              ${(c.services || []).map(s => {
                const st = Data.getServiceStatus(s.dueDate, s.status);
                let actions = '';
                if (s.status === 'skipped') {
                  actions = `<button class="btn btn-outline btn-xs" data-unskip-service="${s.id}" data-cust-id="${c.id}" title="Undo skip">${icons.undo} Undo</button>`;
                } else if (s.status !== 'completed') {
                  actions = `
                    <button class="btn btn-success btn-xs" data-mark-done="${s.id}" data-cust-id="${c.id}">${icons.check} Done</button>
                    <button class="btn btn-outline btn-xs" data-skip-service="${s.id}" data-cust-id="${c.id}" title="Skip this service">${icons.skip} Skip</button>`;
                }
                return `
                <tr class="${st === 'skipped' ? 'row-skipped' : ''}">
                  <td><strong>${s.serviceNumber}</strong></td>
                  <td>${_formatDate(s.dueDate)}</td>
                  <td>${_statusBadge(s.dueDate, s.status)}</td>
                  <td>${s.doneDate ? _formatDate(s.doneDate) : '—'}</td>
                  <td>${_escHtml(s.technician) || '—'}</td>
                  <td>${_escHtml(s.notes) || '—'}</td>
                  <td><div class="action-btns">${actions}</div></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- AMC Section -->
      <div class="card">
        <div class="card-title">${icons.shield} AMC / Cleaning Contract</div>
        <div class="amc-toggle">
          <label class="toggle-switch">
            <input type="checkbox" id="amc-toggle" ${c.amcEnabled ? 'checked' : ''} data-customer-id="${c.id}">
            <span class="toggle-slider"></span>
          </label>
          <span id="amc-toggle-label" style="font-size:.9rem;font-weight:500;color:var(--gray-600)">
            ${c.amcEnabled ? 'AMC Active' : 'Enable AMC for this customer'}
          </span>
        </div>

        <div id="amc-details" style="${c.amcEnabled ? '' : 'display:none'}">
          <div class="form-grid" style="margin-bottom:20px">
            <div class="form-group">
              <label>Contract Start Date</label>
              <input type="date" id="amc-start" value="${c.amcStartDate || ''}" data-customer-id="${c.id}">
            </div>
            <div class="form-group">
              <label>Contract End Date</label>
              <input type="date" id="amc-end" value="${c.amcEndDate || ''}" data-customer-id="${c.id}">
            </div>
            <div class="form-group">
              <label>Cleaning Frequency</label>
              <input type="text" id="amc-frequency" value="${_escHtml(c.amcFrequency || '')}" placeholder="e.g. every 2 months" data-customer-id="${c.id}">
            </div>
          </div>
          <button class="btn btn-outline btn-sm" id="save-amc-info" data-customer-id="${c.id}" style="margin-bottom:20px">${icons.check} Save AMC Info</button>

          <h4 style="font-size:.95rem;font-weight:600;margin-bottom:12px;color:var(--navy-700)">Cleaning Log</h4>
          <button class="btn btn-primary btn-sm" id="add-cleaning-entry" data-customer-id="${c.id}" style="margin-bottom:12px">${icons.plus} Add Cleaning Entry</button>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Due Date</th><th>Done Date</th><th>Technician</th><th>Notes</th><th>Actions</th></tr></thead>
              <tbody>
                ${(c.cleaningLog || []).length === 0 ? '<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:20px">No cleaning entries yet</td></tr>' : ''}
                ${(c.cleaningLog || []).map(e => `
                  <tr>
                    <td>${_formatDate(e.dueDate)}</td>
                    <td>${_formatDate(e.doneDate)}</td>
                    <td>${_escHtml(e.technician) || '—'}</td>
                    <td>${_escHtml(e.notes) || '—'}</td>
                    <td>
                      <button class="btn btn-outline btn-xs" data-edit-cleaning="${e.id}" data-cust-id="${c.id}">${icons.edit}</button>
                      <button class="btn btn-danger btn-xs" data-delete-cleaning="${e.id}" data-cust-id="${c.id}">${icons.trash}</button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* -------- ADMIN PANEL -------- */
  function renderAdminPanel() {
    const admin = Data.getAdminLists();
    const lists = [
      { key: 'panelCompanies', label: 'Panel Companies', icon: icons.sun },
      { key: 'inverterBrands', label: 'Inverter Brands', icon: icons.shield },
      { key: 'technicians', label: 'Technicians', icon: icons.customers }
    ];

    return `
    <div class="fade-in">
      <div class="page-header">
        <h2>Admin Panel</h2>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px">
        ${lists.map(l => `
          <div class="card">
            <div class="card-title">${l.icon} ${l.label}</div>
            <div id="admin-list-${l.key}">
              ${(admin[l.key] || []).map(item => `
                <div class="admin-list-item">
                  <span>${_escHtml(item)}</span>
                  <div class="admin-actions">
                    <button class="btn btn-outline btn-xs" data-admin-edit="${l.key}" data-value="${_escHtml(item)}">${icons.edit}</button>
                    <button class="btn btn-danger btn-xs" data-admin-delete="${l.key}" data-value="${_escHtml(item)}">${icons.trash}</button>
                  </div>
                </div>`).join('')}
            </div>
            <div style="display:flex;gap:8px;margin-top:12px">
              <input type="text" id="new-${l.key}" placeholder="Add new ${l.label.toLowerCase().slice(0,-1)}..." style="flex:1;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:.85rem;font-family:inherit">
              <button class="btn btn-primary btn-sm admin-add-btn" data-admin-add="${l.key}">Add</button>
            </div>
          </div>`).join('')}
      </div>

      <!-- Import / Export -->
      <div class="card" style="margin-top:20px">
        <div class="card-title">${icons.download} Data Management</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-sm" id="btn-export">${icons.download} Export Data (JSON)</button>
          <label class="btn btn-outline btn-sm" style="cursor:pointer">
            ${icons.upload} Import Data (JSON)
            <input type="file" id="btn-import" accept=".json" style="display:none">
          </label>
        </div>
      </div>

      <div class="danger-zone">
        <h4>⚠️ Danger Zone</h4>
        <p>Permanently delete all customer and service data. This action cannot be undone.</p>
        <button class="btn btn-danger btn-sm" id="btn-clear-data">${icons.trash} Clear All Data</button>
      </div>
    </div>`;
  }

  /* -------- MODALS -------- */
  function showModal(title, bodyHTML, onSave) {
    const overlay = document.getElementById('modal-overlay');
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" id="modal-close-btn">${icons.x}</button>
        </div>
        <div class="modal-body">${bodyHTML}</div>
        <div class="modal-footer">
          <button class="btn btn-outline btn-sm" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary btn-sm" id="modal-save-btn">${icons.check} Save</button>
        </div>
      </div>`;
    overlay.classList.add('open');
    document.getElementById('modal-close-btn').onclick = closeModal;
    document.getElementById('modal-cancel-btn').onclick = closeModal;
    document.getElementById('modal-save-btn').onclick = () => { onSave(); closeModal(); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  }

  function showConfirmModal(title, message, onConfirm) {
    const overlay = document.getElementById('modal-overlay');
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" id="modal-close-btn">${icons.x}</button>
        </div>
        <div class="modal-body"><p style="color:var(--gray-600)">${message}</p></div>
        <div class="modal-footer">
          <button class="btn btn-outline btn-sm" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-danger btn-sm" id="modal-confirm-btn">Confirm</button>
        </div>
      </div>`;
    overlay.classList.add('open');
    document.getElementById('modal-close-btn').onclick = closeModal;
    document.getElementById('modal-cancel-btn').onclick = closeModal;
    document.getElementById('modal-confirm-btn').onclick = () => { onConfirm(); closeModal(); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
  }

  function markServiceDoneModal(custId, serviceId) {
    const admin = Data.getAdminLists();
    const techs = admin.technicians || [];
    const dlId = 'dl_tech_modal_' + Date.now();
    const todayStr = new Date().toISOString().split('T')[0];
    showModal('Mark Service as Done', `
      <div class="form-grid">
        <div class="form-group">
          <label for="modal-doneDate">Done Date</label>
          <input type="date" id="modal-doneDate" value="${todayStr}">
        </div>
        <div class="form-group">
          <label for="modal-technician">Technician</label>
          <div class="combobox-wrapper">
            <input type="text" id="modal-technician" list="${dlId}" placeholder="Select or type...">
            <datalist id="${dlId}">${techs.map(t => `<option value="${_escHtml(t)}">`).join('')}</datalist>
          </div>
        </div>
        <div class="form-group full-width">
          <label for="modal-notes">Notes</label>
          <textarea id="modal-notes" rows="3" placeholder="Any notes about this service..."></textarea>
        </div>
      </div>`, () => {
        Data.markServiceDone(custId, serviceId, {
          doneDate: document.getElementById('modal-doneDate').value,
          technician: document.getElementById('modal-technician').value,
          notes: document.getElementById('modal-notes').value
        });
        showToast('Service marked as done!');
        App.navigate('#customer/' + custId);
      });
  }

  function cleaningEntryModal(custId, entry) {
    const admin = Data.getAdminLists();
    const techs = admin.technicians || [];
    const dlId = 'dl_tech_clean_' + Date.now();
    const isEdit = !!entry;
    const todayStr = new Date().toISOString().split('T')[0];
    showModal(isEdit ? 'Edit Cleaning Entry' : 'Add Cleaning Entry', `
      <div class="form-grid">
        <div class="form-group">
          <label for="clean-dueDate">Due Date</label>
          <input type="date" id="clean-dueDate" value="${entry ? entry.dueDate : todayStr}">
        </div>
        <div class="form-group">
          <label for="clean-doneDate">Done Date</label>
          <input type="date" id="clean-doneDate" value="${entry ? entry.doneDate || '' : ''}">
        </div>
        <div class="form-group">
          <label for="clean-technician">Technician</label>
          <div class="combobox-wrapper">
            <input type="text" id="clean-technician" list="${dlId}" value="${entry ? _escHtml(entry.technician || '') : ''}" placeholder="Select or type...">
            <datalist id="${dlId}">${techs.map(t => `<option value="${_escHtml(t)}">`).join('')}</datalist>
          </div>
        </div>
        <div class="form-group full-width">
          <label for="clean-notes">Notes</label>
          <textarea id="clean-notes" rows="3" placeholder="Any notes...">${entry ? _escHtml(entry.notes || '') : ''}</textarea>
        </div>
      </div>`, () => {
        const data = {
          dueDate: document.getElementById('clean-dueDate').value,
          doneDate: document.getElementById('clean-doneDate').value,
          technician: document.getElementById('clean-technician').value,
          notes: document.getElementById('clean-notes').value
        };
        if (isEdit) {
          Data.updateCleaningEntry(custId, entry.id, data);
          showToast('Cleaning entry updated!');
        } else {
          Data.addCleaningEntry(custId, data);
          showToast('Cleaning entry added!');
        }
        App.navigate('#customer/' + custId);
      });
  }

  return {
    icons,
    renderDashboard, renderCustomersList, renderAddEditCustomer,
    renderCustomerDetail, renderAdminPanel,
    showModal, showConfirmModal, closeModal, showToast,
    markServiceDoneModal, cleaningEntryModal,
    _renderServicePreview, _formatDate, _escHtml
  };
})();
