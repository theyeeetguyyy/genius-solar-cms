/* ======================================================
   Genius Solar CMS — Firebase Sync (Realtime Database)
   ======================================================

   Firebase is the ONLY data store. No localStorage.
   Data flow:
     1. App starts → FirebaseSync.init() → fetches from Firebase → Data.setData() → render
     2. User action → Data._save() → FirebaseSync.save() → writes to Firebase
     3. Firebase listener → Data.setData() → re-render (multi-device sync)
   ──────────────────────────────────────────────────────  */

const FirebaseSync = (() => {

  // Read config from env.js (loaded before this script)
  const firebaseConfig = window.FIREBASE_CONFIG || {};

  let db = null;
  let ready = false;
  let syncTimeout = null;
  let lastLocalSave = 0;
  let initialLoadDone = false;

  function init() {
    if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
      console.error('❌ Firebase not configured! The app requires Firebase to work.');
      console.error('   Copy js/env.example.js → js/env.js and add your Firebase credentials.');
      _updateSyncStatus('error');
      _hideLoading();
      return;
    }

    try {
      firebase.initializeApp(firebaseConfig);
      db = firebase.database();
      ready = true;
      _updateSyncStatus('syncing');

      // Step 1: Check for old localStorage data to migrate
      const localData = Data.migrateFromLocalStorage();

      // Step 2: Fetch current data from Firebase
      db.ref('solarCMS').once('value')
        .then((snap) => {
          const cloudData = snap.val();

          if (cloudData && cloudData.customers && cloudData.customers.length > 0) {
            // Cloud has data → use it
            console.log('%c☁️ Loaded ' + cloudData.customers.length + ' customers from Firebase', 'color:#22c55e;font-weight:600');
            Data.setData(cloudData);
          } else if (localData && localData.customers && localData.customers.length > 0) {
            // Cloud is empty but we found old localStorage data → migrate it
            console.log('%c📦 Migrating ' + localData.customers.length + ' customers from localStorage to Firebase...', 'color:#f59e0b;font-weight:600');
            Data.setData(localData);
            db.ref('solarCMS').set(localData)
              .then(() => console.log('%c✅ Migration complete!', 'color:#22c55e;font-weight:600'))
              .catch((e) => console.warn('Migration write failed:', e));
          } else {
            // Both empty → first time, write defaults
            const defaults = Data.getRawData();
            db.ref('solarCMS').set(defaults);
          }

          initialLoadDone = true;
          _updateSyncStatus('connected');
          _hideLoading();

          // Render the page with data
          if (window.App && App.refreshCurrentPage) {
            App.refreshCurrentPage();
          }
        })
        .catch((e) => {
          console.error('Firebase initial load failed:', e);
          _updateSyncStatus('error');
          _hideLoading();
        });

      // Step 3: Real-time listener for multi-device sync
      db.ref('solarCMS').on('value', (snap) => {
        // Skip during initial load (we handle that above)
        if (!initialLoadDone) return;
        // Skip echoes of our own writes
        if (Date.now() - lastLocalSave < 3000) return;

        const data = snap.val();
        if (data) {
          console.log('%c🔄 Data updated from another device', 'color:#3b82f6;font-weight:600');
          Data.setData(data);
          if (window.App && App.refreshCurrentPage) {
            App.refreshCurrentPage();
          }
        }
      });

      console.log('%c☁️ Firebase connected', 'color:#22c55e;font-weight:600');
    } catch (e) {
      console.error('Firebase init failed:', e);
      _updateSyncStatus('error');
      _hideLoading();
    }
  }

  function save(data) {
    if (!ready) return;
    lastLocalSave = Date.now();

    // Debounce writes (wait 500ms after last change)
    if (syncTimeout) clearTimeout(syncTimeout);
    _updateSyncStatus('syncing');

    syncTimeout = setTimeout(() => {
      db.ref('solarCMS').set(data)
        .then(() => _updateSyncStatus('connected'))
        .catch((e) => {
          console.warn('Firebase write failed:', e);
          _updateSyncStatus('error');
        });
    }, 500);
  }

  function isReady() { return ready; }

  function _hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }
  }

  function _updateSyncStatus(status) {
    const el = document.getElementById('sync-status');
    if (!el) return;
    const states = {
      connected:    { text: '☁️ Synced',       color: '#22c55e' },
      syncing:      { text: '⟳ Syncing...',    color: '#f59e0b' },
      error:        { text: '⚠ Sync Error',    color: '#ef4444' },
      disconnected: { text: '○ Offline',        color: '#9ca3af' }
    };
    const s = states[status] || states.disconnected;
    el.textContent = s.text;
    el.style.color = s.color;
  }

  return { init, save, isReady };
})();
