<script setup>
import { defineComponent, h } from "vue";
// import {
//   MapPinIcon,
//   EnvelopeIcon,
//   PhoneIcon,
//   BriefcaseIcon,
// } from "@heroicons/vue/20/solid";

const router = useRouter();
const currentYear = ref(new Date().getFullYear());

const isEnglish = computed(() => {
  return router.currentRoute.value.path.includes("/en");
});

const navigation = {
  contact: !isEnglish
    ? [
        {
          name: "Palestina (Ex Manzano) #343, 5ºpiso, Recoleta, Santiago de Chile.",
   
          href: "/contacto",
        },
        { name: "contacto@bh.cl", href: "/contacto"},
        { name: "+56 2 29490970", href: "tel:+56229490970" },
      ]
    : [
        {
          name: "Palestina (Ex Manzano) #343, 5ºpiso, Recoleta, Santiago de Chile.",
    
          href: "/en/contacto",
        },
        { name: "contacto@bh.cl", href: "/en/contacto"  },
        { name: "+56 2 29490970", href: "tel:+56229490970" },
      ],

  social: [
    {
      name: "Facebook",
      href: "https://www.facebook.com/BradfordHill.cl",
      icon: defineComponent({
        render: () =>
          h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
            h("path", {
              "fill-rule": "evenodd",
              d: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
              "clip-rule": "evenodd",
            }),
          ]),
      }),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/bradfordhill.cl/",
      icon: defineComponent({
        render: () =>
          h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
            h("path", {
              "fill-rule": "evenodd",
              d: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
              "clip-rule": "evenodd",
            }),
          ]),
      }),
    },
    {
      name: "Linkedin",
      href: "https://www.linkedin.com/company/28979086/admin/feed/posts/",
      icon: defineComponent({
        render: () =>
          h(
            "svg",
            {
              fill: "currentColor",
              viewBox: "0 0 350 350",
            },
            [
              h("path", {
                "fill-rule": "evenodd",
                d: "M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73 C77.16,101.969,74.922,99.73,72.16,99.73z",
              }),
              h("path", {
                "fill-rule": "evenodd",
                d: "M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4 c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z",
              }),
              h("path", {
                "fill-rule": "evenodd",
                d: "M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599 c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319 c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995 C310,145.43,300.549,94.761,230.454,94.761z",
              }),
            ]
          ),
      }),
    },
  ],
};
</script>

<template>
  <footer
    class="bg-blue pt-8 pb-8"
    aria-labelledby="footer-heading "
  >
    <div class="mx-auto max-w-6xl space-y-5">
      <div
        class="flex flex-col sm:flex-row gap-x-12 sm:justify-center items-center text-center sm:text-left"
      >
        <div class="w-52 sm:mb-0 flex justify-center">
          <SvgBHLogoVariant1 color="fill-white" />
        </div>
        <div>
          <div
            v-for="(item, idx) in navigation.contact"
            :key="item.name"
            class="px-5"
          >
            <a
              :href="item.href"
              class="text-sm leading-6 text-gray-50 hover:text-gray-300 inline-flex"
              ><component
                :is="item.icon"
                :class="['mr-1 text-white', 'h-4 w-4 mt-1']"
              /><span> {{ item.name }}</span></a
            >
          </div>
          <a
            href="https://bradfordhill.buk.cl/trabaja-con-nosotros"
            target="_blank"
            class=" text-white text-sm inline-flex hover:text-gray-300"
          >
            <BriefcaseIcon class="h-4 w-4 mr-1 mt-0.5" />
            {{ !isEnglish ? "Trabaja con nosotros" : "Work With Us" }}</a
          >
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center mt-12 sm:mt-4">
      <div class="flex space-x-6 md:order-2">
        <a
          v-for="item in navigation.social"
          :key="item.name"
          :href="item.href"
          class="text-white hover:text-gray-300"
          target="_blank"
        >
          <span class="sr-only">{{ item.name }}</span>
        </a>
      </div>
    </div>
    <p class="mt-4 text-xs leading-5 text-white md:order-1 text-center">
      &copy; Copyright Bradford Hill {{ currentYear }}.
      {{ !isEnglish ? "Todos los derechos reservados" : "All rights reserved" }}
    </p>
  </footer>
</template>
