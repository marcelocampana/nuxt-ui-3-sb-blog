<script setup>
const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})
</script>

<template>


    
           
      <blockquote class="flex italic  font-bold mb-3 leading-6 px-3">
         <UAvatar 
      :src="blok.avatar?.filename" 
      :alt="blok.author"
      size="3xl"
      class="flex-shrink-0 mr-5 mt-3"
    />
    <div class="mb-3">
        "{{ blok.quote }}"<span class="text-sm font-semibold text-gray-700 not-italic ml-2">— {{ blok.author }}</span><span class="text-sm text-gray-600 mt-1 not-italic font-normal"> , {{ blok.role }} </span></div>
      </blockquote>

  
 
</template>
