export const usePosts = defineStore("posts", () => {
  const { $api } = useNuxtApp();

  const posts = ref([]);

  async function fetchPosts() {
    const response = await $api.get("posts");
    posts.value = Array.isArray(response)
      ? response
      : response.data || response;
    return posts.value;
  }

  async function createPost({ title, body }) {
    const response = await $api.post("posts", { title, body });
    const post = response.data || response;
    posts.value.unshift(post);
    return post;
  }

  return {
    posts,
    fetchPosts,
    createPost,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot));
}
