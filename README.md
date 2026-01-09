# YouTube Playlist Builder 🎥

Una aplicación web moderna y responsiva construida con **Next.js** para crear, gestionar y reproducir listas de reproducción personalizadas de YouTube. Sus características incluyen persistencia del estado de la lista, reordenamiento mediante arrastrar y soltar, y capacidades de Importación/Exportación.

## ✨ Características Principales

-   **Agregar Videos**: Pega cualquier URL válida de YouTube para añadir videos a tu lista.
-   **Lista de Reproducción Persistente**: Tu lista y la selección del video actual se guardan automáticamente en el almacenamiento local del navegador (LocalStorage). No perderás tus datos si recargas la página o cierras la pestaña.
-   **Reordenamiento Drag & Drop**: Reordena fácilmente tu lista de reproducción arrastrando y soltando los elementos.
-   **Reproductor de Video**: Reproductor de YouTube integrado con funcionalidad de "Reproducción Automática del Siguiente".
-   **Importar / Exportar JSON**:
    -   **Exportar**: Guarda tu lista de reproducción como un archivo JSON para hacer copias de seguridad o compartirla.
    -   **Importar**: Carga una lista de reproducción desde un archivo JSON. Si tu lista actual no está vacía, puedes elegir entre **Reemplazarla** o **Anexar** los nuevos videos.
-   **Soporte de Temas**: Cambia entre modo Claro y Oscuro.
-   **Diseño Responsivo**: Optimizado tanto para escritorio como para dispositivos móviles.

## 🛠️ Stack Tecnológico

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
-   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
-   **Iconos**: [Lucide React](https://lucide.dev/)
-   **Gestión de Estado**: React Hooks + LocalStorage
-   **Componentes UI**: Componentes personalizados con una estética limpia.

## 🚀 Comenzando

Sigue estos pasos para ejecutar el proyecto localmente.

### Prerrequisitos

-   Node.js (se recomienda v18 o superior)
-   npm, yarn, pnpm, o bun

### Instalación

1.  Clona el repositorio (o descarga el código fuente):
    ```bash
    git clone <url-del-repositorio>
    cd YouTube-Playlist-Builder
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    # o
    yarn install
    # o
    pnpm install
    ```

### Ejecutar el Servidor de Desarrollo

Inicia el servidor de desarrollo local:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📂 Estructura del Proyecto

-   `app/`: Código principal de la aplicación (Next.js App Router).
    -   `page.tsx`: La página principal del constructor de listas que contiene la lógica central.
    -   `layout.tsx`: Definición del layout raíz.
-   `components/`: Componentes de UI reutilizables.
    -   `video-player.tsx`: Envoltorio alrededor del iframe de YouTube.
    -   `playlist-manager.tsx`: La lista de reproducción con soporte para arrastrar y soltar.
    -   `video-input.tsx`: Campo de entrada para añadir nuevos videos.
    -   `import-dialog.tsx`: Diálogo modal para gestionar las importaciones de listas.
    -   `theme-provider.tsx`: Proveedor de contexto para el modo oscuro/claro.
-   `types/`: Definiciones de TypeScript (ej., la interfaz `Video`).

## 🤝 Contribuciones

¡Siéntete libre de bifurcar (fork) este proyecto y enviar pull requests para cualquier nueva funcionalidad o mejora!


---
Construido con ❤️ usando Next.js.

## ☁️ Despliegue

La forma más sencilla de desplegar esta aplicación es usar la [Plataforma Vercel](https://vercel.com/new). Consulta el archivo `deployment_guide.md` o sigue estos pasos rápidos con la CLI:

1.  Instala Vercel CLI: `npm i -g vercel`
2.  Ejecuta `vercel` en la raíz del proyecto.
