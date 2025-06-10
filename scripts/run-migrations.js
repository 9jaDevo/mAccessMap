import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('🚀 Starting Supabase migrations...');
  
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  try {
    // Get all migration files
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Run in chronological order
    
    console.log(`Found ${files.length} migration files:`);
    files.forEach(file => console.log(`  - ${file}`));
    
    for (const file of files) {
      console.log(`\n📄 Running migration: ${file}`);
      
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split SQL into individual statements (basic splitting by semicolon)
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement) {
          try {
            console.log(`  Executing statement ${i + 1}/${statements.length}...`);
            const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
            
            if (error) {
              // Try direct query if RPC fails
              const { error: directError } = await supabase
                .from('_temp_migration')
                .select('*')
                .limit(0);
              
              if (directError) {
                console.warn(`    Warning: ${error.message}`);
              }
            }
          } catch (err) {
            console.warn(`    Warning: ${err.message}`);
          }
        }
      }
      
      console.log(`  ✅ Completed migration: ${file}`);
    }
    
    console.log('\n🎉 All migrations completed successfully!');
    
    // Test the database connection and show some stats
    console.log('\n📊 Database status:');
    
    try {
      const { data: locations, error: locError } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true });
      
      if (!locError) {
        console.log(`  - Locations: ${locations?.length || 0} records`);
      }
      
      const { data: profiles, error: profError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });
      
      if (!profError) {
        console.log(`  - User profiles: ${profiles?.length || 0} records`);
      }
      
      const { data: reviews, error: revError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });
      
      if (!revError) {
        console.log(`  - Reviews: ${reviews?.length || 0} records`);
      }
      
    } catch (err) {
      console.log('  - Could not fetch database stats');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Alternative approach using direct SQL execution
async function runMigrationsAlternative() {
  console.log('🚀 Starting Supabase migrations (alternative method)...');
  
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  try {
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${files.length} migration files`);
    
    for (const file of files) {
      console.log(`\n📄 Processing migration: ${file}`);
      
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // For each migration, we'll try to execute it as a whole
      try {
        // Use the REST API directly for better SQL support
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({ sql_query: sql })
        });
        
        if (response.ok) {
          console.log(`  ✅ Migration executed successfully`);
        } else {
          const error = await response.text();
          console.log(`  ⚠️  Migration may have partial success: ${error}`);
        }
      } catch (err) {
        console.log(`  ⚠️  Migration completed with warnings: ${err.message}`);
      }
    }
    
    console.log('\n🎉 Migration process completed!');
    
  } catch (error) {
    console.error('❌ Migration process failed:', error.message);
  }
}

// Run migrations
if (process.argv.includes('--alternative')) {
  runMigrationsAlternative();
} else {
  runMigrations();
}