import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Função para gerar slugs amigáveis a partir de nomes
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
}

async function migrateTourSlugs() {
  console.log('Starting tour slug migration...');
  
  try {
    const toursRef = collection(db, 'tours');
    const toursSnapshot = await getDocs(toursRef);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const docSnapshot of toursSnapshot.docs) {
      const tourData = docSnapshot.data();
      const tourName = tourData.name;
      
      if (!tourName) {
        console.log(`Skipping tour ${docSnapshot.id} - no name found`);
        skippedCount++;
        continue;
      }

      const newSlug = generateSlug(tourName);
      const existingSlug = tourData.slug;

      // Apenas atualiza se o slug for diferente ou não existir
      if (!existingSlug || existingSlug !== newSlug) {
        try {
          await updateDoc(doc(db, 'tours', docSnapshot.id), {
            slug: newSlug,
            updatedAt: new Date(),
          });
          console.log(`✓ Updated slug for tour: "${tourName}" -> "${newSlug}"`);
          updatedCount++;
        } catch (error) {
          console.error(`✗ Error updating tour ${tourName}:`, error);
          errorCount++;
        }
      } else {
        console.log(`✓ Slug already correct for tour: "${tourName}"`);
        skippedCount++;
      }
    }

    console.log('\n✅ Tour slug migration completed!');
    console.log(`   Updated: ${updatedCount} tours`);
    console.log(`   Skipped: ${skippedCount} tours`);
    console.log(`   Errors: ${errorCount} tours`);
  } catch (error) {
    console.error('Error migrating tour slugs:', error);
    throw error;
  }
}

async function migrateTransferSlugs() {
  console.log('\nStarting transfer slug migration...');
  
  try {
    const transfersRef = collection(db, 'transfers');
    const transfersSnapshot = await getDocs(transfersRef);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const docSnapshot of transfersSnapshot.docs) {
      const transferData = docSnapshot.data();
      const transferName = transferData.name;
      
      if (!transferName) {
        console.log(`Skipping transfer ${docSnapshot.id} - no name found`);
        skippedCount++;
        continue;
      }

      const newSlug = generateSlug(transferName);
      const existingSlug = transferData.slug;

      // Apenas atualiza se o slug for diferente ou não existir
      if (!existingSlug || existingSlug !== newSlug) {
        try {
          await updateDoc(doc(db, 'transfers', docSnapshot.id), {
            slug: newSlug,
            updatedAt: new Date(),
          });
          console.log(`✓ Updated slug for transfer: "${transferName}" -> "${newSlug}"`);
          updatedCount++;
        } catch (error) {
          console.error(`✗ Error updating transfer ${transferName}:`, error);
          errorCount++;
        }
      } else {
        console.log(`✓ Slug already correct for transfer: "${transferName}"`);
        skippedCount++;
      }
    }

    console.log('\n✅ Transfer slug migration completed!');
    console.log(`   Updated: ${updatedCount} transfers`);
    console.log(`   Skipped: ${skippedCount} transfers`);
    console.log(`   Errors: ${errorCount} transfers`);
  } catch (error) {
    console.error('Error migrating transfer slugs:', error);
    throw error;
  }
}

async function main() {
  try {
    await migrateTourSlugs();
    await migrateTransferSlugs();
    console.log('\n🎉 All slug migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
main();
