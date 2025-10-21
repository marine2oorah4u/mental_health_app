import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import FeedNotification from '@/components/FeedNotification';
import {
  Plus,
  Heart,
  ThumbsUp,
  Sparkles,
  Flag,
  X,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react-native';

interface Post {
  id: string;
  username: string;
  content: string;
  category: string;
  created_at: string;
  user_id: string;
}

interface Reaction {
  post_id: string;
  reaction_type: string;
  count: number;
}

const CATEGORIES = ['Health', 'Personal', 'Work', 'Relationships', 'Self-Care', 'Other'];

const REACTIONS = [
  { type: 'heart', icon: Heart, color: '#E91E63' },
  { type: 'thumbs_up', icon: ThumbsUp, color: '#2196F3' },
  { type: 'sparkles', icon: Sparkles, color: '#FF9800' },
];

interface AchievementFeedItem {
  id: string;
  display_name: string;
  achievement_name: string;
  achievement_category: string;
  achievement_points: number;
  earned_at: string;
}

export default function CommunityScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [achievementFeed, setAchievementFeed] = useState<AchievementFeedItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Personal');
  const [loading, setLoading] = useState(false);
  const [showAchievements, setShowAchievements] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [notification, setNotification] = useState<{
    type: 'achievement' | 'post';
    username: string;
    content: string;
  } | null>(null);
  const lastAchievementIdRef = useRef<string | null>(null);
  const lastPostIdRef = useRef<string | null>(null);

  useEffect(() => {
    loadPosts();
    loadReactions();
    loadAchievementFeed();

    // Auto-refresh feed every 10-60 seconds for testing
    const getRandomInterval = () => Math.floor(Math.random() * (60000 - 10000 + 1)) + 10000;

    const scheduleNextRefresh = () => {
      const interval = getRandomInterval();
      console.log(`[Community Feed] Next refresh in ${interval / 1000} seconds`);

      timerRef.current = setTimeout(() => {
        console.log('[Community Feed] Refreshing now...');
        loadAchievementFeed();
        loadPosts();
        loadReactions();
        scheduleNextRefresh();
      }, interval);
    };

    scheduleNextRefresh();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const loadAchievementFeed = async () => {
    const { data, error } = await supabase
      .from('achievement_feed')
      .select(`
        id,
        display_name,
        earned_at,
        achievements (
          name,
          category,
          points
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data && data.length > 0) {
      const formattedFeed = data.map((item: any) => ({
        id: item.id,
        display_name: item.display_name,
        achievement_name: item.achievements?.name || 'Achievement',
        achievement_category: item.achievements?.category || 'engagement',
        achievement_points: item.achievements?.points || 0,
        earned_at: item.earned_at,
      }));

      // Check for new achievement
      const latestId = formattedFeed[0].id;
      if (lastAchievementIdRef.current && lastAchievementIdRef.current !== latestId) {
        const newAchievement = formattedFeed[0];
        setNotification({
          type: 'achievement',
          username: newAchievement.display_name,
          content: `unlocked "${newAchievement.achievement_name}"! 🏆`,
        });
      }
      lastAchievementIdRef.current = latestId;

      setAchievementFeed(formattedFeed);
    }
  };

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('accomplishment_posts')
      .select('*')
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data && data.length > 0) {
      // Check for new post
      const latestId = data[0].id;
      if (lastPostIdRef.current && lastPostIdRef.current !== latestId) {
        const newPost = data[0];
        setNotification({
          type: 'post',
          username: newPost.display_name || 'Someone',
          content: newPost.content.substring(0, 60) + (newPost.content.length > 60 ? '...' : ''),
        });
      }
      lastPostIdRef.current = latestId;

      setPosts(data);
    }
  };

  const loadReactions = async () => {
    const { data, error } = await supabase.from('post_reactions').select('post_id, reaction_type');

    if (!error && data) {
      const grouped = data.reduce((acc: Reaction[], curr) => {
        const existing = acc.find(
          (r) => r.post_id === curr.post_id && r.reaction_type === curr.reaction_type
        );
        if (existing) {
          existing.count++;
        } else {
          acc.push({ post_id: curr.post_id, reaction_type: curr.reaction_type, count: 1 });
        }
        return acc;
      }, []);
      setReactions(grouped);
    }
  };

  const createPost = async () => {
    if (!content.trim() || !user) return;

    setLoading(true);
    const { error } = await supabase.from('accomplishment_posts').insert({
      user_id: user.id,
      username: user.email?.split('@')[0] || 'Anonymous',
      content: content.trim(),
      category: selectedCategory,
      moderation_status: 'approved',
    });

    if (!error) {
      setModalVisible(false);
      setContent('');
      loadPosts();
    }
    setLoading(false);
  };

  const addReaction = async (postId: string, reactionType: string) => {
    if (!user) return;

    const { error } = await supabase.from('post_reactions').insert({
      post_id: postId,
      user_id: user.id,
      reaction_type: reactionType,
    });

    if (!error) {
      loadReactions();
    }
  };

  const reportPost = (post: Post) => {
    if (!user) return;

    Alert.alert('Report Post', 'Why are you reporting this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Inappropriate Content',
        onPress: async () => {
          await supabase.from('moderation_queue').insert({
            post_id: post.id,
            reported_by: user.id,
            reason: 'Inappropriate Content',
          });
          Alert.alert('Thanks', 'This post has been reported for review.');
        },
      },
      {
        text: 'Spam',
        onPress: async () => {
          await supabase.from('moderation_queue').insert({
            post_id: post.id,
            reported_by: user.id,
            reason: 'Spam',
          });
          Alert.alert('Thanks', 'This post has been reported for review.');
        },
      },
    ]);
  };

  const getReactionCount = (postId: string, reactionType: string) => {
    const reaction = reactions.find(
      (r) => r.post_id === postId && r.reaction_type === reactionType
    );
    return reaction?.count || 0;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
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
    statsRow: {
      flexDirection: 'row',
      padding: 20,
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statNumber: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: theme.primary,
      marginTop: 8,
    },
    statLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginTop: 4,
    },
    content: {
      flex: 1,
      padding: 20,
      paddingTop: 0,
    },
    newPostButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    newPostButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      marginLeft: 8,
    },
    postCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    postHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    postUsername: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
    },
    postTime: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
    },
    categoryBadge: {
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 4,
    },
    categoryText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.primary,
      fontWeight: '500',
    },
    postContent: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      lineHeight: getFontSize(fontSize, 'body') * 1.5,
      marginBottom: 16,
    },
    postActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    reactions: {
      flexDirection: 'row',
      gap: 16,
    },
    reactionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    reactionCount: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      fontWeight: '500',
    },
    reportButton: {
      padding: 4,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
    },
    closeButton: {
      padding: 8,
    },
    label: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      marginBottom: 12,
      fontWeight: '500',
    },
    categories: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: theme.border,
    },
    categoryButtonActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '20',
    },
    categoryButtonText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      fontWeight: '500',
    },
    textInput: {
      backgroundColor: theme.background,
      borderRadius: 12,
      padding: 16,
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 120,
      textAlignVertical: 'top',
      marginBottom: 20,
    },
    charCount: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      textAlign: 'right',
      marginTop: -12,
      marginBottom: 20,
    },
    postButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    postButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
    },
    postButtonDisabled: {
      opacity: 0.5,
    },
    achievementFeedSection: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 8,
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: '700',
      color: theme.text,
      flex: 1,
    },
    sectionBadge: {
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.primary,
      fontWeight: '600',
    },
    achievementFeedItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border + '40',
      gap: 12,
    },
    achievementIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    achievementInfo: {
      flex: 1,
    },
    achievementFeedName: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    achievementFeedText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginBottom: 2,
    },
    achievementName: {
      fontWeight: '600',
    },
    achievementTime: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      opacity: 0.7,
    },
    pointsBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },
    pointsText: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      {/* Feed Notification */}
      {notification && (
        <FeedNotification
          type={notification.type}
          username={notification.username}
          content={notification.content}
          onDismiss={() => setNotification(null)}
        />
      )}

      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Celebrate wins together</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Users size={24} color={theme.primary} />
          <Text style={styles.statNumber}>{posts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={24} color={theme.secondary} />
          <Text style={styles.statNumber}>{reactions.length}</Text>
          <Text style={styles.statLabel}>Reactions</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color={theme.accent} />
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        {user && (
          <TouchableOpacity style={styles.newPostButton} onPress={() => setModalVisible(true)}>
            <Plus size={24} color="#FFFFFF" />
            <Text style={styles.newPostButtonText}>Share an Accomplishment</Text>
          </TouchableOpacity>
        )}

        {achievementFeed.length > 0 && (
          <View style={styles.achievementFeedSection}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setShowAchievements(!showAchievements)}
            >
              <Award size={20} color={theme.primary} />
              <Text style={styles.sectionTitle}>Recent Achievements</Text>
              <Text style={styles.sectionBadge}>{achievementFeed.length}</Text>
            </TouchableOpacity>

            {showAchievements && achievementFeed.map((item) => {
              const categoryColors: Record<string, string> = {
                engagement: '#3B82F6',
                wellness: '#10B981',
                milestone: '#F59E0B',
                special: '#8B5CF6',
              };
              const color = categoryColors[item.achievement_category] || theme.primary;

              return (
                <View key={item.id} style={styles.achievementFeedItem}>
                  <View style={[styles.achievementIcon, { backgroundColor: `${color}20` }]}>
                    <Award size={20} color={color} />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementFeedName}>{item.display_name}</Text>
                    <Text style={styles.achievementFeedText}>
                      earned <Text style={[styles.achievementName, { color }]}>{item.achievement_name}</Text>
                    </Text>
                    <Text style={styles.achievementTime}>{formatTimeAgo(item.earned_at)}</Text>
                  </View>
                  <View style={[styles.pointsBadge, { backgroundColor: color }]}>
                    <Text style={styles.pointsText}>+{item.achievement_points}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Sparkles size={64} color={theme.textSecondary} />
            <Text style={styles.emptyStateText}>
              Be the first to share an accomplishment!
            </Text>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View>
                  <Text style={styles.postUsername}>@{post.username}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{post.category}</Text>
                  </View>
                </View>
                <Text style={styles.postTime}>{formatTimeAgo(post.created_at)}</Text>
              </View>

              <Text style={styles.postContent}>{post.content}</Text>

              <View style={styles.postActions}>
                <View style={styles.reactions}>
                  {REACTIONS.map((reaction) => {
                    const Icon = reaction.icon;
                    const count = getReactionCount(post.id, reaction.type);
                    return (
                      <TouchableOpacity
                        key={reaction.type}
                        style={styles.reactionButton}
                        onPress={() => addReaction(post.id, reaction.type)}
                      >
                        <Icon size={20} color={reaction.color} />
                        {count > 0 && <Text style={styles.reactionCount}>{count}</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity style={styles.reportButton} onPress={() => reportPost(post)}>
                  <Flag size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Your Win</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Category</Text>
            <View style={styles.categories}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={styles.categoryButtonText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Your Accomplishment</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Share something you're proud of..."
              placeholderTextColor={theme.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={280}
            />
            <Text style={styles.charCount}>{content.length}/280</Text>

            <TouchableOpacity
              style={[styles.postButton, !content.trim() && styles.postButtonDisabled]}
              onPress={createPost}
              disabled={!content.trim() || loading}
            >
              <Text style={styles.postButtonText}>
                {loading ? 'Posting...' : 'Share Accomplishment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
