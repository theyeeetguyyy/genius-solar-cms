/* ======================================================
   Genius Solar CMS — App Controller (Router & Events)
   ====================================================== */
const App = (() => {
  let currentFilter = 'all';
  let currentSort = 'name';
  let currentSearch = '';

  function init() {
    window.addEventListener('hashchange', () => route());
    document.getElementById('app-content').addEventListener('click', handleGlobalClick);

    // Initialize Firebase — it will call refreshCurrentPage() when data is ready
    // The loading overlay stays visible until then (no early route() call)
    if (typeof FirebaseSync !== 'undefined') {
      FirebaseSync.init();
    } else {
      // No Firebase — render immediately with empty data
      setActiveNav();
      route();
    }
  }

  function navigate(hash) {
    if (window.location.hash === hash) {
      // Force re-render even if hash hasn't changed
      route();
    } else {
      window.location.hash = hash;
    }
  }

  function refreshCurrentPage() {
    setActiveNav();
    route();
  }

  function route() {
    const hash = window.location.hash || '#dashboard';
    const content = document.getElementById('app-content');

    if (hash === '#dashboard') {
      content.innerHTML = UI.renderDashboard();
      Charts.renderTimeline(document.getElementById('timeline-chart'));
    } else if (hash === '#customers') {
      content.innerHTML = UI.renderCustomersList(currentSearch, currentFilter, currentSort);
      bindCustomerListEvents();
    } else if (hash === '#add-customer') {
      content.innerHTML = UI.renderAddEditCustomer(null);
      bindCustomerFormEvents();
    } else if (hash.startsWith('#edit-customer/')) {
      const id = hash.split('/')[1];
      content.innerHTML = UI.renderAddEditCustomer(id);
      bindCustomerFormEvents();
    } else if (hash.startsWith('#customer/')) {
      const id = hash.split('/')[1];
      content.innerHTML = UI.renderCustomerDetail(id);
      bindCustomerDetailEvents(id);
    } else if (hash === '#admin') {
      content.innerHTML = UI.renderAdminPanel();
      bindAdminEvents();
    } else {
      content.innerHTML = UI.renderDashboard();
      Charts.renderTimeline(document.getElementById('timeline-chart'));
    }

    setActiveNav();
    window.scrollTo(0, 0);
  }

  function setActiveNav() {
    const hash = window.location.hash || '#dashboard';
    const base = hash.split('/')[0];
    document.querySelectorAll('.sidebar-nav a, .bottom-nav a').forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active',
        href === base ||
        (href === '#customers' && (base === '#add-customer' || base === '#edit-customer' || base === '#customer'))
      );
    });
  }

  /* -------- Global Click Handler -------- */
  function handleGlobalClick(e) {
    // Navigate links
    const navEl = e.target.closest('[data-navigate]');
    if (navEl) {
      e.preventDefault();
      navigate(navEl.dataset.navigate);
      return;
    }

    // Mark service as done
    const markDone = e.target.closest('[data-mark-done]');
    if (markDone) {
      UI.markServiceDoneModal(markDone.dataset.custId, markDone.dataset.markDone);
      return;
    }

    // Skip / unskip service
    const skipSvc = e.target.closest('[data-skip-service]');
    if (skipSvc) {
      Data.skipService(skipSvc.dataset.custId, skipSvc.dataset.skipService);
      UI.showToast('Service skipped');
      navigate('#customer/' + skipSvc.dataset.custId);
      return;
    }

    const unskipSvc = e.target.closest('[data-unskip-service]');
    if (unskipSvc) {
      Data.unskipService(unskipSvc.dataset.custId, unskipSvc.dataset.unskipService);
      UI.showToast('Service restored');
      navigate('#customer/' + unskipSvc.dataset.custId);
      return;
    }

    // Cleaning entry actions
    const editClean = e.target.closest('[data-edit-cleaning]');
    if (editClean) {
      const custId = editClean.dataset.custId;
      const entryId = editClean.dataset.editCleaning;
      const cust = Data.getCustomer(custId);
      const entry = (cust.cleaningLog || []).find(e => e.id === entryId);
      if (entry) UI.cleaningEntryModal(custId, entry);
      return;
    }

    const delClean = e.target.closest('[data-delete-cleaning]');
    if (delClean) {
      UI.showConfirmModal('Delete Entry', 'Are you sure you want to delete this cleaning entry?', () => {
        Data.deleteCleaningEntry(delClean.dataset.custId, delClean.dataset.deleteCleaning);
        UI.showToast('Cleaning entry deleted');
        navigate('#customer/' + delClean.dataset.custId);
      });
      return;
    }

    // Filter buttons
    const filterBtn = e.target.closest('[data-filter]');
    if (filterBtn) {
      currentFilter = filterBtn.dataset.filter;
      refreshCustomerList();
      return;
    }

    // Sort buttons
    const sortBtn = e.target.closest('[data-sort]');
    if (sortBtn) {
      currentSort = sortBtn.dataset.sort;
      refreshCustomerList();
      return;
    }

    // Admin actions — add
    const adminAdd = e.target.closest('[data-admin-add]');
    if (adminAdd) {
      const key = adminAdd.dataset.adminAdd;
      const input = document.getElementById('new-' + key);
      if (input && input.value.trim()) {
        Data.addAdminItem(key, input.value.trim());
        UI.showToast('Item added!');
        navigate('#admin');
      }
      return;
    }

    // Admin actions — delete
    const adminDelete = e.target.closest('[data-admin-delete]');
    if (adminDelete) {
      UI.showConfirmModal('Delete Item', `Delete "${adminDelete.dataset.value}" from the list?`, () => {
        Data.deleteAdminItem(adminDelete.dataset.adminDelete, adminDelete.dataset.value);
        UI.showToast('Item deleted');
        navigate('#admin');
      });
      return;
    }

    // Admin actions — edit
    const adminEdit = e.target.closest('[data-admin-edit]');
    if (adminEdit) {
      const key = adminEdit.dataset.adminEdit;
      const oldVal = adminEdit.dataset.value;
      UI.showModal('Edit Item', `
        <div class="form-group">
          <label for="admin-edit-val">Name</label>
          <input type="text" id="admin-edit-val" value="${UI._escHtml(oldVal)}">
        </div>`, () => {
          const newVal = document.getElementById('admin-edit-val').value.trim();
          if (newVal) {
            Data.updateAdminItem(key, oldVal, newVal);
            UI.showToast('Item updated!');
            navigate('#admin');
          }
        });
      return;
    }

    // Delete customer
    const delCust = e.target.closest('#btn-delete-customer');
    if (delCust) {
      UI.showConfirmModal('Delete Customer', 'Are you sure? This will permanently delete this customer and all their service records.', () => {
        Data.deleteCustomer(delCust.dataset.customerId);
        UI.showToast('Customer deleted');
        navigate('#customers');
      });
      return;
    }
  }

  /* -------- Customer List Bindings -------- */
  function bindCustomerListEvents() {
    const searchInput = document.getElementById('customer-search');
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          currentSearch = e.target.value;
          refreshCustomerList();
        }, 300);
      });
    }
  }

  function refreshCustomerList() {
    const content = document.getElementById('app-content');
    content.innerHTML = UI.renderCustomersList(currentSearch, currentFilter, currentSort);
    bindCustomerListEvents();
    const searchInput = document.getElementById('customer-search');
    if (searchInput && currentSearch) {
      searchInput.focus();
      searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    }
  }

  /* -------- Customer Form Bindings -------- */
  function bindCustomerFormEvents() {
    const form = document.getElementById('customer-form');
    const installDateInput = document.getElementById('cust-installDate');

    if (installDateInput) {
      installDateInput.addEventListener('change', () => {
        const preview = document.getElementById('service-preview');
        const grid = document.getElementById('preview-grid');
        if (installDateInput.value) {
          grid.innerHTML = UI._renderServicePreview(installDateInput.value);
          preview.style.display = '';
        } else {
          preview.style.display = 'none';
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('cust-id').value;
        const data = {
          name: document.getElementById('cust-name').value.trim(),
          mobile: document.getElementById('cust-mobile').value.trim(),
          address: document.getElementById('cust-address').value.trim(),
          installDate: document.getElementById('cust-installDate').value,
          kw: parseFloat(document.getElementById('cust-kw').value) || null,
          numPanels: parseInt(document.getElementById('cust-numPanels').value) || null,
          panelCompany: document.getElementById('cust-panelCompany').value.trim(),
          inverterBrand: document.getElementById('cust-inverterBrand').value.trim(),
          panelWarranty: parseInt(document.getElementById('cust-panelWarranty').value) || null,
          inverterWarranty: parseInt(document.getElementById('cust-inverterWarranty').value) || null,
        };

        if (id) {
          Data.updateCustomer(id, data);
          UI.showToast('Customer updated!');
          navigate('#customer/' + id);
        } else {
          const newCust = Data.addCustomer(data);
          UI.showToast('Customer added!');
          navigate('#customer/' + newCust.id);
        }
      });
    }
  }

  /* -------- Customer Detail Bindings -------- */
  function bindCustomerDetailEvents(custId) {
    // AMC toggle — directly update DOM, no page reload needed
    const amcToggle = document.getElementById('amc-toggle');
    if (amcToggle) {
      amcToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        Data.updateCustomer(custId, { amcEnabled: enabled });
        // Live toggle the AMC details section
        const amcDetails = document.getElementById('amc-details');
        const amcLabel = document.getElementById('amc-toggle-label');
        if (enabled) {
          amcDetails.style.display = '';
          if (amcLabel) amcLabel.textContent = 'AMC Active';
          UI.showToast('AMC enabled for this customer');
        } else {
          amcDetails.style.display = 'none';
          if (amcLabel) amcLabel.textContent = 'Enable AMC for this customer';
          UI.showToast('AMC disabled');
        }
      });
    }

    // Save AMC info
    const saveAmc = document.getElementById('save-amc-info');
    if (saveAmc) {
      saveAmc.addEventListener('click', () => {
        Data.updateCustomer(custId, {
          amcStartDate: document.getElementById('amc-start').value,
          amcEndDate: document.getElementById('amc-end').value,
          amcFrequency: document.getElementById('amc-frequency').value
        });
        UI.showToast('AMC info saved!');
      });
    }

    // Add cleaning entry
    const addClean = document.getElementById('add-cleaning-entry');
    if (addClean) {
      addClean.addEventListener('click', () => {
        UI.cleaningEntryModal(custId, null);
      });
    }
  }

  /* -------- Admin Bindings -------- */
  function bindAdminEvents() {
    // Fix: Explicit click handlers for admin add buttons
    document.querySelectorAll('.admin-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.dataset.adminAdd;
        const input = document.getElementById('new-' + key);
        if (input && input.value.trim()) {
          Data.addAdminItem(key, input.value.trim());
          UI.showToast('Item added!');
          navigate('#admin');
        }
      });
    });

    // Export
    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const json = Data.exportData();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'genius-solar-backup-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
        UI.showToast('Data exported!');
      });
    }

    // Import
    const importInput = document.getElementById('btn-import');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const ok = Data.importData(ev.target.result);
          if (ok) {
            UI.showToast('Data imported successfully!');
            navigate('#dashboard');
          } else {
            UI.showToast('Import failed. Check file format.', 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    // Clear data
    const clearBtn = document.getElementById('btn-clear-data');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        UI.showConfirmModal('Clear All Data', 'This will permanently delete ALL customers, services, and settings. This action cannot be undone!', () => {
          Data.clearAllData();
          UI.showToast('All data cleared');
          navigate('#dashboard');
        });
      });
    }

    // Enter key on admin inputs
    document.querySelectorAll('[id^="new-"]').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const key = input.id.replace('new-', '');
          if (input.value.trim()) {
            Data.addAdminItem(key, input.value.trim());
            UI.showToast('Item added!');
            navigate('#admin');
          }
        }
      });
    });
  }

  return { init, navigate, refreshCurrentPage };
})();

// Boot
document.addEventListener('DOMContentLoaded', App.init);
