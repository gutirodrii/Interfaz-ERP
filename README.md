<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layers.svg" width="80" alt="FlowOps Logo" />
  <h1>FlowOps ERP</h1>
  <p><strong>Plataforma integral de gestión, fichaje y flujos de trabajo</strong></p>

  <p>
    <a href="#-características">Características</a> •
    <a href="#-stack-tecnológico">Stack</a> •
    <a href="#-demostración">Demo</a> •
    <a href="#-instalación-y-despliegue">Instalación</a> •
    <a href="#-estructura">Estructura</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" />
    <img alt="React" src="https://img.shields.io/badge/React-19-blue?logo=react" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css" />
    <img alt="Zustand" src="https://img.shields.io/badge/Zustand-5-yellow?logo=react" />
  </p>
</div>

---

## 🚀 Descripción

**FlowOps ERP** (anteriormente Flowdex) es una interfaz moderna, ultra-intuitiva y profesional diseñada para gestionar equipos, tiempos y tareas empresariales. Su enfoque principal es la simplicidad de uso ("cero fricción") para usuarios no técnicos, combinada con un diseño premium y responsive basado en variables CSS personalizadas, modo oscuro, y tipografías limpias.

## ✨ Características Principales

*   ⏰ **Módulo de Fichaje (Time Tracking):** 
    *   Reloj gigante animado en tiempo real.
    *   Botones enormes y claros para Fichar Entrada / Salida.
    *   Cálculo automático de horas trabajadas (Diario, Semanal, Overtime).
    *   Gráficos visuales del progreso diario y semanal.
*   📊 **Dashboard de Equipo:** Vista general del estado del equipo (quién está trabajando, quién falta por fichar y horas totales del equipo en el día).
*   📁 **Gestión de Documentos:** Subida de archivos (drag & drop), categorización (Facturas, Contratos) con indicadores de estado de carga.
*   📋 **Tareas (Kanban Boards):** Tableros interactivos con soporte completo *Drag & Drop* (*dnd-kit*).
*   📅 **Calendario (Eventos):** Integración nativa (*react-big-calendar*) y soporte para agendar reuniones y turnos.
*   🌙 **Dark Mode & Temas:** Soporte nativo y persistente para modo claro y oscuro a través de `next-themes`.
*   💾 **Persistencia Local:** Los estados clave de la interfaz se sincronizan automáticamente con el navegador (`localStorage` seguro ante fallos SSR).

## 🛠 Stack Tecnológico

La aplicación está construida sobre las mejores y más modernas herramientas del ecosistema React:

| Categoría | Tecnología |
| :--- | :--- |
| **Framework Base** | Next.js 15 (App Router) |
| **Librería UI** | React 19 |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS 3 (con custom CSS variables) |
| **Estado Global** | Zustand 5 (sin middleware persist problemático con SSR) |
| **Iconería** | Lucide React |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable` |
| **Calendario** | `react-big-calendar`, `date-fns` |

## 🎮 Demostración

Para acceder al entorno de demostración, utiliza las siguientes credenciales en la pantalla de inicio de sesión:

*   **Email:** `demo@flowops.com`
*   **Contraseña:** `demo1234`

*(Nota: Actualmente los datos de la demostración se guardan de forma persistente en tu navegador)*

## 📦 Instalación y Despliegue

### Requisitos previos

*   Node.js (v18.17 o superior)
*   npm, pnpm o yarn

### Pasos para ejecución local

1.  **Clona este repositorio:**
    ```bash
    git clone https://github.com/sequeradev/Interfaz-ERP.git
    cd Interfaz-ERP
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Abre en tu navegador:** Visita [http://localhost:3000](http://localhost:3000)

### Despliegue a Producción

La aplicación está optimizada para ser desplegada sin esfuerzo en **Vercel**:

```bash
npm run build
npm run start
```

## 📁 Estructura del Proyecto

*   `/app`: Rutas del App Router de Next.js (`/login`, `/app/fichaje`, `/app/documents`, etc.)
*   `/components`: Componentes reutilizables de React (UI modular).
    *   `/layout`: Interfaz general, sidebar principal y proveedores de temas.
    *   `/ui`: Componentes atómicos (ej. `file-upload.tsx`).
*   `/lib`: Lógica de negocio, servicios e integraciones.
    *   `/store`: Estado global con Zustand (ej. `fichajeStore.ts`).
*   `/context`: Contextos de React para datos (Teams, Work).
*   `tailwind.config.ts`: Configuración personalizada del sistema de diseño (Brand colors, gradientes, animaciones).

---
<div align="center">
  Creado con ❤️ para optimizar la operativa de tu empresa.
</div>
