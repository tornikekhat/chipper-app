export const useFavorites = defineStore("favorites", () => {
  const { $api } = useNuxtApp();

  const favoritedUserIds = ref(new Set());
  const favoritedPostIds = ref(new Set());

  function isUserFavorited(userId) {
    return favoritedUserIds.value.has(userId);
  }

  function isPostFavorited(postId) {
    return favoritedPostIds.value.has(postId);
  }

  async function fetchFavorites() {
    try {
      const response = await $api.get("favorites");
      const data = response.data || response;

      const userIds = (data.users || []).map((user) => user.id);
      favoritedUserIds.value = new Set(userIds);

      const postIds = (data.posts || []).map((post) => post.id);
      favoritedPostIds.value = new Set(postIds);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      favoritedUserIds.value = new Set();
      favoritedPostIds.value = new Set();
    }
  }

  async function favoriteUser(userId) {
    try {
      await $api.post(`users/${userId}/favorite`);
      favoritedUserIds.value = new Set([...favoritedUserIds.value, userId]);
    } catch (error) {
      console.error("Failed to favorite user:", error);
      throw error;
    }
  }

  async function unfavoriteUser(userId) {
    try {
      await $api.delete(`users/${userId}/favorite`);
      const newSet = new Set(favoritedUserIds.value);
      newSet.delete(userId);
      favoritedUserIds.value = newSet;
    } catch (error) {
      console.error("Failed to unfavorite user:", error);
      throw error;
    }
  }

  async function favoritePost(postId) {
    try {
      await $api.post(`posts/${postId}/favorite`);
      favoritedPostIds.value = new Set([...favoritedPostIds.value, postId]);
    } catch (error) {
      console.error("Failed to favorite post:", error);
      throw error;
    }
  }

  async function unfavoritePost(postId) {
    try {
      await $api.delete(`posts/${postId}/favorite`);
      const newSet = new Set(favoritedPostIds.value);
      newSet.delete(postId);
      favoritedPostIds.value = newSet;
    } catch (error) {
      console.error("Failed to unfavorite post:", error);
      throw error;
    }
  }

  function clear() {
    favoritedUserIds.value = new Set();
    favoritedPostIds.value = new Set();
  }

  return {
    favoritedUserIds: computed(() => favoritedUserIds.value),
    favoritedPostIds: computed(() => favoritedPostIds.value),
    isUserFavorited,
    isPostFavorited,
    fetchFavorites,
    favoriteUser,
    unfavoriteUser,
    favoritePost,
    unfavoritePost,
    clear,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot));
}
