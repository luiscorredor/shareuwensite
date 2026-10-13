import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, limit, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";
let app, auth, db, storage;
if (isFirebaseConfigured) { app=initializeApp(firebaseConfig); auth=getAuth(app); db=getFirestore(app); storage=getStorage(app); }
export {auth,db,storage,isFirebaseConfigured,onAuthStateChanged,signOut};
export async function registerUser({name,email,password,university,career}) {
 const c=await createUserWithEmailAndPassword(auth,email,password);
 await updateProfile(c.user,{displayName:name});
 await setDoc(doc(db,"users",c.user.uid),{uid:c.user.uid,name,email,university,career,role:"user",createdAt:serverTimestamp()});
 return c.user;
}
export async function loginUser(email,password){return (await signInWithEmailAndPassword(auth,email,password)).user;}
export async function getUserProfile(uid){const s=await getDoc(doc(db,"users",uid));return s.exists()?s.data():null;}
const mapDocs=s=>s.docs.map(x=>({id:x.id,...x.data()}));
export async function listApprovedDocuments(){return mapDocs(await getDocs(query(collection(db,"documents"),where("status","==","approved"),orderBy("createdAt","desc"),limit(200))));}
export async function listOwnDocuments(uid){return mapDocs(await getDocs(query(collection(db,"documents"),where("ownerUid","==",uid),orderBy("createdAt","desc"),limit(200))));}
export async function listPendingDocuments(){return mapDocs(await getDocs(query(collection(db,"documents"),where("status","==","pending"),orderBy("createdAt","desc"),limit(200))));}
export async function uploadDocument({file,title,subject,university,career,type,description,user}){
 const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_"),storagePath=`documents/${user.uid}/${Date.now()}-${safeName}`;
 await uploadBytes(ref(storage,storagePath),file,{contentType:file.type||"application/octet-stream"});
 const downloadURL=await getDownloadURL(ref(storage,storagePath));
 const record={title,subject,university,career,type,description,fileName:file.name,fileSize:file.size,contentType:file.type,storagePath,downloadURL,ownerUid:user.uid,ownerName:user.displayName||user.email,status:"pending",createdAt:serverTimestamp()};
 const created=await addDoc(collection(db,"documents"),record);return {id:created.id,...record};
}
export async function moderateDocument(id,status){if(!["approved","rejected"].includes(status))throw new Error("Invalid moderation status");await updateDoc(doc(db,"documents",id),{status,moderatedAt:serverTimestamp()});}
