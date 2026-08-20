import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  Query,
  QueryConstraint,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import * as Types from "@/types";

// Generic CRUD operations
export const firebaseService = {
  // Create
  async create<T>(collectionName: string, data: Partial<T>) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  },

  // Read single
  async get<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  },

  // Read multiple
  async getMany<T>(
    collectionName: string,
    constraints?: QueryConstraint[]
  ): Promise<T[]> {
    try {
      let q: Query = collection(db, collectionName);
      if (constraints && constraints.length > 0) {
        q = query(collection(db, collectionName), ...constraints);
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error("Error getting documents:", error);
      throw error;
    }
  },

  // Update
  async update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  },

  // Delete
  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  // Batch operations
  async setMultiple<T>(
    collectionName: string,
    data: Array<{ id: string; data: Partial<T> }>
  ): Promise<void> {
    try {
      for (const item of data) {
        const docRef = doc(db, collectionName, item.id);
        await setDoc(docRef, {
          ...item.data,
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error("Error setting multiple documents:", error);
      throw error;
    }
  },
};

// Specialized collection services
export const bannerService = {
  async getAll() {
    return firebaseService.getMany<Types.Banner>("banners", [
      where("active", "==", true),
    ]);
  },

  async getById(id: string) {
    return firebaseService.get<Types.Banner>("banners", id);
  },

  async create(data: Omit<Types.Banner, "id" | "createdAt" | "updatedAt">) {
    return firebaseService.create<Types.Banner>("banners", data);
  },

  async update(id: string, data: Partial<Types.Banner>) {
    return firebaseService.update<Types.Banner>("banners", id, data);
  },

  async delete(id: string) {
    return firebaseService.delete("banners", id);
  },
};

export const tourService = {
  async getAll(onlyActive = true) {
    const constraints: QueryConstraint[] = [orderBy("name", "asc")];
    if (onlyActive) constraints.push(where("active", "==", true));
    return firebaseService.getMany<Types.Tour>("tours", constraints);
  },

  async getById(id: string) {
    return firebaseService.get<Types.Tour>("tours", id);
  },

  async getFeatured() {
    return firebaseService.getMany<Types.Tour>("tours", [
      where("active", "==", true),
      where("featured", "==", true),
      orderBy("name", "asc"),
    ]);
  },

  async create(data: Omit<Types.Tour, "id" | "createdAt" | "updatedAt">) {
    return firebaseService.create<Types.Tour>("tours", data);
  },

  async update(id: string, data: Partial<Types.Tour>) {
    return firebaseService.update<Types.Tour>("tours", id, data);
  },

  async delete(id: string) {
    return firebaseService.delete("tours", id);
  },
};

export const transferService = {
  async getAll(onlyActive = true) {
    const constraints: QueryConstraint[] = [orderBy("name", "asc")];
    if (onlyActive) constraints.push(where("active", "==", true));
    return firebaseService.getMany<Types.Transfer>("transfers", constraints);
  },

  async getById(id: string) {
    return firebaseService.get<Types.Transfer>("transfers", id);
  },

  async create(
    data: Omit<Types.Transfer, "id" | "createdAt" | "updatedAt">
  ) {
    return firebaseService.create<Types.Transfer>("transfers", data);
  },

  async update(id: string, data: Partial<Types.Transfer>) {
    return firebaseService.update<Types.Transfer>("transfers", id, data);
  },

  async delete(id: string) {
    return firebaseService.delete("transfers", id);
  },
};

export const testimonialService = {
  async getAll() {
    return firebaseService.getMany<Types.Testimonial>("testimonials", [
      where("active", "==", true),
    ]);
  },

  async create(
    data: Omit<Types.Testimonial, "id" | "createdAt" | "updatedAt">
  ) {
    return firebaseService.create<Types.Testimonial>("testimonials", data);
  },

  async update(id: string, data: Partial<Types.Testimonial>) {
    return firebaseService.update<Types.Testimonial>("testimonials", id, data);
  },

  async delete(id: string) {
    return firebaseService.delete("testimonials", id);
  },
};

export const blogService = {
  async getAll(onlyPublished = true) {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
    if (onlyPublished) constraints.push(where("published", "==", true));
    return firebaseService.getMany<Types.BlogPost>("blog", constraints);
  },

  async getBySlug(slug: string) {
    const result = await firebaseService.getMany<Types.BlogPost>("blog", [
      where("slug", "==", slug),
    ]);
    return result[0] || null;
  },

  async create(data: Omit<Types.BlogPost, "id" | "createdAt" | "updatedAt">) {
    return firebaseService.create<Types.BlogPost>("blog", data);
  },

  async update(id: string, data: Partial<Types.BlogPost>) {
    return firebaseService.update<Types.BlogPost>("blog", id, data);
  },

  async delete(id: string) {
    return firebaseService.delete("blog", id);
  },
};

export const faqService = {
  async getAll() {
    return firebaseService.getMany<Types.FAQ>("faq", [
      where("active", "==", true),
      orderBy("order", "asc"),
    ]);
  },

  async create(data: Omit<Types.FAQ, "id" | "createdAt" | "updatedAt">) {
    return firebaseService.create<Types.FAQ>("faq", data);
  },

  async update(id: string, data: Partial<Types.FAQ>) {
    return firebaseService.update<Types.FAQ>("faq", id, data);
  },

  async delete(id: string) {
    return firebaseService.delete("faq", id);
  },
};

export const settingsService = {
  async get() {
    const settings = await firebaseService.getMany<Types.SiteSettings>(
      "settings"
    );
    return settings[0] || null;
  },

  async update(data: Partial<Types.SiteSettings>) {
    const settings = await this.get();
    if (settings) {
      return firebaseService.update<Types.SiteSettings>(
        "settings",
        settings.id,
        data
      );
    }
  },
};

export const activityLogService = {
  async log(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    changes?: Record<string, unknown>
  ) {
    return firebaseService.create<Types.ActivityLog>("activityLogs", {
      userId,
      action,
      entityType,
      entityId,
      changes,
      timestamp: new Date(),
    });
  },

  async getRecent(limit?: number) {
    const constraints: QueryConstraint[] = [orderBy("timestamp", "desc")];
    if (limit) constraints.push(limit as unknown as QueryConstraint);
    return firebaseService.getMany<Types.ActivityLog>(
      "activityLogs",
      constraints
    );
  },
};
