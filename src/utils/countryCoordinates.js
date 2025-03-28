const countryCoordinates = {
    // Amériques
    'Alaska': { center: [-149.4937, 64.2008], zoom: 4 }, // Coordonnées spécifiques pour l'Alaska
    'Hawai': { center: [-155.5828, 19.8968], zoom: 6 }, // Coordonnées spécifiques pour Hawaï
    'United States': { center: [-95.7129, 37.0902], zoom: 3 },
    'Canada': { center: [-106.3468, 56.1304], zoom: 3 },
    'Mexico': { center: [-102.5528, 23.6345], zoom: 4 },
    'Brazil': { center: [-51.9253, -14.2350], zoom: 3 },
    'Argentina': { center: [-63.6167, -38.4161], zoom: 4 },
    'Peru': { center: [-75.0152, -9.1900], zoom: 5 },
    'Colombia': { center: [-74.2973, 4.5709], zoom: 5 },
    'Chile': { center: [-71.5430, -35.6751], zoom: 4 },
    'Cuba': { center: [-77.7812, 21.5218], zoom: 6 },
    
    // Europe
    'United Kingdom': { center: [-3.4360, 55.3781], zoom: 5 },
    'France': { center: [2.2137, 46.2276], zoom: 5 },
    'Germany': { center: [10.4515, 51.1657], zoom: 5 },
    'Italy': { center: [12.5674, 41.8719], zoom: 5 },
    'Spain': { center: [-3.7492, 40.4637], zoom: 5 },
    'Portugal': { center: [-8.2245, 39.3999], zoom: 6 },
    'Greece': { center: [21.8243, 39.0742], zoom: 6 },
    'Switzerland': { center: [8.2275, 46.8182], zoom: 7 },
    'Netherlands': { center: [5.2913, 52.1326], zoom: 7 },
    'Belgium': { center: [4.4699, 50.5039], zoom: 7 },
    'Sweden': { center: [18.6435, 60.1282], zoom: 4 },
    'Norway': { center: [8.4689, 60.4720], zoom: 4 },
    'Denmark': { center: [9.5018, 56.2639], zoom: 6 },
    'Finland': { center: [25.7482, 61.9241], zoom: 5 },
    'Ireland': { center: [-8.2439, 53.4129], zoom: 6 },
    'Austria': { center: [14.5501, 47.5162], zoom: 6 },
    
    // Asie
    'China': { center: [104.1954, 35.8617], zoom: 3 },
    'Japan': { center: [138.2529, 36.2048], zoom: 5 },
    'South Korea': { center: [127.7669, 35.9078], zoom: 6 },
    'India': { center: [78.9629, 20.5937], zoom: 4 },
    'Thailand': { center: [100.9925, 15.8700], zoom: 5 },
    'Vietnam': { center: [108.2772, 14.0583], zoom: 5 },
    'Malaysia': { center: [101.9758, 4.2105], zoom: 6 },
    'Indonesia': { center: [113.9213, -0.7893], zoom: 4 },
    'Philippines': { center: [121.7740, 12.8797], zoom: 5 },
    'Singapore': { center: [103.8198, 1.3521], zoom: 10 },
    'UAE': { center: [54.3773, 23.4241], zoom: 6 },
    'Dubai': { center: [55.2708, 25.2048], zoom: 10 },
    'Saudi Arabia': { center: [45.0792, 23.8859], zoom: 5 },
    'Israel': { center: [34.8516, 31.0461], zoom: 7 },
    'Turkey': { center: [35.2433, 38.9637], zoom: 5 },
    
    // Afrique
    'Egypt': { center: [30.8025, 26.8206], zoom: 5 },
    'South Africa': { center: [22.9375, -30.5595], zoom: 5 },
    'Morocco': { center: [-7.0926, 31.7917], zoom: 5 },
    'Kenya': { center: [37.9062, 0.0236], zoom: 5 },
    'Tanzania': { center: [34.8888, -6.3690], zoom: 5 },
    'Nigeria': { center: [8.6753, 9.0820], zoom: 5 },
    
    // Océanie
    'Australia': { center: [133.7751, -25.2744], zoom: 3 },
    'New Zealand': { center: [172.8860, -40.9006], zoom: 5 },
    'Fiji': { center: [178.0650, -17.7134], zoom: 7 },
    
    // Coordonnées par défaut (monde entier)
    'default': { center: [0, 0], zoom: 1 }
  };
  
  export default countryCoordinates;