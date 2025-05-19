import { defineConfig } from "vite";

export default defineConfig({
    root: 'src', // forrásfájlok mappája
    build: {
      outDir: '../dist',  // build-elt alkalmazás mappája
      target:'esnext',    // cél js verzió
      emptyOutDir: 1      // dist mappa törlése build-elés előtt
    },
    base:'./',  // a build-elt alkalmazás eléresi útja - relatív útvonal!!!
    publicDir: '../public', // statikus elemek (pl.: képek) helye
    appType: 'mpa', // Single Page Application
  
    css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',
          },
        },
      },
});

// Single Page Application (SPA) -> 404 redirect / url
// Multi Page Application (MPA) -> disable 404 redirect