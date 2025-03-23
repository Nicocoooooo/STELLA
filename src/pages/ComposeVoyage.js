import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import HotelCarousel from "../components/HotelCarousel"; // Assure-toi du bon chemin


function ComposeVoyage() {
  const [formId, setFormId] = useState(null);
  const [destination, setDestination] = useState(null);
  const [destinationId, setDestinationId] = useState(null);
  const [fullDescription, setFullDescription] = useState(null);
  const [infoPratiques, setInfoPratiques] = useState(null);
  const [santeEtSecurite, setSanteEtSecurite] = useState(null);
  const [formalite, setFormalite] = useState(null);
  const [budget, setBudget] = useState(null);
  const [gastronomie, setGastronomie] = useState(null);
  const [baniere, setBaniere] = useState(null);
  const [hotels, setHotels] = useState([]); // Tableau pour les hôtels
  const [activites, setActivites] = useState([]); // Tableau pour les activités
  const [lieux, setLieux] = useState([]); // Tableau pour les activités
  const [restaurants, setRestos] = useState([]); // Tableau pour les activités

  // Fonction pour mettre la première lettre en majuscule
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        // Étape 1 : Récupérer l'ID du formulaire et la destination (nom du pays)
        const { data: formData, error: formError } = await supabase
          .from('quiz_responses')
          .select('id, destination')
          .order('created_at', { ascending: false })  
          .limit(1);

        if (formError) throw formError;

        if (formData.length > 0) {
          const { id, destination } = formData[0];
          setFormId(id);

          const formattedDestination = capitalizeFirstLetter(destination);
          setDestination(formattedDestination);

          // Étape 2 : Récupérer l'ID de la destination
          const { data: destData, error: destError } = await supabase
            .from('destinations')
            .select('id')
            .eq('name', formattedDestination)
            .single();

          if (destError) throw destError;

          if (destData) {
            setDestinationId(destData.id);

            // Étape 3 : Récupérer toutes les données, y compris les hôtels et activités
            const { data: descData, error: descError } = await supabase
              .from('destinations_description')
              .select('full_description, info_pratiques, sante_et_securite, formalite, budget, gastronomie, baniere, hotels, activite, lieux, restaurant')
              .eq('destination_id', destData.id)
              .single();

            if (descError) throw descError;

            console.log("Data for hotels and activities:", descData);

            if (descData) {
              setFullDescription(descData.full_description);
              setInfoPratiques(descData.info_pratiques);
              setSanteEtSecurite(descData.sante_et_securite);
              setFormalite(descData.formalite); 
              setBudget(descData.budget);
              setGastronomie(descData.gastronomie); 
              setBaniere(descData.baniere);
              
              // Traitement des hôtels
              if (descData.hotels && descData.hotels.hotels && Array.isArray(descData.hotels.hotels)) {
                setHotels(descData.hotels.hotels);
                console.log("Setting hotels with data:", descData.hotels.hotels);
              } else {
                setHotels([]);
                console.log("Hotels data structure is not as expected:", descData.hotels);
              }
              
              // Traitement des activités
              if (descData.activite && descData.activite.activites && Array.isArray(descData.activite.activites)) {
                setActivites(descData.activite.activites);
                console.log("Setting activites with data:", descData.activite.activites);
              } else {
                setActivites([]);
                console.log("Activities data structure is not as expected:", descData.activite);
                console.log("Type of activite:", typeof descData.activite);
              }

              // Traitement des lieux
              if (descData.lieux && descData.lieux.lieux && Array.isArray(descData.lieux.lieux)) {
                setLieux(descData.lieux.lieux);
                console.log("Setting Lieux with data:", descData.lieux.lieux);
              } else {
                setLieux([]);
                console.log("Lieux data structure is not as expected:", descData.lieux);
                console.log("Type of Lieux:", typeof descData.lieux);
              }

              // Traitement des restos
              if (descData.restaurant && descData.restaurant.restaurants && Array.isArray(descData.restaurant.restaurants)) {
                setRestos(descData.restaurant.restaurants);
                console.log("Setting restos with data:", descData.restaurant.restaurants);
              } else {
                setRestos([]);
                console.log("restos data structure is not as expected:", descData.restaurant);
                console.log("Type of restos:", typeof descData.restaurant);
              }
            }
          }
        } else {
          console.warn('Aucune réponse trouvée dans quiz_responses');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchFormData();
  }, []);

  return (<div className="container mx-auto px-4 py-8">
    <h2 className="text-2xl font-bold mb-6">Découvrez les meilleurs hôtels</h2>
    
    {/* Utilisation du composant carrousel */}
    <HotelCarousel hotels={hotels} />
    <HotelCarousel hotels={lieux} />
    <HotelCarousel hotels={activites} />
    <HotelCarousel hotels={restaurants} />

  </div>);
};

export default ComposeVoyage;