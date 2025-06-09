/*
  # Insert Sample Data for mAccessMap

  1. Sample Locations
    - Various types of public spaces with different accessibility levels
    - Restaurants, libraries, transit stations, parks, etc.

  2. Sample Reviews
    - Reviews from different users with various accessibility features
    - Mix of ratings to demonstrate the system

  3. Sample NFT Badges
    - Example badges for demonstration purposes
*/

-- Insert sample locations
INSERT INTO locations (id, name, address, category, latitude, longitude, overall_rating, total_reviews) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Central Park Cafe', '123 Park Ave, New York, NY 10016', 'restaurant', 40.7829, -73.9654, 4.5, 23),
  ('550e8400-e29b-41d4-a716-446655440002', 'Downtown Public Library', '456 Main St, New York, NY 10001', 'public-service', 40.7614, -73.9776, 4.8, 45),
  ('550e8400-e29b-41d4-a716-446655440003', 'Metro Station - 42nd St', '42nd St & Broadway, New York, NY 10036', 'transportation', 40.7580, -73.9855, 3.2, 67),
  ('550e8400-e29b-41d4-a716-446655440004', 'Riverside Park', '475 Riverside Dr, New York, NY 10115', 'recreation', 40.8022, -73.9619, 4.1, 34),
  ('550e8400-e29b-41d4-a716-446655440005', 'City Hall', '1 City Hall Park, New York, NY 10007', 'public-service', 40.7127, -74.0059, 3.8, 28),
  ('550e8400-e29b-41d4-a716-446655440006', 'Accessibility Medical Center', '789 Health St, New York, NY 10002', 'healthcare', 40.7505, -73.9934, 4.9, 52),
  ('550e8400-e29b-41d4-a716-446655440007', 'Universal Design Store', '321 Shopping Ave, New York, NY 10003', 'retail', 40.7282, -73.9942, 4.3, 19),
  ('550e8400-e29b-41d4-a716-446655440008', 'Inclusive Theater', '654 Arts Blvd, New York, NY 10019', 'entertainment', 40.7589, -73.9851, 4.6, 41);

-- Note: Sample reviews and badges will be created when users actually use the application
-- This ensures proper foreign key relationships with actual user accounts