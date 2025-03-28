import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import HotelCarousel from "../components/HotelCarousel";
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import TravelSelectionSection from '../components/TravelSelectionSection';
import MultiDestinationsMap from '../components/MultiDestinationsMap'; // Ajuster le chemin d'importation selon votre structure

function ComposeVoyage() {
  const [formId, setFormId] = useState(null);
  const [destination, setDestination] = useState(null);
  const [destinationId, setDestinationId] = useState(null);
  const [fullDescription, setFullDescription] = useState(null);
  const [infoPratiques, setInfoPratiques] = useState([]);
  const [santeEtSecurite, setSanteEtSecurite] = useState(null);
  const [formalite, setFormalite] = useState(null);
  const [budget, setBudget] = useState(null);
  const [gastronomie, setGastronomie] = useState(null);
  const [banner, setBanner] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [activites, setActivites] = useState([]);
  const [lieux, setLieux] = useState([]);
  const [restaurants, setRestos] = useState([]);
  const [userId, setUserId] = useState(null);

  

  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState({
    hotels: [],
    lieux: [],
    activites: [],
    restaurants: []
  });

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleAddItem = (item, type) => {
    // Vérifier si l'élément existe déjà
    const isDuplicate = selectedItems[type].some(
      selectedItem => selectedItem.place_id === item.place_id
    );

    if (!isDuplicate) {
      setSelectedItems(prev => {
        const updatedItems = {
          ...prev,
          [type]: [...prev[type], item]
        };

        console.log("🟢 Objet `selectedItems` mis à jour :", updatedItems);
        return updatedItems;
      });
    } else {
      console.log(`${type.slice(0, -1)} déjà ajouté`);
    }
  };

  const handleRemoveItem = (placeId, type) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.place_id !== placeId)
    }));
  };

  const handleSaveDestination = async () => {
    try {
      // Validate that we have all required data
      
      
      if (!formId || !destinationId || !userId) {
        console.error("Missing required data for saving destination");
        return;
      }

      // Prepare the data to be saved
      const savedDestinationData = {
        user_id: userId || null,
      destination_id: destinationId || null,
      form_id: formId || null,
      hotels: selectedItems.hotels.length > 0 
    ? selectedItems.hotels.map(hotel => ({
        place_id: hotel.place_id,
        name: hotel.name,
        price: hotel.prix, // Changement ici
        photos: [hotel.photo], // Transformation en tableau de photos
        description: "", // Ajout d'un champ description vide
        rating: hotel.rating,
        location: {
          address: hotel.address,
          coordinates: null // Vous pouvez ajouter les coordonnées si disponibles
        },
        tags: [] // Vous pouvez ajouter des tags si nécessaire
      }))
    : null,
      lieux: selectedItems.lieux.length > 0 
        ? selectedItems.lieux.map(lieu => ({
          place_id: lieu.place_id,
          name: lieu.name,
          price: lieu.prix, // Changement ici
          photos: [lieu.photo], // Transformation en tableau de photos
          description: "", // Ajout d'un champ description vide
          rating: lieu.rating,
          location: {
            address: lieu.address,
            coordinates: null // Vous pouvez ajouter les coordonnées si disponibles
          },
          tags: [] // Vous pouvez ajouter des tags si nécessaire
        }))
      : null,
      activites: selectedItems.activites.length > 0 
        ? selectedItems.activites.map(activite => ({
          place_id: activite.place_id,
          name: activite.name,
          price: activite.prix, // Changement ici
          photos: [activite.photo], // Transformation en tableau de photos
          description: "", // Ajout d'un champ description vide
          rating: activite.rating,
          location: {
            address: activite.address,
            coordinates: null // Vous pouvez ajouter les coordonnées si disponibles
          },
          tags: [] // Vous pouvez ajouter des tags si nécessaire
        }))
      : null,
      restaurants: selectedItems.restaurants.length > 0 
        ? selectedItems.restaurants.map(restaurant => ({
          place_id: restaurant.place_id,
          name: restaurant.name,
          price: restaurant.prix, // Changement ici
          photos: [restaurant.photo], // Transformation en tableau de photos
          description: "", // Ajout d'un champ description vide
          rating: restaurant.rating,
          location: {
            address: restaurant.address,
            coordinates: null // Vous pouvez ajouter les coordonnées si disponibles
          },
          tags: [] // Vous pouvez ajouter des tags si nécessaire
        }))
      : null,
        created_at: new Date().toISOString()
    };

    console.log("🟢 User :", userId);

      // Insert into saved_destinations table
      const { data, error } = await supabase
      .from('saved_destinations')
      .insert([savedDestinationData])
      .select();

      if (error) {
        console.error("Error saving destination:", error);
        // Optionally show an error message to the user
        return;
      }

      // Navigate to the next page or show success message
      console.log("Destination saved successfully:", data);
      navigate('/PlanningPage1');

    } catch (error) {
      console.error("Unexpected error saving destination:", error);
    }
  };

  useEffect(() => {
    
    const fetchFormData = async () => {
      try {
        console.log("🟢 Début de la récupération des données");

        
        // Stocker l'ID utilisateur dans le state

        const { data: { user }, error: authError } = await supabase.auth.getUser();

let userId;
if (user && user.id) {
    userId = user.id;  // Utilise l'ID de l'utilisateur connecté
} else {
    userId = "65c55e51-915b-41b1-9bba-b6d241b193aa"; // Valeur en dur si l'utilisateur n'est pas connecté
}

setUserId(userId);

// Étape 1 : Récupérer l'ID du formulaire et la destination
const { data: formData, error: formError } = await supabase
    .from('quiz_responses')
    .select('id, destination, user_id')
    .eq('user_id', userId)  // Utilisation de l'ID déterminé
    .order('created_at', { ascending: false })
    .limit(1);

if (formError) {
    console.error("Erreur lors de la récupération du formulaire :", formError.message);
} else {
    console.log("Formulaire récupéré :", formData);
}

        if (!formData || formData.length === 0) {
          console.warn("⚠️ Aucune réponse trouvée dans quiz_responses");
          return;
        }

        const { id, destination: rawDestination, user_id } = formData[0];
        console.log("🔍 Données du formulaire récupérées:", { id, rawDestination, user_id });

        // Formatage de la destination
        const formattedDestination = capitalizeFirstLetter(rawDestination);

        console.log("🌍 Destination formatée:", formattedDestination);

        // Étape 2 : Récupérer l'ID de la destination
        const { data: destData, error: destError } = await supabase
          .from('destinations')
          .select('id')
          .eq('name', formattedDestination)
          .single();

        if (destError) {
          console.error("❌ Erreur lors de la récupération de l'ID de destination:", destError);
          console.log("🕵️ Destinations disponibles (vérification):");
          const { data: allDestinations } = await supabase.from('destinations').select('name');
          console.log(allDestinations);
          return;
        }

        if (!destData) {
          console.warn(`⚠️ Aucune destination trouvée pour ${formattedDestination}`);
          return;
        }

        const destinationId = destData.id;
        console.log("🆔 ID de destination récupéré:", destinationId);

        // Étape 3 : Récupérer toutes les données
        const { data: descData, error: descError } = await supabase
          .from('destinations_description')
          .select('*')
          .eq('destination_id', destinationId)
          .single();

        if (descError) {
          console.error("❌ Erreur lors de la récupération de la description:", descError);
          return;
        }

        if (!descData) {
          console.warn("⚠️ Aucune donnée de description trouvée");
          return;
        }

        console.log("📦 Données complètes récupérées:", descData);

        // Mise à jour des états
        setFormId(id);
        setUserId(user_id);
        setDestination(formattedDestination);
        setDestinationId(destinationId);
        setFullDescription(descData.full_description);
        setInfoPratiques(descData.info_pratiques || {});
        setSanteEtSecurite(descData.sante_et_securite || {});
        setFormalite(descData.formalite || {});
        setBudget(descData.budget || {});
        setGastronomie(descData.gastronomie || {});
        setBanner(descData.banner);

        // Vérification et définition des données auxiliaires
        const logAndSetArray = (data, key, setterFunction) => {
          console.log(`🔍 Vérification ${key}:`, data);
          if (data && Array.isArray(data)) {
            setterFunction(data);
          } else {
            console.warn(`⚠️ ${key} n'est pas un tableau valide`);
            setterFunction([]);
          }
        };

        logAndSetArray(descData.hotels?.hotels, 'Hotels', setHotels);
        logAndSetArray(descData.activite?.activites, 'Activités', setActivites);
        logAndSetArray(descData.lieux?.lieux, 'Lieux', setLieux);
        logAndSetArray(descData.restaurant?.restaurants, 'Restaurants', setRestos);

      } catch (error) {
        console.error("❌ Erreur globale lors de la récupération des données:", error);
      }
    };
    fetchFormData();
  }, []);

  // Le reste du code reste identique...
  return (

    <>
    {/* Header - Responsive */}
    <header className="py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 flex justify-between items-center">
        <Link to="/">
          <img src={Logo} alt="Stella" className="h-6 sm:h-8 md:h-10" />
        </Link>
        <div className="flex items-center">
          <Link to="/profile" className="text-black hover:text-[#9557fa] transition-colors text-sm sm:text-base">
            Mon Profil
          </Link>
        </div>
      </header>
    <main>
    <div>
      {/* Bannière pleine largeur sans marges */}
      {banner && (
  <div className="relative w-full h-screen/3 overflow-hidden">
    <img
      src={banner}
      alt={`Banner ${destination}`}
      className="w-full h-full object-cover object-center"
    />
    <div className="absolute rounded-2xl top-1/2 left-[10%] backdrop-blur-lg px-3 py-1 transform -translate-y-1/2 text-center">
      <p className=" text-white text-2xl font-semibold">Composez votre voyage à</p>
      <p className="text-4xl text-left font-bold text-[#FA9B3D]">{destination}</p>
    </div>
  </div>
)}


      {/* Section L'essentiel à savoir */}
      <div className="rounded-2xl p-4 shadow-lg w-[90%] mx-auto mb-10 mt-10">




        <h1 className="text-[#9557fa] text-4xl text-left font-bold mb-4">L'essentiel à savoir</h1>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-left mb-3">Description générale</h2>
          <p className="text-sm text-left leading-relaxed mb-6">
            {fullDescription || "Non disponible"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Informations pratiques */}
          <div className="p-4">

            <h3 className="text-lg text-left font-bold mb-3">Informations pratiques :</h3>

            {infoPratiques ? (
              <>
                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    {/* <p className="text-[#9557fa] bg-blue-200 font-bold text-sm mr-1 whitespace-nowrap">Idéal pour :</p>
                      <p className="text-sm bg-red-200 break-words w-full">{infoPratiques.ideal_pour?.join(", ") || "Non disponible"}</p> */}
                    <p className="text-sm text-left break-words"><span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Idéal pour : </span>{infoPratiques.ideal_pour?.join(", ") || "Non disponible"}</p>
                  </div>
                </div>






                <div className="mb-1">
                  <div className="flex flex-wrap items-start">

                    <p className="text-sm text-left break-words"><span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Décalage horaire :</span>{infoPratiques.decalage_horaire || "Non disponible"}</p>
                  </div>
                </div>

                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    <p className="text-sm text-left break-words">
                      <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Langues :</span>
                      {infoPratiques.langues?.join(", ") || "Non disponible"}
                    </p>
                  </div>
                </div>


                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    <p className="text-sm text-left break-words">
                      <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Devise :</span>
                      {infoPratiques.devises || "Non disponible"}
                    </p>
                  </div>
                </div>


                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    <p className="text-sm text-left break-words">
                      <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Voltage :</span>
                      {infoPratiques.voltage || "Non disponible"}
                    </p>
                  </div>
                </div>


                <div className="mb-1">
                  <p className="text-[#9557fa] text-left font-bold text-sm mb-1">Températures :</p>
                  <ul className="list-none pl-5">
                    <li className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-[#9557fa] leading-tight">
                      <span className="text-sm">
                        Été : {infoPratiques.temperatures?.ete || "Non disponible"}
                      </span>
                    </li>
                    <li className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-[#9557fa] leading-tight">
                      <span className="text-sm">
                        Hiver :{infoPratiques.temperatures?.hiver || "Non disponible"}
                      </span>
                    </li>
                    <li className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-[#9557fa] leading-tight">
                      <span className="text-sm">
                        Automne : {infoPratiques.temperatures?.automne || "Non disponible"}
                      </span>
                    </li>
                    <li className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-[#9557fa] leading-tight">
                      <span className="text-sm">
                        Printemps : {infoPratiques.temperatures?.printemps || "Non disponible"}
                      </span>
                    </li>
                  </ul>
                </div>


                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    <p className="text-sm text-left break-words">
                      <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Meilleure période :</span>
                      {infoPratiques.meilleure_periode || "Non disponible"}
                    </p>
                  </div>
                </div>


                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    <p className="text-sm text-left break-words">
                      <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Incontournables :</span>
                      {infoPratiques.incontournables?.join(", ") || "Non disponible"}
                    </p>
                  </div>
                </div>

              </>
            ) : (
              <p className="text-sm text-gray-500">Chargement des informations...</p>
            )}
          </div>


          <div className="p-4">
            <div className="border-gray-200">
              <h3 className="text-lg text-left font-bold mb-3">Santé & Sécurité :</h3>

              {santeEtSecurite ? (
                <>
                  <div className="mb-1">
                    <div className="flex flex-wrap items-start">
                      <p className="text-sm text-left break-words">
                        <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Se déplacer :</span>
                        {santeEtSecurite.se_deplacer?.join(", ") || "Non disponible"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-1">
                    <div className="flex flex-wrap items-start">
                      <p className="text-sm text-left break-words">
                        <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Vaccins :</span>
                        {santeEtSecurite.vaccin?.join(", ") || "Non disponible"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-1">
                    <div className="flex flex-wrap items-start">
                      <p className="text-sm text-left break-words">
                        <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Assurance :</span>
                        {santeEtSecurite.assurance?.join(", ") || "Non disponible"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-1">
                    <div className="flex flex-wrap items-start">
                      <p className="text-sm text-left break-words">
                        <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Numéro d'urgence :</span>
                        {santeEtSecurite.numero_urgence || "Non disponible"}
                      </p>
                    </div>
                  </div>

                </>
              ) : (
                <p className="text-sm text-gray-500">Chargement des informations...</p>
              )}
            </div>

            <div className="my-4"></div>

            <h3 className="text-lg text-left font-bold mb-3">Formalités</h3>

            {formalite ? (
              <>
                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    <p className="text-sm text-left break-words">
                      <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Visa :</span>
                      {formalite.visa || "Non disponible"}
                    </p>
                  </div>
                </div>

                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    <p className="text-sm text-left break-words">
                      <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Passeport :</span>
                      {formalite.passeport || "Non disponible"}
                    </p>
                  </div>
                </div>

                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    <p className="text-sm text-left break-words">
                      <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Documents :</span>
                      {formalite.documents?.length ? (
                        formalite.documents.join(", ")
                      ) : (
                        "Non disponible"
                      )}
                    </p>
                  </div>
                </div>

                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    <p className="text-sm text-left break-words">
                      <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Durée max :</span>
                      {formalite.duree_max || "Non disponible"}
                    </p>
                  </div>
                </div>

              </>
            ) : (
              <p className="text-sm text-gray-500">Chargement des informations...</p>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg text-left font-bold mb-3">Budget :</h3>

            {budget ? (
              <>
                <div className="mb-1">
                  <p className="text-[#9557fa] text-left font-bold text-sm mb-1">Coût de la vie :</p>
                  <ul className="list-none pl-5">
                    <li className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-[#9557fa] leading-tight">
                      <span className="text-sm">
                        Budget routard : {budget.budget_routard_par_jour || "Non disponible"} /jour
                      </span>
                    </li>
                    <li className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-[#9557fa] leading-tight">
                      <span className="text-sm">Budget confort : {budget.budget_confort_par_jour || "Non disponible"} /jour</span>
                    </li>
                    <li className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-[#9557fa] leading-tight">
                      <span className="text-sm">Budget luxe : {budget.budget_luxe_par_jour || "Non disponible"} /jour</span>
                    </li>
                  </ul>
                </div>



                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    <p className="text-sm text-left break-words">
                      <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Paiement :</span>
                      {budget.mode_de_paiement?.length ? (
                        budget.mode_de_paiement.join(", ")
                      ) : (
                        "Non disponible"
                      )}
                    </p>
                  </div>
                </div>

              </>
            ) : (
              <p className="text-sm text-gray-500">Chargement des informations...</p>
            )}
          </div>

          {/* Gastronomie */}
          <div className="p-4">
            <h3 className="text-lg text-left font-bold mb-3">Gastronomie :</h3>

            {gastronomie ? (
              <>
                {/* Spécialités */}
                <div className="mb-1">
                  <p className="text-[#9557fa] text-left font-bold text-sm mb-1">Spécialités :</p>
                  <ul className="list-none pl-5">
                    {gastronomie.specialites?.map((specialite, index) => (
                      <li key={index} className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-[#9557fa] leading-tight">
                        <span className="text-sm">{specialite}</span>
                      </li>
                    )) || <p className="text-sm">Non disponible</p>}
                  </ul>
                </div>

                {/* Précautions */}
                <div className="mb-1">
                  <div className="flex flex-wrap items-start">
                    <p className="text-sm text-left break-words">
                      <span className="text-[#9557fa] font-bold text-sm mr-1 whitespace-nowrap">Précautions :</span>
                      {gastronomie.precautions?.join(", ") || "Non disponible"}
                    </p>
                  </div>
                </div>



                {/* Horaires de repas */}

                <div className="mb-1">
                  <p className="text-[#9557fa] text-left font-bold text-sm mb-1">Horaires :</p>
                  {gastronomie.horaires_repas ? (
                    <ul className="list-none pl-5">
                      {gastronomie.horaires_repas.split(',').map((horaire, index) => (
                        <li key={index} className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-[#9557fa] leading-tight">
                          <span className="text-sm">{horaire.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">Non disponible</p>
                  )}
                </div>


              </>
            ) : (
              <p className="text-sm text-gray-500">Chargement des informations...</p>
            )}
          </div>

        </div>
      </div>

      {/* Contenu avec le padding habituel */}
      <div className="rounded-2xl p-4 shadow-lg w-[90%] mx-auto mb-10 mt-10">
        <div className="flex">
          {/* Partie gauche (2/3 de la largeur) */}
          <div className="w-2/3">
            <h1 className="text-[#9557fa] text-4xl text-left -mt-4 -mb-4 pl-[10%] font-bold">Lieux</h1>
            <HotelCarousel
              hotels={lieux}
              onAddHotel={handleAddItem}
              onRemoveHotel={handleRemoveItem}
              type="lieux"
              pays={destination}
            />

            <h1 className="text-[#9557fa] text-4xl -mt-4 -mb-4 text-left pl-[10%] font-bold">Hotels</h1>
            <HotelCarousel
              hotels={hotels}
              onAddHotel={handleAddItem}
              onRemoveHotel={handleRemoveItem}
              type="hotels"
              pays={destination}
            />

            <h1 className="text-[#9557fa] text-4xl -mt-4 -mb-4 text-left pl-[10%] font-bold">Activites</h1>
            <HotelCarousel
              hotels={activites}
              onAddHotel={handleAddItem}
              onRemoveHotel={handleRemoveItem}
              type="activites"
              pays={destination}
            />

            <h1 className="text-[#9557fa] text-4xl -mt-4 -mb-4 text-left pl-[10%] font-bold">Restaurants</h1>
            <HotelCarousel
              hotels={restaurants}
              onAddHotel={handleAddItem}
              onRemoveHotel={handleRemoveItem}
              type="restaurants"
              pays={destination}
            />
          </div>

          {/* Partie droite (1/3 de la largeur) */}
          <div className="w-1/3 flex flex-col space-y-4">
            {/* Div 1 de la partie droite (haut) */}
            {/* Div 1 de la partie droite (haut) - Carte des destinations */}
            <div className="flex-1 bg-white p-1 ml-5 mt-10 rounded-lg bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] shadow-sm flex items-center justify-center">
            <div className="p-6 rounded-xl bg-white w-full h-full">
            <div className="flex-1 bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] h-full p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="text-center bg-white/30 backdrop-blur-xl p-4 rounded-lg">
  <h3 className="text-2xl font-bold text-[#9557fa] mb-2">Arrive Prochainement !</h3>
  <p className="text-gray-600">Notre carte interactive sera bientôt disponible</p>
</div>
    </div>
      </div>
      </div>
  

            {/* Div 2 de la partie droite (bas) */}
            <div className="p-1 rounded-xl ml-5 bg-gradient-to-r from-[#9557fa] to-[#fa9b3d]">
            <div className="p-6 rounded-xl bg-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Mon carnet de Voyage</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedItems).map(([type, items]) => (
                  <div
                    key={type}
                    className="bg-white shadow-md rounded-lg p-4 min-h-[20vh] max-h-[20vh] overflow-hidden"
                  >
                    <h4 className="text-xl font-semibold mb-1 capitalize text-[#9557fa]">
                      Mes {type}
                    </h4>
                    {items.length > 0 ? (
                      <div className="mb-0">
                      <ul className="list-none pl-0 space-y-0">
                        {items.slice(0, 3).map(item => (
                          <li
                            key={item.place_id}
                            className="relative pl-7 text-left before:content-['•'] before:absolute before:left-0 before:text-[#9557fa] leading-none"
                          >
                            <span className="text-xs">
                              {item.name}
                            </span>
                          </li>
                        ))}
                        {items.length > 3 && (
                          <li
                            key="ellipsis"
                            className="relative pl-7 text-left before:content-['•'] before:absolute before:left-0 before:text-[#9557fa] leading-none"
                          >
                            <span className="text-xs">...</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    ) : (
                      <p className="text-gray-500 italic">Aucun élément ajouté</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </div>
        <button 
        onClick={handleSaveDestination}
        className="bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-6 py-2 mt-5 pt-4 pb-4 rounded-full text-sm"
      >
        Pret au Décollage !!
      </button>
      </div>

    </div>
    </main>
    <Footer />

    </>

  );
};

export default ComposeVoyage;