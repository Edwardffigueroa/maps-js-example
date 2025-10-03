# Maps Example

Aplicación de ejemplo que integra múltiples proveedores de mapas con funcionalidades avanzadas.

## Características

- **Múltiples proveedores de mapas**:
  - OpenStreetMap
  - Google Maps Roadmap
  - Google Maps Satellite
  - Google Maps Hybrid
  - Google Maps Terrain

- **Funcionalidades**:
  - Marcadores personalizables con iconos
  - Popups informativos
  - Zonas/polígonos con colores
  - API REST para ubicaciones y zonas
  - Interfaz interactiva moderna

## Instalación

```bash
# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
# Editar .env y agregar tu Google Maps API Key
```

## Configuración

### OpenStreetMap
OpenStreetMap funciona sin necesidad de configuración adicional.

### Google Maps (Opcional)
Para usar Google Maps, necesitas una API Key:

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un proyecto nuevo o seleccionar uno existente
3. Habilitar la API "Maps JavaScript API"
4. Crear credenciales (API Key)
5. Agregar la API Key en el archivo `.env`:

```
GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

**Nota**: Google Maps ofrece $200 USD mensuales de crédito gratuito, suficiente para desarrollo y pruebas.

## Uso

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

La aplicación estará disponible en `http://localhost:3001`

## Estructura del Proyecto

```
maps-example/
├── server/
│   └── index.js          # Servidor Express con API REST
├── public/
│   ├── index.html        # Interfaz HTML
│   ├── script.js         # Lógica del mapa con Leaflet.js
│   └── styles.css        # Estilos
├── .env.example          # Variables de entorno de ejemplo
├── package.json          # Dependencias
└── README.md             # Documentación
```

## API Endpoints

- `GET /api/config` - Obtener configuración (Google Maps API Key)
- `GET /api/locations` - Obtener ubicaciones predefinidas
- `GET /api/zones` - Obtener zonas/polígonos

## Tecnologías

- **Backend**: Node.js, Express
- **Frontend**: Leaflet.js, JavaScript vanilla
- **Mapas**: OpenStreetMap, Google Maps
- **Plugins**: Leaflet.GridLayer.GoogleMutant (integración de Google Maps con Leaflet)
- **Estilos**: CSS3 moderno

## Funcionalidades del Frontend

1. **Cambio de mapa base**: Selecciona entre diferentes estilos de mapas
2. **Cargar ubicaciones**: Muestra marcadores predefinidos desde el servidor
3. **Cargar zonas**: Muestra polígonos/áreas desde el servidor
4. **Agregar marcador personalizado**: Crea marcadores en posiciones aleatorias
5. **Limpiar mapa**: Elimina todos los marcadores y zonas
6. **Panel de información**: Muestra detalles al hacer clic en elementos del mapa

## Personalización

Puedes modificar las ubicaciones y zonas editando los endpoints en `server/index.js`:

- Agregar más ubicaciones en `/api/locations`
- Agregar más zonas en `/api/zones`
- Personalizar iconos en `public/script.js`
