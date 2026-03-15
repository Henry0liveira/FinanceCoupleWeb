"use client";

import { useEffect, useRef, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";
import type { Transaction } from "./types";

export function usePartnerNotifications(coupleId: string | null | undefined, userId: string | null | undefined) {
  const [notification, setNotification] = useState<string | null>(null);
  const lastSeenId = useRef<string | null>(null);

  useEffect(() => {
    if (!coupleId || !userId) return;

    const q = query(
      collection(db, "transactions"),
      where("coupleId", "==", coupleId),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const latest = snapshot.docs[0];
      if (!latest) return;
      const tx = { id: latest.id, ...latest.data() } as Transaction;
      if (lastSeenId.current && tx.id !== lastSeenId.current && tx.createdBy !== userId) {
        setNotification(`${tx.description} foi adicionada pelo seu parceiro.`);
      }
      lastSeenId.current = tx.id;
    });

    return () => unsub();
  }, [coupleId, userId]);

  return { notification, clear: () => setNotification(null) };
}
