<script setup>
const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})

console.log(props);
</script>

<template>
  <UContainer v-if="blok">
    <UPageHeader
      :title="blok.title"
      :description="blok.description"
    >
      <template #headline>
        <UBadge
          v-bind="blok.badge"
          variant="subtle"
        />
        <span class="text-muted">&middot;</span>
        <time class="text-muted">{{ new Date(blok.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
      </template>

      <div class="flex flex-wrap items-center gap-3 mt-4">
        <UButton
          v-for="(author, index) in blok.authors"
          :key="index"
          :to="author.to"
          color="neutral"
          variant="subtle"
          target="_blank"
          size="sm"
        >
          <UAvatar
            v-bind="author.avatar"
            alt="Author avatar"
            size="2xs"
          />

          {{ author.name }}
        </UButton>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody>
        <ContentRenderer
          v-if="blok"
          :value="blok"
        />

        <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template
        v-if="blok?.body?.toc?.links?.length"
        #right
      >
        <UContentToc :links="blok.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
