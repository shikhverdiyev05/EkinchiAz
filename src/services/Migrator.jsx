import { useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { DEFAULT_CATEGORIES, DEFAULT_REGIONS } from './apiService';

export default function Migrator() {
  useEffect(() => {
    async function migrate() {
      console.log('Starting migration...');
      
      try {
        // Upload categories
        for (const cat of DEFAULT_CATEGORIES) {
          const docRef = doc(db, 'categories', cat.id);
          await setDoc(docRef, cat);
          console.log(`Migrated category: ${cat.name}`);
        }
        
        // Upload regions
        for (let i = 0; i < DEFAULT_REGIONS.length; i++) {
          const r = DEFAULT_REGIONS[i];
          const docId = typeof r === 'string' ? r.toLowerCase().replace(/[^a-z0-9]/g, '-') : r.id;
          const docRef = doc(db, 'regions', docId);
          await setDoc(docRef, typeof r === 'string' ? { name: r } : r);
          console.log(`Migrated region: ${typeof r === 'string' ? r : r.name}`);
        }

        console.log('✅ MIGRATION COMPLETE');
      } catch (err) {
        console.error('Migration failed:', err);
      }
    }
    migrate();
  }, []);

  return <div style={{padding: 20, background: 'red', color: 'white'}}>MIGRATING DATA TO FIRESTORE... CHECK CONSOLE.</div>;
}
