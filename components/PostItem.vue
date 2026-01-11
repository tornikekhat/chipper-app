<script setup>
import { HeartIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const user = useUser();
const favoritesStore = useFavorites();

const isOwnPost = computed(() => {
  return !user.isGuest && user.data.id === props.post.user.id;
});

const isUserFavorited = computed(() => {
  return favoritesStore.isUserFavorited(props.post.user.id);
});

const isPostFavorited = computed(() => {
  return favoritesStore.isPostFavorited(props.post.id);
});

const isLoadingFollow = ref(false);
const isLoadingFavorite = ref(false);

async function toggleFollow() {
  if (isLoadingFollow.value || user.isGuest) return;

  isLoadingFollow.value = true;
  try {
    if (isUserFavorited.value) {
      await favoritesStore.unfavoriteUser(props.post.user.id);
    } else {
      await favoritesStore.favoriteUser(props.post.user.id);
    }
  } catch (error) {
    console.error("Failed to toggle follow:", error);
  } finally {
    isLoadingFollow.value = false;
  }
}

async function toggleFavoritePost() {
  if (isLoadingFavorite.value || user.isGuest) return;

  isLoadingFavorite.value = true;
  try {
    if (isPostFavorited.value) {
      await favoritesStore.unfavoritePost(props.post.id);
    } else {
      await favoritesStore.favoritePost(props.post.id);
    }
  } catch (error) {
    console.error("Failed to toggle favorite post:", error);
  } finally {
    isLoadingFavorite.value = false;
  }
}
</script>

<template>
  <div class="grid gap-3">
    <h4 class="font-bold text-lg">
      {{ post.title }}
    </h4>
    <div class="flex justify-between bg-gray-100 p-4 rounded-lg">
      <div>
        by <strong>{{ post.user.name }}</strong>
      </div>
      <button
        v-if="!user.isGuest && !isOwnPost"
        @click="toggleFollow"
        :disabled="isLoadingFollow"
        :class="[
          'font-medium text-sm px-2 rounded-full transition-colors',
          isUserFavorited
            ? 'bg-gray-300 hover:bg-gray-400'
            : 'bg-blue-200 hover:bg-blue-300',
        ]"
      >
        {{ isLoadingFollow ? "..." : isUserFavorited ? "Unfollow" : "Follow" }}
      </button>
    </div>
    <p>
      {{ post.body }}
    </p>
    <button
      v-if="!user.isGuest"
      @click="toggleFavoritePost"
      :disabled="isLoadingFavorite"
      :class="[
        'flex items-center justify-center gap-2 p-4 rounded-lg transition-colors font-bold',
        isPostFavorited
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-red-200 text-red-500 hover:bg-red-300',
      ]"
    >
      <HeartIcon
        :class="[
          'h-6 transition-all',
          isPostFavorited ? 'fill-current stroke-current' : 'stroke-current',
        ]"
      />
      <span>
        {{
          isLoadingFavorite
            ? "..."
            : isPostFavorited
            ? "Remove from favorites"
            : "Add to my favorites"
        }}
      </span>
    </button>
  </div>
</template>
