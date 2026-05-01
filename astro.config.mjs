// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const BASE = '/prendautos';

// https://astro.build/config
export default defineConfig({
  site: 'https://cardenas2911.github.io',
  base: BASE,
  integrations: [react()],

  redirects: {
    '/prestamos-vehiculos': `${BASE}/prestamos-vehiculos-medellin`,
    '/prestamos-motos': `${BASE}/prestamos-motos-medellin`,
    '/simulador': `${BASE}/prestamos-vehiculos-medellin`,
    '/sin-dejar-el-carro': `${BASE}/prestamos-vehiculos-medellin`,
    '/compra-cartera': `${BASE}/prestamos-vehiculos-medellin`,
    '/prestamos-taxis': `${BASE}/prestamos-vehiculos-medellin`,
    '/oficinas': `${BASE}/contacto`,
    '/oficinas-medellin': `${BASE}/contacto`,
    '/oficinas-bogota': `${BASE}/contacto`,
    '/pignoracion': `${BASE}/prestamos-vehiculos-medellin`,
    '/pignoracion-que-es': `${BASE}/prestamos-vehiculos-medellin`,
    '/pignoracion-requisitos': `${BASE}/prestamos-vehiculos-medellin`,
    '/pignoracion-tasas': `${BASE}/prestamos-vehiculos-medellin`,
    '/pignoracion-levantar': `${BASE}/prestamos-vehiculos-medellin`,
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
