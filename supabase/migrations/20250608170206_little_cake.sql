/*
  # Fix Admin RLS Policies and Authentication Issues

  1. Functions
    - Create `is_admin` function to check admin status
    - Add proper permissions for the function

  2. RLS Policy Updates
    - Update existing policies to allow admin access
    - Add new admin-specific policies where needed
    - Handle existing policy conflicts

  3. Schema Updates
    - Add `is_admin` column if it doesn't exist
    - Set up admin user for testing

  4. Security
    - Maintain existing security while adding admin capabilities
    - Ensure proper access controls
*/

-- Create function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = user_id AND is_admin = true
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO service_role;

-- Add is_admin column to user_profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Update user_profiles policies to allow admin access
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

-- Add admin policy for user management (drop first if exists)
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
CREATE POLICY "Admins can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Update reviews policies to allow admin access
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
CREATE POLICY "Users can delete own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Add admin policy for review management (drop first if exists)
DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;
CREATE POLICY "Admins can manage all reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Add admin policy for location management (drop first if exists)
DROP POLICY IF EXISTS "Admins can manage all locations" ON locations;
CREATE POLICY "Admins can manage all locations"
  ON locations
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Add admin policy for badge management (drop first if exists)
DROP POLICY IF EXISTS "Admins can manage all badges" ON nft_badges;
CREATE POLICY "Admins can manage all badges"
  ON nft_badges
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Handle the existing public read policy for locations
DO $$
BEGIN
  -- Check if the policy already exists and drop it if it does
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'locations' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    DROP POLICY "Enable read access for all users" ON locations;
  END IF;
  
  -- Recreate the policy
  CREATE POLICY "Enable read access for all users"
    ON locations
    FOR SELECT
    TO public
    USING (true);
END $$;

-- Create an admin user for testing (update the email to match your admin account)
DO $$
BEGIN
  -- Update existing user to be admin (replace with actual admin email)
  UPDATE user_profiles 
  SET is_admin = true 
  WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email = 'admin@example.com'
  );
  
  -- If no rows were updated, it means the admin user doesn't exist yet
  -- This is fine - they can be set as admin later
END $$;

-- Refresh the schema cache to ensure all changes are applied
NOTIFY pgrst, 'reload schema';