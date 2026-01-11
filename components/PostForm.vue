<script setup>
const postsStore = usePosts();

const title = ref("");
const body = ref("");
const isSubmitting = ref(false);

async function submit() {
  if (!title.value.trim() || !body.value.trim() || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    await postsStore.createPost({
      title: title.value.trim(),
      body: body.value.trim(),
    });

    title.value = "";
    body.value = "";
  } catch (error) {
    console.error("Failed to create post:", error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form class="grid gap-4 mb-16" @submit.prevent="submit">
    <input
      v-model="title"
      placeholder="Post title"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"
    />
    <textarea
      v-model="body"
      placeholder="What is happening?!"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"
    ></textarea>
    <button
      type="submit"
      :disabled="isSubmitting || !title.trim() || !body.trim()"
      class="bg-blue-600 text-white px-8 py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ isSubmitting ? "Posting..." : "Post" }}
    </button>
  </form>
</template>
