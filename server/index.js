import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint para obtener configuración de tokens (seguro)
app.get('/api/config', (_req, res) => {
  res.json({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ''
  });
});

// Endpoint de ejemplo para obtener ubicaciones personalizadas
app.get('/api/locations', (_req, res) => {
  res.json([
    {
      id: 1,
      name: 'Icesi Universidad',
      lat: 3.3421,
      lng: -76.5308,
      type: 'university',
      description: 'Universidad Icesi - Cali, Colombia'
    },
    {
      id: 2,
      name: 'Torre de Cali',
      lat: 3.4372,
      lng: -76.5225,
      type: 'landmark',
      description: 'Edificio emblemático de Cali'
    },
    {
      id: 3,
      name: 'Parque del Perro',
      lat: 3.3778,
      lng: -76.5330,
      type: 'park',
      description: 'Zona gastronómica y recreativa'
    },
    {
      id: 4,
      name: 'Cristo Rey',
      lat: 3.4212,
      lng: -76.5562,
      type: 'monument',
      description: 'Monumento icónico de Cali'
    },
    {
      id: 5,
      name: 'Zoológico de Cali',
      lat: 3.4448,
      lng: -76.5372,
      type: 'zoo',
      description: 'Zoológico de Cali'
    }
  ]);
});

// Endpoint para obtener zonas/polígonos
app.get('/api/zones', (_req, res) => {
  res.json([
    {
      id: 1,
      name: 'Centro Histórico',
      coordinates: [
        [3.4516, -76.5319],
        [3.4516, -76.5250],
        [3.4380, -76.5250],
        [3.4380, -76.5319]
      ],
      color: '#FF6B6B',
      description: 'Centro histórico de Cali'
    },
    {
      id: 2,
      name: 'Zona Universitaria',
      coordinates: [
        [3.3500, -76.5350],
        [3.3500, -76.5250],
        [3.3350, -76.5250],
        [3.3350, -76.5350]
      ],
      color: '#4ECDC4',
      description: 'Área universitaria'
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
