<script setup>
const config = useRuntimeConfig();
const storyblokContentVersion = config.public.storyblokContentVersion;
const props = defineProps({ blok: Object });

const recordPerPage = 7;
const page = ref(1);
const totalPosts = ref(0);
const loading = ref(false);
const storyblokApi = useStoryblokApi();
const posts = ref([]);
const fetchItems = async () => {
  
  const response = await storyblokApi.get("cdn/stories", {
    version: storyblokContentVersion,
    starts_with: "blog",
    is_startpage: false,
    per_page: recordPerPage,
    page: page.value,
    sort_by: "content.newsDate:desc",

  });
   const data = response.data;
  totalPosts.value = response.total;
  const newItems = data.stories;
  posts.value.push(...newItems);
  loading.value = false;
  page.value++;


}
onMounted(fetchItems);
console.log(posts.value);

  </script>

  <template>
  <UContainer>
   
    <UPageHeader
    title="Blog"
    description="Articulos de investigación, innovación y esperanza en el tratamiento contra el cáncer."
         class="py-[50px]"
  />

    <UPageBody>
      <UBlogPosts>
        <UBlogPost
          v-for="(post, index) in posts"
          :key="index"
          :to="`/blog/${post.slug}`"
          :title="post.content.title"
          :description="post.content.excerpt"
          :image="post.content.featuredImage?.filename"
          :date="new Date(post.content.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
          :authors="post.authors"
          :badge="{label:post.content.badge, color: 'primary', variant: 'soft'}"
          :orientation="index === 0 ? 'horizontal' : 'vertical'"
          :class="[index === 0 && 'col-span-full']"
          variant="naked"
          :ui="{
            description: 'line-clamp-2'
          }"
        />
      </UBlogPosts>
    </UPageBody>
  </UContainer>
</template>


  <!-- <template>
    <div class="container">
      <h1>Lista de Noticias</h1>
      <div v-if="posts.length === 0">No hay noticias disponibles.</div>
      <ul v-else>
        <li v-for="post in posts" :key="post.id">
          <nuxt-link :to="`/blog/${post.slug}`">{{ post.name }}</nuxt-link>
        </li>
      </ul>
    </div>

    
  </template> -->

