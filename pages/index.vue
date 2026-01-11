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
</script>

<template>
  <PostForm v-if="!user.isGuest" />
  <div class="grid gap-16">
    <PostItem
      v-for="post in postsStore.posts"
      :key="post.id"
      v-bind="{ post }"
    />
  </div>
</template>
