import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs,
  query, orderBy, serverTimestamp, limit
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

let app, auth, db, storage;
if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { auth, db, storage, isFirebaseConfigured, onAuthStateChanged, signOut };

export async function registerUser({ name, email, password, university, career }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await setDoc(doc(db, "users", credential.user.uid), {
    uid: credential.user.uid, name, email, university, career,
    role: "user", createdAt: serverTimestamp()
  });
  return credential.user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function getUserProfile(uid) {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function listDocuments() {
  const snapshot = await getDocs(query(collection(db, "documents"), orderBy("createdAt", "desc"), limit(200)));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

export async function uploadDocument({ file, title, subject, university, career, type, description, user }) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `documents/${user.uid}/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, storagePath);
  await uploadBytes(fileRef, file, { contentType: file.type || "application/octet-stream" });
  const downloadURL = await getDownloadURL(fileRef);
  const record = {
    title, subject, university, career, type, description,
    fileName: file.name, fileSize: file.size, contentType: file.type,
    storagePath, downloadURL, ownerUid: user.uid,
    ownerName: user.displayName || user.email, status: "pending",
    createdAt: serverTimestamp()
  };
  const created = await addDoc(collection(db, "documents"), record);
  return { id: created.id, ...record };
}

export async function moderateDocument(id, status) {
  // La moderación se valida también en Firestore Rules; no confíes solo en ocultar botones.
  const { updateDoc } = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js");
  await updateDoc(doc(db, "documents", id), { status, moderatedAt: serverTimestamp() });
}
