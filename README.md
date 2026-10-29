# Sistema Institucional de Control - Bienes Tecnológicos, Redes y Ofimática
### Hospital Central Universitario Dr. Antonio María Pineda (HCUAMP)
**Departamento de Tecnología, Información y Comunicación (TIC)**

---

## 📌 Resumen Arquitectónico

El sistema está diseñado con una arquitectura desacoplada y de alto rendimiento:

1. **Frontend (Vercel / Web)**:
   - Interfaz web moderna, responsiva y adaptable a dispositivos móviles, tablets y ordenadores de escritorio.
   - Compresión client-side integrada (HTML5 Canvas) que optimiza las fotos capturadas con smartphones antes de enviarlas al servidor.
   - Caché local (`localStorage`) para renderizado instantáneo.
   - Exportación de auditorías a CSV compatible con Microsoft Excel (UTF-8 BOM).
   - Impresión optimizada de reportes institucionales.

2. **Backend & Base de Datos (Google Apps Script + Google Sheets)**:
   - **ID del Spreadsheet (BD)**: `1qEEyduhUlRvFNhdg-fJPxJAcQVOYHwNVWORoet5BqEE`
   - **URL del Web App (API)**: `https://script.google.com/macros/s/AKfycbyzY0V73VNkkrrHRwxCu_z2bSwmnEEDnEbjQwu81R4GYZLYHp3uo66vYgWDICAPinLR/exec`
   - Almacenamiento seguro de fotografías en Google Drive en la carpeta `Inventario_Fotografias_Bienes` con enlaces públicos directos.
   - Borrado lógico (*soft delete*) para trazabilidad de auditoría.

---

## 🗄️ Estructura de la Base de Datos (Google Sheets)

El script cuenta con una función de auto-inicialización (`inicializarBaseDeDatos()`) que genera las siguientes 3 hojas estructuradas con formato institucional:

### 1. Hoja `bienes` (Inventario de Bienes Tecnológicos)
| Columna | Nombre de Campo | Descripción |
| :---: | :--- | :--- |
| **A** | `ID` | Identificador único institucional (`BN-YYYYMMDD-HHmmss`) |
| **B** | `Fecha` | Marca temporal de registro |
| **C** | `Departamento` | Departamento o Servicio del HCUAMP |
| **D** | `Grupo` | Grupo del bien (Ej. 04) |
| **E** | `SubGrupo` | Subgrupo del bien (Ej. 13) |
| **F** | `Sección` | Sección o Identificación interna |
| **G** | `Nro. de Bien` | Nro. completo (BN, BE o BT + código) |
| **H** | `Descripción` | Denominación y detalle del bien |
| **I** | `Características` | Tipo de equipo tecnológico |
| **J** | `Modelo` | Modelo del equipo |
| **K** | `Color` | Color del equipo |
| **L** | `Serial` | Número de serie del fabricante |
| **M** | `Estado` | Bueno, Regular o Inoperativo |
| **N** | `URL` | Enlace directo a la fotografía en Google Drive |
| **O** | `Estatus` | Activo o Inactivo (Borrado lógico) |

### 2. Hoja `redes` (Infraestructura de Conectividad)
| Columna | Nombre de Campo | Descripción |
| :---: | :--- | :--- |
| **A** | `ID` | Identificador único (`RED-YYYYMMDD-HHmmss`) |
| **B** | `Modem (Cant)` | Cantidad de modems en el área |
| **C** | `Router (Cant)` | Cantidad de routers |
| **D** | `Switch (Cant)` | Cantidad de switches |
| **E** | `Punto de Acceso (Cant)` | Cantidad de Access Points |
| **F** | `Tipo de Cableado` | Cat5e, Cat6, Cat6A, Fibra Óptica, Inalámbrico |
| **G** | `Canalización` | Sí / No |
| **H** | `SSID Wi-Fi` | Nombre de la red inalámbrica |
| **I** | `Banda Wi-Fi` | 2.4 GHz, 5 GHz, Dual |
| **J** | `Proveedor` | Empresa de telecomunicaciones / enlace |
| **K** | `Velocidad` | Ancho de banda contratado |
| **L** | `Responsable de Pagos` | Área o persona encargada de la gestión |
| **M** | `Estatus` | Activo o Inactivo |

### 3. Hoja `cuestionario_ofimatica` (Diagnóstico Institucional)
| Columna | Nombre de Campo | Descripción |
| :---: | :--- | :--- |
| **A** | `Fecha / Hora` | Marca de tiempo de la evaluación |
| **B** | `Nombre Completo` | Nombre del funcionario evaluado |
| **C** | `Correo / Departamento` | Correo de contacto o área |
| **D - E**| `Word Frecuencia / Nivel` | Frecuencia de uso y nivel percibido |
| **F - G**| `Excel Frecuencia / Nivel` | Frecuencia de uso y nivel percibido |
| **H - I**| `Slides Frecuencia / Nivel` | Frecuencia de uso y nivel percibido |
| **J - K**| `Correo Frecuencia / Nivel` | Frecuencia de uso y nivel percibido |
| **L - M**| `Nube Frecuencia / Nivel` | Frecuencia de uso y nivel percibido |
| **N** | `Estatus` | Activo o Inactivo |

---

## 🚀 Despliegue en Vercel

El proyecto está 100% preparado con `vercel.json`, `package.json` e `index.html`.

### Opción 1: Despliegue Directo por CLI
1. Abre tu terminal en este directorio y ejecuta:
   ```bash
   npx vercel login
   ```
2. Despliega a producción con:
   ```bash
   npx vercel --prod
   ```

### Opción 2: Conectar con GitHub a Vercel
1. Sube este repositorio a tu cuenta de GitHub:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```
2. Entra en [vercel.com/new](https://vercel.com/new), importa el repositorio y pulsa **Deploy**.
   - No requiere configuración adicional de Build; Vercel detectará la aplicación estática optimizada de inmediato.

---

## ⚙️ Pasos Finales en Google Apps Script

Para asegurar que el Web App en `https://script.google.com/macros/s/AKfycbyzY0V73VNkkrrHRwxCu_z2bSwmnEEDnEbjQwu81R4GYZLYHp3uo66vYgWDICAPinLR/exec` aplique los cambios:

1. Abre el editor de **Google Apps Script** asociado al proyecto.
2. Copia todo el contenido del archivo [`Code.gs`](./Code.gs) y pégalo en el editor reemplazando el código existente.
3. En el menú desplegable de funciones, selecciona `inicializarBaseDeDatos` y haz clic en **Ejecutar** (Run).
   - Google te solicitará otorgar permisos para acceder a Google Sheets y Google Drive.
   - Una vez ejecutado, verás en el Spreadsheet `1qEEyduhUlRvFNhdg-fJPxJAcQVOYHwNVWORoet5BqEE` que las tres hojas (`bienes`, `redes` y `cuestionario_ofimatica`) han sido creadas con cabeceras en azul institucional.
4. Para publicar la versión activa del Web App:
   - Haz clic en **Implementar (Deploy)** > **Gestionar implementaciones (Manage deployments)**.
   - Haz clic en el icono del lápiz (**Editar**).
   - En **Versión**, selecciona **Nueva versión**.
   - Asegúrate de que en **Quién tiene acceso** esté seleccionado: **Cualquier usuario (Anyone)**.
   - Haz clic en **Implementar**.
