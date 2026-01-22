const fetch = require('node-fetch');

class CadastreAPI {
  constructor() {
    // No API key needed - using free French government APIs
    this.cadastreBaseUrl = 'https://apicarto.ign.fr/api/cadastre';
  }

  async geocodeAddress(address) {
    try {
      // Using FREE French government geocoding API
      const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}&limit=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const coords = feature.geometry.coordinates;
        return {
          lat: coords[1],
          lon: coords[0],
          formatted: feature.properties.label
        };
      }
      throw new Error('Geocoding failed: Address not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  createCirclePolygon(lon, lat, radiusMeters = 6) {
    // 6m radius captures only directly adjacent parcels (inspired by HTML-CARTO)
    const points = [];
    const numPoints = 32;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const dx = (radiusMeters / 111000) * Math.cos(angle) / Math.cos(lat * Math.PI / 180);
      const dy = (radiusMeters / 111000) * Math.sin(angle);
      points.push([lon + dx, lat + dy]);
    }
    points.push(points[0]);
    
    return {
      type: "Polygon",
      coordinates: [points]
    };
  }

  async getParcellesInRadius(lat, lon, radiusMeters = 6) {
    try {
      const polygon = this.createCirclePolygon(lon, lat, radiusMeters);
      const geomParam = encodeURIComponent(JSON.stringify(polygon));
      const url = `${this.cadastreBaseUrl}/parcelle?geom=${geomParam}`;
      
      const response = await fetch(url);
      const data = await response.json();

      const parcelles = [];
      if (data.features && data.features.length > 0) {
        data.features.forEach(feature => {
          const p = feature.properties;
          parcelles.push({
            idu: p.idu,
            prefix: p.code_arr || '000',
            section: p.section || '',
            numero: p.numero || '',
            superficie: Math.round(p.contenance) || 0,
            commune: p.nom_com || '',
            codeCommune: p.code_com || '',
            codeInsee: p.code_insee || ''
          });
        });
      }
      
      return parcelles;
    } catch (error) {
      console.error('Cadastre radius search error:', error);
      throw error;
    }
  }

  async getParcelleFromCoords(lat, lon) {
    try {
      const url = `${this.cadastreBaseUrl}/parcelle?geom=${encodeURIComponent(JSON.stringify({type:"Point",coordinates:[lon,lat]}))}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const parcelle = data.features[0].properties;
        return {
          prefix: parcelle.code_arr || '000',
          section: parcelle.section || '',
          numero: parcelle.numero || '',
          superficie: Math.round(parcelle.contenance) || 0,
          commune: parcelle.nom_com || '',
          codeCommune: parcelle.code_com || '',
          codePostal: parcelle.code_postal || ''
        };
      }
      
      throw new Error('Aucune parcelle cadastrale trouvée');
    } catch (error) {
      console.error('Cadastre API error:', error);
      throw error;
    }
  }

  async getParcelleFromAddress(address, searchRadius = 6) {
    try {
      console.log('🔍 Géolocalisation:', address);
      const coords = await this.geocodeAddress(address);
      console.log('📍 Coordonnées:', coords);
      
      // Search in radius to find all parcels (6m = adjacent parcels only)
      const parcelles = await this.getParcellesInRadius(coords.lat, coords.lon, searchRadius);
      console.log(`🏠 ${parcelles.length} parcelle(s) trouvée(s) dans un rayon de ${searchRadius}m`);
      
      if (parcelles.length === 0) {
        throw new Error('Aucune parcelle trouvée dans le rayon spécifié');
      }
      
      return {
        coords: coords,
        parcelles: parcelles,
        count: parcelles.length
      };
    } catch (error) {
      console.error('❌ Erreur getParcelleFromAddress:', error);
      throw error;
    }
  }
}

module.exports = CadastreAPI;
