// ponytail: minimal SW — click focuses/opens the app; FCM background handler is the single display path
// PASTE #2 (only if this file's Firebase values ever differ from the page's FIREBASE_CONFIG): keep in sync
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");
firebase.initializeApp({
  apiKey: "AIzaSyDuWLcDxQTFdEftIJZ8jRj2ts9DuMd9g_w",
  authDomain: "planner-e0497.firebaseapp.com",
  projectId: "planner-e0497",
  storageBucket: "planner-e0497.firebasestorage.app",
  messagingSenderId: "466606111954",
  appId: "1:466606111954:web:592094d2e4844c645ac10b"
});
// PASTE #3: exact live URL of the planner page (tap target + fallback)
const PLANNER_URL = "https://unknownshadow08.github.io/PLANNER/";
function plannerUrl(fallback) {
  if (fallback && !String(fallback).includes("PASTE")) return fallback;
  if (!PLANNER_URL.includes("PASTE")) return PLANNER_URL;
  return "./";
}
try {
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const n = (payload && payload.notification) || {};
    const d = (payload && payload.data) || {};
    return self.registration.showNotification(n.title || "Check Todays Plan", {
      body: n.body || "Tap to open your planner.",
      tag: "jee-daily",
      data: { url: plannerUrl(d.url) },
      requireInteraction: true
    });
  });
} catch (e) {}
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const u = (e.notification && e.notification.data && e.notification.data.url) || plannerUrl(null);
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        try {
          if (c.url === u && "focus" in c) return c.focus();
        } catch (err) {}
      }
      for (const c of list) if ("focus" in c) return c.focus();
      if (clients.openWindow) return clients.openWindow(u);
    })
  );
});

