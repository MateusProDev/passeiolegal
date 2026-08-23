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

export type EntityInput<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

interface EntityServiceOptions {
  /** Constraints applied to every listing, e.g. a default ordering. */
  baseConstraints?: QueryConstraint[];
  /** Boolean field used by `getAll(true)` to return only visible documents. */
  visibilityField?: string;
}

/**
 * Builds the standard CRUD surface shared by every collection service.
 * Collections with extra queries spread the result and add their own methods.
 */
function createEntityService<T>(
  collectionName: string,
  { baseConstraints = [], visibilityField }: EntityServiceOptions = {}
) {
  return {
    async getAll(onlyVisible = false) {
      const constraints = [...baseConstraints];
      if (onlyVisible && visibilityField) {
        constraints.push(where(visibilityField, "==", true));
      }
      return firebaseService.getMany<T>(collectionName, constraints);
    },

    async getById(id: string) {
      return firebaseService.get<T>(collectionName, id);
    },

    async create(data: EntityInput<T>) {
      return firebaseService.create<T>(collectionName, data as Partial<T>);
    },

    async update(id: string, data: Partial<T>) {
      return firebaseService.update<T>(collectionName, id, data);
    },

    async delete(id: string) {
      return firebaseService.delete(collectionName, id);
    },
  };
}

// Specialized collection services
export const bannerService = createEntityService<Types.Banner>("banners", {
  baseConstraints: [where("active", "==", true)],
});

export const tourService = {
  ...createEntityService<Types.Tour>("tours", {
    baseConstraints: [orderBy("name", "asc")],
    visibilityField: "active",
  }),

  async getFeatured() {
    return firebaseService.getMany<Types.Tour>("tours", [
      where("active", "==", true),
      where("featured", "==", true),
      orderBy("name", "asc"),
    ]);
  },

  // Busca tours relacionados para recomendação (mesma categoria ou featured, excluindo o atual)
  async getRelated(excludeId: string, limit: number = 3) {
    try {
      const allTours = await firebaseService.getMany<Types.Tour>("tours", [
        where("active", "==", true),
        where("id", "!=", excludeId),
        orderBy("featured", "desc"),
        orderBy("name", "asc"),
      ]);
      return allTours.slice(0, limit);
    } catch (error) {
      console.error("Error fetching related tours:", error);
      return [];
    }
  },
};

export const transferService = createEntityService<Types.Transfer>(
  "transfers",
  {
    baseConstraints: [orderBy("name", "asc")],
    visibilityField: "active",
  }
);

export const testimonialService =
  createEntityService<Types.Testimonial>("testimonials");

export const blogService = {
  ...createEntityService<Types.BlogPost>("blog", {
    baseConstraints: [orderBy("createdAt", "desc")],
    visibilityField: "published",
  }),

  async getBySlug(slug: string) {
    const result = await firebaseService.getMany<Types.BlogPost>("blog", [
      where("slug", "==", slug),
    ]);
    return result[0] || null;
  },
};

export const faqService = createEntityService<Types.FAQ>("faq");

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
    } else {
      // Create settings if they don't exist
      return firebaseService.create<Types.SiteSettings>("settings", data as Types.SiteSettings);
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
