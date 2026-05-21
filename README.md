# Ruleta Móvil (Frontend)

Este repositorio contiene la aplicación móvil para el sistema interactivo de **Ruleta de Premios Degestec**. La aplicación está desarrollada utilizando **React Native**, **Expo (SDK 54)** y **TypeScript**, adaptada para ofrecer una interfaz premium de alto rendimiento en modo oscuro.

---

## 🛠️ Guía de Instalación y Configuración (Linux/macOS/Windows)

Sigue estos pasos detallados para montar y ejecutar esta aplicación en un dispositivo físico (Android o iOS) o en un emulador virtual.

---

### 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:
1.  **Node.js** (Versión 18 o superior recomendada).
2.  **npm** (Viene con Node.js).
3.  **Git**.

> [!NOTE]
> Dado que estás desarrollando en **Linux**, no podrás emular iOS localmente con el simulador de Xcode. Sin embargo, **sí puedes probar en dispositivos iOS físicos** mediante la aplicación Expo Go conectándose por red.

---

### 📦 Paso 1: Instalación de Dependencias

1. Abre tu terminal en la raíz de este proyecto (`ruleta-front-movil`).
2. Instala las dependencias necesarias ejecutando:
    ```bash
    npm install
    ```
    *(Esto instalará Expo, React Native, react-native-svg y el resto de los módulos necesarios).*

---

### 🔗 Paso 2: Configuración Crítica del Backend

Por defecto, la app apunta a `http://127.0.0.1:8000` en su archivo de configuración: `src/config.ts`.

Si dejas esto por defecto:
*   El **emulador de Android** no se conectará (para Android, `127.0.0.1` es el propio emulador).
*   Un **dispositivo físico** no se conectará (buscará el backend dentro del teléfono móvil).

#### 💡 Cómo configurarlo correctamente:

##### Opción A: Para Dispositivo Físico (Recomendada)
Debes usar la **IP local de tu computadora** en la misma red Wi-Fi.
1. En Linux, averigua tu IP local ejecutando en tu terminal:
    ```bash
    hostname -I
    ```
    *(Verás algo como `192.168.1.45` o `10.0.0.12`).*
2. Edita `src/config.ts`:
    ```typescript
    export const API_BASE = 'http://192.168.1.45:8000'; // Tu IP local y puerto del backend
    ```

##### Opción B: Para Emulador de Android
1. El emulador de Android tiene un puente especial para referirse a la máquina host (`localhost`). Edita el archivo con la IP especial `10.0.2.2`:
    ```typescript
    export const API_BASE = 'http://10.0.2.2:8000';
    ```

---

### 📱 Paso 3: Probar en un Dispositivo Físico (Expo Go)

Esta es la forma más rápida y cómoda de probar la aplicación en tiempo real.

1.  **Instala Expo Go** en tu smartphone:
    *   [Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
    *   [App Store (iOS)](https://apps.apple.com/app/expo-go/id984023395)
2.  Asegúrate de que tu computadora y tu celular estén **conectados a la misma red Wi-Fi**.
3.  Inicia el servidor de desarrollo en tu computadora:
    ```bash
    npm run start
    ```
4.  En la terminal aparecerá un **código QR**.
5.  **Abrir la app:**
    *   **En Android:** Abre la aplicación *Expo Go*, selecciona "Scan QR Code" y escanea el código QR de la terminal.
    *   **En iOS:** Abre la aplicación nativa de la *Cámara* de tu iPhone, escanea el código QR y presiona el enlace amarillo para abrirlo en *Expo Go*.

---

### 🖥️ Paso 4: Probar en un Emulador de Android (Virtual)

Para ejecutar un emulador en tu entorno Linux, necesitas configurar el SDK de Android:

#### 1. Instalar Android Studio y Configurar SDK
1. Descarga e instala **Android Studio** para Linux.
2. Abre Android Studio, ve a **SDK Manager** e instala:
    *   Android SDK (ej: API 34 o similar).
    *   Android SDK Platform-Tools.
3. Ve a **Virtual Device Manager** (Device Manager) y crea un emulador virtual (AVD) de tu preferencia (ej: Pixel 6).

#### 2. Configurar Variables de Entorno en Linux
Añade las siguientes rutas a tu archivo de configuración de terminal (generalmente `~/.bashrc` o `~/.zshrc`):

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
Aplica los cambios en tu terminal actual con `source ~/.bashrc` (o reabre la terminal).

#### 3. Lanzar el Emulador y la App
1. Abre e inicia tu dispositivo virtual desde el Device Manager de Android Studio.
2. Una vez que el emulador esté encendido y en la pantalla de inicio, ejecuta en la terminal de tu proyecto:
    ```bash
    npm run android
    ```
    *(O presiona la tecla `a` en la terminal interactiva donde ya esté corriendo `npm run start`).*
3. Expo instalará automáticamente *Expo Go* en el emulador y cargará tu aplicación.

---

## ⚡ Solución de Problemas Comunes (Troubleshooting)

### 🔴 Error: "Network Response Timed Out" o no conecta al backend
*   **Causa:** La IP en `src/config.ts` es incorrecta o el firewall de Linux está bloqueando la conexión.
*   **Solución:** 
    1. Verifica que tu teléfono y tu PC estén en la misma red Wi-Fi y que no estés en una red pública/corporativa con aislamiento de clientes.
    2. Si tienes un cortafuegos activo en Linux (como `ufw`), desactívalo temporalmente o permite el tráfico en los puertos correspondientes (`8000` para el backend, `8081` para el Metro Bundler de Expo):
        ```bash
        sudo ufw allow 8081/tcp
        sudo ufw allow 8000/tcp
        ```

### 🔴 Limpiar caché de Expo si hay errores raros
Si realizas cambios en dependencias o notas comportamientos extraños del compilador, detén la terminal y ejecuta:
```bash
npx expo start -c
```
*(La bandera `-c` limpia la caché de Metro Bundler).*