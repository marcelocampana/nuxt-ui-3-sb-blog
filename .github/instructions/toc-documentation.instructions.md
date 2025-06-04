# ContentToc PRO

## Uso

Usa la prop `links` con el `page?.body?.toc?.links` que obtienes al obtener una página.

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryCollection('content').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <UContentToc :links="page?.body?.toc?.links" />
</template>
```

### Título

Usa la prop `title` para cambiar el título de la Tabla de Contenidos.

```vue
<script setup lang="ts">
const links = ref([
  {
    id: 'usage',
    depth: 2,
    text: 'Usage',
    children: [
      {
        id: 'title',
        depth: 3,
        text: 'Title'
      },
      {
        id: 'color',
        depth: 3,
        text: 'Color'
      },
      {
        id: 'highlight',
        depth: 3,
        text: 'Highlight'
      }
    ]
  },
  {
    id: 'api',
    depth: 2,
    text: 'API',
    children: [
      {
        id: 'props',
        depth: 3,
        text: 'Props'
      },
      {
        id: 'slots',
        depth: 3,
        text: 'Slots'
      }
    ]
  },
  {
    id: 'theme',
    depth: 2,
    text: 'Theme'
  }
])
</script>

<template>
  <UContentToc title="On this page" :links="links" />
</template>
```

### Color

Usa la prop `color` para cambiar el color de los enlaces.

```vue
<script setup lang="ts">
const links = ref([
  {
    id: 'usage',
    depth: 2,
    text: 'Usage',
    children: [
      {
        id: 'title',
        depth: 3,
        text: 'Title'
      },
      {
        id: 'color',
        depth: 3,
        text: 'Color'
      },
      {
        id: 'highlight',
        depth: 3,
        text: 'Highlight'
      }
    ]
  }
])
</script>

<template>
  <UContentToc color="neutral" :links="links" />
</template>
```

### Highlight

Usa la prop `highlight` para mostrar un borde resaltado para el elemento activo.

Usa la prop `highlight-color` para cambiar el color del borde. Por defecto es el valor de la prop `color`.

```vue
<script setup lang="ts">
const links = ref([
  {
    id: 'usage',
    depth: 2,
    text: 'Usage',
    children: [
      {
        id: 'title',
        depth: 3,
        text: 'Title'
      },
      {
        id: 'color',
        depth: 3,
        text: 'Color'
      },
      {
        id: 'highlight',
        depth: 3,
        text: 'Highlight'
      }
    ]
  }
])
</script>

<template>
  <UContentToc highlight highlight-color="neutral" color="neutral" :links="links" />
</template>
```

## Ejemplos

### Dentro de una página

Usa el componente ContentToc en una página para mostrar la Tabla de Contenidos:

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryCollection('content').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" />
    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />
      <USeparator v-if="surround?.filter(Boolean).length" />
      <UContentSurround :surround="(surround as any)" />
    </UPageBody>
    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body.toc.links" />
    </template>
  </UPage>
</template>
```

## API

### Props

| Prop | Default | Type |
|------|---------|------|
| `as` | | El elemento o componente como el que este componente debería renderizarse. |
| `trailingIcon` | | El icono mostrado para colapsar el contenido. |
| `title` | | El título de la tabla de contenidos. |
| `color` | | |
| `highlight` | | Mostrar una línea junto al enlace activo. |
| `highlightColor` | | |
| `links` | | |
| `open` | | El estado abierto controlado del collapsible. Puede vincularse con |
| `defaultOpen` | | El estado abierto del collapsible cuando se renderiza inicialmente. |
| `ui` | | |

### Slots

| Slot | Type |
|------|------|
| `leading` | `{ open: boolean }` |
| `default` | `{ open: boolean }` |
| `trailing` | `{ open: boolean }` |
| `content` | `{ links: ContentTocLink[] }` |
| `link` | `{ link: ContentTocLink }` |
| `top` | `{ links?: ContentTocLink[] \| undefined }` |
| `bottom` | `{ links?: ContentTocLink[] \| undefined }` |

### Emits

| Event | Type |
|-------|------|
| `update:open` | `boolean` |
| `move` | `string` |

## Theme

```typescript
export default defineAppConfig({
  uiPro: {
    contentToc: {
      slots: {
        root: 'sticky top-(--ui-header-height) z-10 bg-default/75 lg:bg-[initial] backdrop-blur -mx-4 px-4 sm:px-6 sm:-mx-6 overflow-y-auto max-h-[calc(100vh-var(--ui-header-height))]',
        container: 'pt-4 sm:pt-6 pb-2.5 sm:pb-4.5 lg:py-8 border-b border-dashed border-default lg:border-0 flex flex-col',
        top: '',
        bottom: 'mt-6 hidden lg:flex lg:flex-col gap-6',
        trigger: 'group text-sm font-semibold flex-1 flex items-center gap-1.5 py-1.5 -mt-1.5 focus-visible:outline-primary',
        title: 'truncate',
        trailing: 'ms-auto inline-flex gap-1.5 items-center',
        trailingIcon: 'size-5 transform transition-transform duration-200 shrink-0 group-data-[state=open]:rotate-180 lg:hidden',
        content: 'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden focus:outline-none',
        list: 'min-w-0',
        listWithChildren: 'ms-3',
        item: 'min-w-0',
        itemWithChildren: '',
        link: 'group relative text-sm flex items-center focus-visible:outline-primary py-1',
        linkText: 'truncate',
        indicator: 'absolute ms-2.5 transition-[translate,height] duration-200 h-(--indicator-size) translate-y-(--indicator-position) w-px rounded-full'
      },
      variants: {
        color: {
          primary: '',
          secondary: '',
          success: '',
          info: '',
          warning: '',
          error: '',
          neutral: ''
        },
        highlightColor: {
          primary: {
            indicator: 'bg-primary'
          },
          secondary: {
            indicator: 'bg-secondary'
          },
          success: {
            indicator: 'bg-success'
          },
          info: {
            indicator: 'bg-info'
          },
          warning: {
            indicator: 'bg-warning'
          },
          error: {
            indicator: 'bg-error'
          },
          neutral: {
            indicator: 'bg-inverted'
          }
        },
        active: {
          false: {
            link: [
              'text-muted hover:text-default',
              'transition-colors'
            ]
          }
        },
        highlight: {
          true: {
            list: 'ms-2.5 ps-4 border-s border-default',
            item: '-ms-px'
          }
        }
      },
      compoundVariants: [
        {
          color: 'primary',
          active: true,
          class: {
            link: 'text-primary',
            linkLeadingIcon: 'text-primary'
          }
        },
        {
          color: 'neutral',
          active: true,
          class: {
            link: 'text-highlighted',
            linkLeadingIcon: 'text-highlighted'
          }
        }
      ],
      defaultVariants: {
        color: 'primary',
        highlightColor: 'primary'
      }
    }
  }
})
```

### Configuración con Vite (@nuxt/ui)

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      uiPro: {
        contentToc: {
          // ... configuración del tema aquí
        }
      }
    })
  ]
})
```

### Configuración con Vite (@nuxt/ui-pro)

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import uiPro from '@nuxt/ui-pro/vite'

export default defineConfig({
  plugins: [
    vue(),
    uiPro({
      uiPro: {
        contentToc: {
          // ... configuración del tema aquí
        }
      }
    })
  ]
})