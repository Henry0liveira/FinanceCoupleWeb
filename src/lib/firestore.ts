"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
  where
} from "firebase/firestore";
import { db } from "./firebase";
import type { Couple, Goal, Transaction, UserProfile } from "./types";

export async function createCouple(userId: string, name: string) {
  const ref = await addDoc(collection(db, "couples"), {
    name,
    members: [userId]
  });
  await updateDoc(doc(db, "users", userId), { coupleId: ref.id });
  return ref.id;
}

export async function joinCouple(userId: string, coupleId: string) {
  const ref = doc(db, "couples", coupleId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Casal não encontrado.");
  const data = snap.data() as Couple;
  if (data.members.length >= 2 && !data.members.includes(userId)) {
    throw new Error("O casal já possui dois membros.");
  }
  const members = data.members.includes(userId) ? data.members : [...data.members, userId];
  await updateDoc(ref, { members });
  await updateDoc(doc(db, "users", userId), { coupleId });
}

export async function addTransaction(payload: Omit<Transaction, "id" | "createdAt">) {
  await addDoc(collection(db, "transactions"), {
    ...payload,
    createdAt: serverTimestamp()
  });
}

export async function addGoal(payload: Omit<Goal, "id">) {
  await addDoc(collection(db, "goals"), payload);
}

export async function contributeToGoal(
  goalId: string,
  amount: number,
  meta?: { coupleId: string; userId: string; ownerId?: string; goalName: string; date?: string }
) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  const batch = writeBatch(db);
  batch.update(doc(db, "goals", goalId), { currentAmount: increment(amount) });
  if (meta?.coupleId && meta.userId) {
    const txRef = doc(collection(db, "transactions"));
    batch.set(txRef, {
      coupleId: meta.coupleId,
      description: `Contribuição: ${meta.goalName}`,
      amount,
      category: "Metas",
      type: "expense",
      createdBy: meta.userId,
      ownerId: meta.ownerId ?? meta.userId,
      date: meta.date ?? new Date().toISOString().slice(0, 10),
      createdAt: serverTimestamp()
    });
  }
  await batch.commit();
}

export async function fetchCoupleTransactions(coupleId: string) {
  const snap = await getDocs(query(collection(db, "transactions"), where("coupleId", "==", coupleId)));
  const items = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Transaction[];
  items.sort((a, b) => {
    const aCreated = (a as { createdAt?: { toDate?: () => Date } }).createdAt;
    const bCreated = (b as { createdAt?: { toDate?: () => Date } }).createdAt;
    const aTime = aCreated?.toDate ? aCreated.toDate().getTime() : Number(new Date(a.date));
    const bTime = bCreated?.toDate ? bCreated.toDate().getTime() : Number(new Date(b.date));
    return bTime - aTime;
  });
  return items;
}

export async function fetchGoals(coupleId: string) {
  const snap = await getDocs(query(collection(db, "goals"), where("coupleId", "==", coupleId)));
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Goal[];
}

export async function fetchCoupleUsers(coupleId: string) {
  const snap = await getDocs(query(collection(db, "users"), where("coupleId", "==", coupleId)));
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as UserProfile[];
}
