import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import { aliases, md } from 'vuetify/iconsets/md';
// import { mdi } from 'vuetify/iconsets/mdi-svg';

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
          // primary: '#9C27B0', // Nice purple color
          // secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
      },
    },
  },
});

const app = createApp(App).use(vuetify);

app.mount('#app');
