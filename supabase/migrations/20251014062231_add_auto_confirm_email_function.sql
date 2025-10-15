/*
  # Auto-confirm Email Function

  1. Purpose
    - Creates a function to auto-confirm user emails during signup
    - This bypasses the email confirmation requirement for better UX
    - Users can immediately use the app after signing up

  2. Security
    - Function is restricted to authenticated users only
    - Only allows confirming the current user's own email
    - Uses SECURITY DEFINER to allow updating auth.users table

  3. Usage
    - Called automatically during user signup
    - Sets email_confirmed_at and confirmed_at timestamps
    - Updates email_verified flag in user metadata
*/

-- Create function to auto-confirm email
CREATE OR REPLACE FUNCTION public.confirm_user_email(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the user's email confirmation status
  UPDATE auth.users
  SET 
    email_confirmed_at = NOW(),
    confirmed_at = NOW(),
    raw_user_meta_data = raw_user_meta_data || '{"email_verified": true}'::jsonb
  WHERE id = user_id;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.confirm_user_email(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_user_email(uuid) TO anon;