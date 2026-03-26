/* ======================================================
   Genius Solar CMS — Firebase Sync Layer
   ======================================================

   🔧 SETUP:
   ─────────────────────────────────────────────────────
   1. Copy js/env.example.js → js/env.js
   2. Fill in your Firebase config in env.js
   3. Create a Realtime Database in Firebase Console
      (Build → Realtime Database → Create → TEST mode)
   4. The env.js file is gitignored — your keys stay safe!
   ─────────────────────────────────────────────────────  */

const FirebaseSync = (() => {

  // Read config from env.js (loaded before this script)
  const firebaseConfig = window.FIREBASE_CONFIG || {};

  let db = null;
  let ready = false;
  let syncTimeout = null;
  let lastLocalSave = 0;

  function init() {
    // Skip if config is not filled in
    if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
      console.log('%c☁️ Firebase not configured — using localStorage only.', 'color:#f59e0b;font-weight:600');
      console.log('   Copy js/env.example.js → js/env.js and add your Firebase credentials.');
      _updateSyncStatus('local');
      return;
    }

    try {
      firebase.initializeApp(firebaseConfig);
      db = firebase.database();
      ready = true;

      // Pull initial data from cloud
      pull();

      // Real-time listener for multi-device sync
      db.ref('solarCMS').on('value', (snap) => {
        // Ignore echoes of our own writes (within 3 seconds)
        if (Date.now() - lastLocalSave < 3000) return;
        const data = snap.val();
        if (data) {
          localStorage.setItem('solarCMS', JSON.stringify(data));
          // Refresh the current page to reflect changes
          if (window.App && App.refreshCurrentPage) {
            App.refreshCurrentPage();
          }
        }
      });

      _updateSyncStatus('connected');
      console.log('%c☁️ Firebase connected — data will sync to cloud.', 'color:#22c55e;font-weight:600');
    } catch (e) {
      console.error('Firebase init failed:', e);
      _updateSyncStatus('error');
    }
  }

  function save(data) {
    if (!ready) return;
    lastLocalSave = Date.now();

    // Debounce writes (wait 800ms after last change)
    if (syncTimeout) clearTimeout(syncTimeout);
    _updateSyncStatus('syncing');

    syncTimeout = setTimeout(() => {
      db.ref('solarCMS').set(data)
        .then(() => _updateSyncStatus('connected'))
        .catch((e) => {
          console.warn('Firebase sync failed:', e);
          _updateSyncStatus('error');
        });
    }, 800);
  }

  function pull() {
    if (!ready) return;
    db.ref('solarCMS').once('value')
      .then((snap) => {
        const cloudData = snap.val();
        if (cloudData && cloudData.customers && cloudData.customers.length > 0) {
          // Cloud has data → use it (cloud wins)
          localStorage.setItem('solarCMS', JSON.stringify(cloudData));
          if (window.App && App.refreshCurrentPage) {
            App.refreshCurrentPage();
          }
          _updateSyncStatus('connected');
        } else {
          // Cloud is empty → push local data UP to Firebase
          try {
            const localRaw = localStorage.getItem('solarCMS');
            if (localRaw) {
              const localData = JSON.parse(localRaw);
              if (localData && localData.customers && localData.customers.length > 0) {
                console.log('%c☁️ Cloud is empty — pushing local data to Firebase...', 'color:#f59e0b;font-weight:600');
                db.ref('solarCMS').set(localData)
                  .then(() => {
                    console.log('%c☁️ Local data pushed to cloud!', 'color:#22c55e;font-weight:600');
                    _updateSyncStatus('connected');
                  })
                  .catch((e) => {
                    console.warn('Failed to push local data:', e);
                    _updateSyncStatus('error');
                  });
              }
            }
          } catch (e) { /* ignore parse errors */ }
          _updateSyncStatus('connected');
        }
      })
      .catch((e) => {
        console.warn('Firebase pull failed:', e);
        _updateSyncStatus('error');
      });
  }

  function isReady() { return ready; }

  function _updateSyncStatus(status) {
    const el = document.getElementById('sync-status');
    if (!el) return;
    const states = {
      connected:    { text: '☁️ Synced',       color: '#22c55e' },
      syncing:      { text: '⟳ Syncing...',    color: '#f59e0b' },
      error:        { text: '⚠ Sync Error',    color: '#ef4444' },
      local:        { text: '💾 Local Only',    color: '#9ca3af' },
      disconnected: { text: '○ Offline',        color: '#9ca3af' }
    };
    const s = states[status] || states.disconnected;
    el.textContent = s.text;
    el.style.color = s.color;
  }

  return { init, save, pull, isReady };
})();
