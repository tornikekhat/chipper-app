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

const isFavorited = computed(() => {
  return favoritesStore.isUserFavorited(props.post.user.id);
});

const isLoading = ref(false);

async function toggleFollow() {
  if (isLoading.value || user.isGuest) return;

  isLoading.value = true;
  try {
    if (isFavorited.value) {
      await favoritesStore.unfavoriteUser(props.post.user.id);
    } else {
      await favoritesStore.favoriteUser(props.post.user.id);
    }
  } catch (error) {
    console.error("Failed to toggle follow:", error);
  } finally {
    isLoading.value = false;
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
        :disabled="isLoading"
        :class="[
          'font-medium text-sm px-2 rounded-full transition-colors',
          isFavorited
            ? 'bg-gray-300 hover:bg-gray-400'
            : 'bg-blue-200 hover:bg-blue-300',
        ]"
      >
        {{ isLoading ? "..." : isFavorited ? "Unfollow" : "Follow" }}
      </button>
    </div>
    <p>
      {{ post.body }}
    </p>
    <button
      class="bg-red-200 text-red-500 flex items-center justify-center gap-2 p-4 rounded-lg"
    >
      <HeartIcon class="h-6 stroke-current" />
      <span class="font-bold"> Add to my favorites </span>
    </button>
  </div>
</template>
