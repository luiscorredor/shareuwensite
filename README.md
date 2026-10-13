# shareU — configuración de Firebase

La interfaz incluye registro/inicio de sesión, carga de documentos, búsqueda y moderación administrativa. Los archivos subidos quedan privados en Firebase Storage; los documentos nuevos quedan en estado `pending` hasta que un administrador los apruebe.

## 1. Crear el proyecto Firebase
1. Entra a https://console.firebase.google.com/ y crea un proyecto.
2. En **Authentication → Sign-in method**, habilita **Email/Password**.
3. En **Firestore Database**, crea una base de datos en modo producción.
4. En **Storage**, habilita el bucket.
5. En **Project settings → Your apps**, registra una aplicación web y copia su configuración en `firebase-config.js`.
6. Reemplaza todos los valores `REEMPLAZAR_...`. No publiques credenciales privadas de cuentas de servicio.

## 2. Aplicar reglas
Copia `firestore.rules` en Firestore → Rules y `storage.rules` en Storage → Rules, luego publica ambas. Las reglas son parte esencial de la seguridad; no uses reglas abiertas como `allow read, write: if true`.

## 3. Dar acceso de administrador
1. Registra una cuenta desde la web.
2. En Firebase Console → Firestore → colección `users`, abre el documento cuyo ID es el UID de esa cuenta.
3. Cambia únicamente el campo `role` de `user` a `admin`.
4. Cierra sesión y vuelve a entrar. No existe registro público de administradores.

## 4. Ejecutar localmente
Por usar módulos JavaScript, abre el proyecto con un servidor estático (no con `file://`). Por ejemplo:
```bash
python3 -m http.server 5500
```
Luego abre http://localhost:5500. Agrega `localhost` y el dominio publicado en Authentication → Settings → Authorized domains.

## 5. Publicación
Puedes publicar la carpeta con GitHub Pages o Firebase Hosting. Configura el dominio autorizado en Firebase Authentication. El frontend usa los SDK oficiales de Firebase; no requiere guardar una contraseña de servidor en el repositorio.

## Modelo de datos
- `users/{uid}`: perfil y rol (`user` o `admin`).
- `documents/{id}`: metadatos, dueño, URL/ruta de Storage y estado (`pending`, `approved`, `rejected`).
- `documents/{uid}/{fileName}` en Storage: archivo privado.

**Importante:** el proyecto no quedará conectado a tu instancia real hasta que completes `firebase-config.js`, crees los servicios y publiques las reglas. No compartas contraseñas ni claves privadas.
