import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Save, ArrowLeft, Mail } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function EditProfileScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    avatar_url: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('username, bio, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        username: data.username || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || '',
        email: user.email || '',
      });
    }
  };

  const saveProfile = async () => {
    if (!user?.id) return;

    if (!profile.username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        username: profile.username.trim(),
        bio: profile.bio.trim(),
        avatar_url: profile.avatar_url.trim(),
      })
      .eq('id', user.id);

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to update profile');
    } else {
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerGradient: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 16,
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: getFontSize(fontSize, 'body'),
      color: '#FFFFFF',
      opacity: 0.95,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    label: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 14,
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    hint: {
      fontSize: getFontSize(fontSize, 'xsmall'),
      color: theme.textSecondary,
      marginTop: 6,
    },
    disabledInput: {
      opacity: 0.6,
    },
    saveButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
    },
    saveButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    avatarPreview: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.border,
      alignSelf: 'center',
      marginTop: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarPlaceholder: {
      fontSize: getFontSize(fontSize, 'xlarge'),
      color: theme.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Text style={styles.headerSubtitle}>Update your information</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={profile.email}
            editable={false}
          />
          <Text style={styles.hint}>Email cannot be changed</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor={theme.textSecondary}
            value={profile.username}
            onChangeText={(text) => setProfile({ ...profile, username: text })}
            autoCapitalize="none"
          />
          <Text style={styles.hint}>Choose a unique username</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself..."
            placeholderTextColor={theme.textSecondary}
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            multiline
            maxLength={200}
          />
          <Text style={styles.hint}>{profile.bio.length}/200 characters</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Avatar URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/avatar.jpg"
            placeholderTextColor={theme.textSecondary}
            value={profile.avatar_url}
            onChangeText={(text) => setProfile({ ...profile, avatar_url: text })}
            autoCapitalize="none"
            keyboardType="url"
          />
          <Text style={styles.hint}>Link to your profile picture</Text>

          {profile.avatar_url ? (
            <View style={styles.avatarPreview}>
              <Text style={styles.avatarPlaceholder}>Preview</Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveProfile}
          disabled={loading}
        >
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
