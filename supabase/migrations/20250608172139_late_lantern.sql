/*
  # Badge Automation System

  1. Functions
    - Function to check badge eligibility based on verified reviews
    - Function to automatically process badge awards
    - Trigger to check badges after review verification

  2. Updates
    - Add trigger to automatically check for badge eligibility when reviews are verified
    - Update user stats calculation to be more accurate
*/

-- Function to check and award badges automatically
CREATE OR REPLACE FUNCTION public.check_and_award_badges(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_verified_reviews integer;
  badge_record record;
BEGIN
  -- Get the user's verified review count
  SELECT COUNT(*) INTO user_verified_reviews
  FROM reviews 
  WHERE user_id = target_user_id AND is_verified = true;

  -- Check each badge type and award if eligible
  FOR badge_record IN 
    SELECT * FROM (
      VALUES 
        ('First Steps', 1),
        ('Community Builder', 5),
        ('Accessibility Advocate', 25),
        ('Guardian of Access', 50),
        ('Inclusion Champion', 100),
        ('Accessibility Legend', 250)
    ) AS badges(badge_type, reviews_required)
  LOOP
    -- Check if user is eligible and doesn't already have this badge
    IF user_verified_reviews >= badge_record.reviews_required AND
       NOT EXISTS (
         SELECT 1 FROM nft_badges 
         WHERE user_id = target_user_id AND badge_type = badge_record.badge_type
       ) THEN
      
      -- Award the badge (without NFT details initially)
      INSERT INTO nft_badges (user_id, badge_type, token_id, contract_address, metadata_uri, transaction_hash)
      VALUES (
        target_user_id,
        badge_record.badge_type,
        '', -- Will be updated when NFT is minted
        '', -- Will be updated when NFT is minted
        '', -- Will be updated when NFT is minted
        ''  -- Will be updated when NFT is minted
      );
      
      -- Log the badge award (optional, for debugging)
      RAISE LOG 'Awarded badge % to user %', badge_record.badge_type, target_user_id;
    END IF;
  END LOOP;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_and_award_badges(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_and_award_badges(uuid) TO service_role;

-- Function to be called when a review is verified
CREATE OR REPLACE FUNCTION public.handle_review_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only process if review was just verified (changed from false to true)
  IF OLD.is_verified = false AND NEW.is_verified = true THEN
    -- Check and award badges for this user
    PERFORM public.check_and_award_badges(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for review verification
DROP TRIGGER IF EXISTS trigger_review_verification ON reviews;
CREATE TRIGGER trigger_review_verification
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_review_verification();

-- Update the existing user stats function to be more accurate
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

-- Function to manually trigger badge check for existing users
CREATE OR REPLACE FUNCTION public.trigger_badge_check_for_all_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record record;
BEGIN
  -- Check badges for all users with verified reviews
  FOR user_record IN 
    SELECT DISTINCT user_id 
    FROM reviews 
    WHERE is_verified = true
  LOOP
    PERFORM public.check_and_award_badges(user_record.user_id);
  END LOOP;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.trigger_badge_check_for_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.trigger_badge_check_for_all_users() TO service_role;

-- Run the badge check for existing users (optional - uncomment if needed)
-- SELECT public.trigger_badge_check_for_all_users();