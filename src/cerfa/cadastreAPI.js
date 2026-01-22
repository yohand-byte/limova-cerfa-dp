const fetch = require('node-fetch');

class CadastreAPI {
  constructor() {
    // No API key needed - using free French government APIs
    this.cadastreBaseUrl = 'https://apicarto.ign.fr/api/cadastre';
  }

  async geocodeAddress(address) {
    try {
      // Using FREE French government geocoding API instead of Google Maps
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

  async getParcelleFromCoords(lat, lon) {
    try {
      const url = `${this.cadastreBaseUrl}/parcelle?geom={\"type\":\"Point\",\"coordinates\":[${lon},${lat}]}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const parcelle = data.features[0].properties;
        return {
          prefix: parcelle.code_arr || '000',
          section: parcelle.section || '',
          numero: parcelle.numero || '',
          superficie: Math.round(parcelle.contenance) || 0,
          commune: parcelle.commune || '',
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

  async getParcelleFromAddress(address) {
    try {
      console.log('🔍 Géolocalisation:', address);
      const coords = await this.geocodeAddress(address);
      console.log('📍 Coordonnées:', coords);
      const parcelle = await this.getParcelleFromCoords(coords.lat, coords.lon);
      console.log('🏠 Parcelle:', parcelle);
      
      return {
        ...parcelle,
        coords: coords
      };
    } catch (error) {
      console.error('❌ Erreur getParcelleFromAddress:', error);
      throw error;
    }
  }
}

module.exports = CadastreAPI;
