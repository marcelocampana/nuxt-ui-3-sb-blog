<script setup>
const config = useRuntimeConfig();
const storyblokContentVersion = config.public.storyblokContentVersion;

const route = useRoute();
const slugArray = route.params.slug;

const slug = slugArray && slugArray.length > 0 ? slugArray.join("/") : "inicio";



// try {
const story = await useAsyncStoryblok(
  slug || "not-found",
  {
    version: storyblokContentVersion,
   
  },

  { customParent: "https://app.storyblok.com" }
);








</script>

<template>
  <StoryblokComponent
    v-if="story"
    :blok="story.content"

    class="font-body"
  />
</template>