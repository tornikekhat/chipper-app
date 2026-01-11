export const usePosts = defineStore("posts", () => {
  const { $api } = useNuxtApp();

  const posts = ref([]);
  const highestPostId = ref(null);
  const newPostsAvailable = ref(false);
  const newPosts = ref([]);
  const autoAddNewPosts = ref(false); // Set to false to disable auto-add (for testing polling)

  async function fetchPosts() {
    const response = await $api.get("posts");
    const fetchedPosts = Array.isArray(response)
      ? response
      : response.data || response;
    posts.value = fetchedPosts;

    if (fetchedPosts.length > 0) {
      highestPostId.value = Math.max(...fetchedPosts.map((p) => p.id));
    }

    return fetchedPosts;
  }

  async function checkForNewPosts() {
    try {
      const response = await $api.get("posts");
      const allPosts = Array.isArray(response)
        ? response
        : response.data || response;

      if (allPosts.length === 0) {
        newPostsAvailable.value = false;
        newPosts.value = [];
        return;
      }

      const existingPostIds = new Set(posts.value.map((p) => p.id));
      const newPostsList = allPosts.filter(
        (post) => !existingPostIds.has(post.id)
      );

      if (newPostsList.length > 0) {
        newPosts.value = newPostsList;
        newPostsAvailable.value = true;
      } else {
        newPostsAvailable.value = false;
        newPosts.value = [];
      }
    } catch (error) {
      console.error("Failed to check for new posts:", error);
    }
  }

  function loadNewPosts() {
    if (newPosts.value.length === 0) {
      newPostsAvailable.value = false;
      return;
    }

    const sortedNewPosts = [...newPosts.value].sort((a, b) => b.id - a.id);
    posts.value = [...sortedNewPosts, ...posts.value];

    if (sortedNewPosts.length > 0) {
      const highestNewId = Math.max(...sortedNewPosts.map((p) => p.id));
      if (!highestPostId.value || highestNewId > highestPostId.value) {
        highestPostId.value = highestNewId;
      }
    }

    newPosts.value = [];
    newPostsAvailable.value = false;
  }

  async function createPost({ title, body }) {
    const response = await $api.post("posts", { title, body });
    const post = response.data || response;
    
    if (autoAddNewPosts.value) {
      posts.value.unshift(post);
    }

    if (!highestPostId.value || post.id > highestPostId.value) {
      highestPostId.value = post.id;
    }

    return post;
  }

  return {
    posts,
    newPostsAvailable,
    fetchPosts,
    checkForNewPosts,
    loadNewPosts,
    createPost,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot));
}
