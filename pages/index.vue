<script setup>
definePageMeta({
  middleware: ["validate-session"],
});

const user = useUser();
const postsStore = usePosts();
const favoritesStore = useFavorites();

await postsStore.fetchPosts();

if (!user.isGuest) {
  await favoritesStore.fetchFavorites();
}

let pollInterval = null;

onMounted(() => {
  postsStore.checkForNewPosts();

  pollInterval = setInterval(() => {
    postsStore.checkForNewPosts();
  }, 30000);
});

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval);
  }
});

async function handleLoadNewPosts() {
  postsStore.loadNewPosts();
  if (!user.isGuest) {
    await favoritesStore.fetchFavorites();
  }
}
</script>

<template>
  <PostForm v-if="!user.isGuest" />
  <button
    v-if="postsStore.newPostsAvailable"
    @click="handleLoadNewPosts"
    class="mb-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
  >
    Load New Posts
  </button>
  <div class="grid gap-16">
    <PostItem
      v-for="post in postsStore.posts"
      :key="post.id"
      v-bind="{ post }"
    />
  </div>
</template>
