import { useSyncExternalStore } from "react";

// สถานะ "อ่านแล้ว" ของประกาศ เก็บไว้ในเบราว์เซอร์นี้
// ใช้ร่วมกันระหว่างกระดิ่งแจ้งเตือนบนหัวหน้าและหน้าประกาศ จึงอัปเดตพร้อมกัน
const READ_KEY = "faceattend_read_announcements";

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_KEY)) || []);
  } catch {
    return new Set();
  }
}

let readIds = load();
const listeners = new Set();

function emit(next) {
  readIds = next;
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...next]));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

export function markRead(...ids) {
  if (ids.every((id) => readIds.has(id))) return;
  const next = new Set(readIds);
  ids.forEach((id) => next.add(id));
  emit(next);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useReadIds() {
  return useSyncExternalStore(subscribe, () => readIds);
}
