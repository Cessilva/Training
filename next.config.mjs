/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Genera una carpeta 'out' con HTML puro
  images: {
    unoptimized: true, // GitHub Pages no soporta la optimización de imágenes nativa de Next
  },
  // Si tu repo no es "tu-usuario.github.io", sino "mi-proyecto", añade esto:
  basePath: '/Training',
};

export default nextConfig;
