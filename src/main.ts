import { createApp } from 'vue';
import App from './App.vue';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import { aliases, md } from 'vuetify/iconsets/md';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VDateInput } from 'vuetify/labs/VDateInput';

const vuetify = createVuetify({
  components: {
    VDateInput,
    ...components,
  },
  directives,
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#00796B', // Nice teal color
          secondary: '#004D40',
          accent: '#B2DFDB',
        },
      },
    },
  },
});

const app = createApp(App).use(vuetify);

app.mount('#app');
