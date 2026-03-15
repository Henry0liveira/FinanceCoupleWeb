"use client";

import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase";
import type { Transaction } from "./types";

export function usePartnerNotifications(coupleId: string | null | undefined, userId: string | null | undefined) {
  const [notification, setNotification] = useState<string | null>(null);
  const lastSeenId = useRef<string | null>(null);

  useEffect(() => {
    if (!coupleId || !userId) return;

    const q = query(
      collection(db, "transactions"),
      where("coupleId", "==", coupleId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Transaction[];
      items.sort((a, b) => {
        const aCreated = (a as { createdAt?: { toDate?: () => Date } }).createdAt;
        const bCreated = (b as { createdAt?: { toDate?: () => Date } }).createdAt;
        const aTime = aCreated?.toDate ? aCreated.toDate().getTime() : Number(new Date(a.date));
        const bTime = bCreated?.toDate ? bCreated.toDate().getTime() : Number(new Date(b.date));
        return bTime - aTime;
      });
      const latest = items[0];
      if (!latest) return;
      if (lastSeenId.current && latest.id !== lastSeenId.current && latest.createdBy !== userId) {
        setNotification(`${latest.description} foi adicionada pelo seu parceiro.`);
      }
      lastSeenId.current = latest.id;
    });

    return () => unsub();
  }, [coupleId, userId]);

  return { notification, clear: () => setNotification(null) };
}
