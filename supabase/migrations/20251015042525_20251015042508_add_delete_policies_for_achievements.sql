/*
  # Add DELETE policies for user achievements and stats

  1. Changes
    - Add DELETE policy for user_achievements table to allow users to delete their own achievements
    - Add DELETE policy for user_stats table to allow users to delete their own stats

  2. Security
    - Policies check that auth.uid() matches user_id before allowing deletion
    - Only authenticated users can delete their own data
*/

CREATE POLICY "Users can delete own achievements"
  ON user_achievements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stats"
  ON user_stats FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
