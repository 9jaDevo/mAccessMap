/*
  # Create mAccessMap Database Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `reputation_score` (integer, default 0)
      - `total_reviews` (integer, default 0)
      - `badges_earned` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `locations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `category` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `overall_rating` (decimal, default 0)
      - `total_reviews` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `location_id` (uuid, references locations)
      - `rating` (integer, 1-5)
      - `accessibility_features` (jsonb)
      - `photos` (text array)
      - `comments` (text)
      - `is_verified` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `nft_badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `badge_type` (text)
      - `token_id` (text)
      - `contract_address` (text)
      - `metadata_uri` (text)
      - `transaction_hash` (text)
      - `minted_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to locations and reviews
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  reputation_score integer DEFAULT 0,
  total_reviews integer DEFAULT 0,
  badges_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  category text NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  overall_rating decimal(3, 2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  accessibility_features jsonb DEFAULT '[]'::jsonb,
  photos text[] DEFAULT '{}',
  comments text DEFAULT '',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create nft_badges table
CREATE TABLE IF NOT EXISTS nft_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_type text NOT NULL,
  token_id text,
  contract_address text,
  metadata_uri text,
  transaction_hash text,
  minted_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_badges ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for locations
CREATE POLICY "Anyone can read locations"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create locations"
  ON locations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update locations"
  ON locations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for reviews
CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for nft_badges
CREATE POLICY "Users can read all badges"
  ON nft_badges
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own badges"
  ON nft_badges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_reviews_location_id ON reviews(location_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nft_badges_user_id ON nft_badges(user_id);

-- Create function to update location rating when reviews are added/updated
CREATE OR REPLACE FUNCTION update_location_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE locations 
  SET 
    overall_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews 
      WHERE location_id = COALESCE(NEW.location_id, OLD.location_id)
      AND is_verified = true
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews 
      WHERE location_id = COALESCE(NEW.location_id, OLD.location_id)
      AND is_verified = true
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.location_id, OLD.location_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update location ratings
DROP TRIGGER IF EXISTS trigger_update_location_rating ON reviews;
CREATE TRIGGER trigger_update_location_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_location_rating();

-- Create function to update user profile stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
      AND is_verified = true
    ),
    reputation_score = (
      SELECT COUNT(*) * 10
      FROM reviews 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
      AND is_verified = true
    ),
    badges_earned = (
      SELECT COUNT(*)
      FROM nft_badges 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update user stats
DROP TRIGGER IF EXISTS trigger_update_user_stats_reviews ON reviews;
CREATE TRIGGER trigger_update_user_stats_reviews
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

DROP TRIGGER IF EXISTS trigger_update_user_stats_badges ON nft_badges;
CREATE TRIGGER trigger_update_user_stats_badges
  AFTER INSERT OR DELETE ON nft_badges
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous User'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();