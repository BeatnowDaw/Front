
## Descripción de Archivos y Carpetas

### `.env`
Archivo de configuración de variables de entorno. Contiene las variables necesarias para la configuración del proyecto.

### `package.json`
Archivo de configuración de npm que lista las dependencias del proyecto.

### `src/App/App.tsx`
Archivo principal de la aplicación. Configura las rutas y componentes principales.

### `src/assets/`
Carpeta que contiene los recursos estáticos como imágenes.

### `src/components/`
Carpeta que contiene los componentes reutilizables de la aplicación.

### `src/Layout/Header/Header.tsx`
Componente de encabezado de la aplicación.

### `src/Model/`
Carpeta que contiene la configuración de Firebase y el singleton de usuario.

### `src/Screens/Login Page/LoginPage.tsx`
Componente de la página de inicio de sesión. Maneja la autenticación del usuario.

## Ejecución del Proyecto

1. Clonar el repositorio.
2. Instalar dependencias:
    ```sh
    npm install
    ```
3. Crear un archivo `.env` con las variables de entorno necesarias.
4. Iniciar la aplicación:
    ```sh
    npm start
    ```

## Uso de la Aplicación

### Inicio de Sesión
- **URL**: `/login`
- **Método**: `POST`
- **Body**:
    ```json
    {
      "username": "nombre_usuario",
      "password": "contraseña"
    }
    ```

### Registro de Usuario
- **URL**: `/register`
- **Método**: `POST`
- **Body**:
    ```json
    {
      "username": "nombre_usuario",
      "email": "correo@ejemplo.com",
      "password": "contraseña"
    }
    ```

### Ruta Protegida (Dashboard)
- **URL**: `/Dashboard`
- **Método**: `GET`
- **Headers**:
    ```json
    {
      "Authorization": "Bearer <token_jwt>"
    }
    ```

Esta documentación proporciona una visión general del proyecto y cómo interactuar con la aplicación.