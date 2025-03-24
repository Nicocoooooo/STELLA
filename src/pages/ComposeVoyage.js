import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import HotelCarousel from "../components/HotelCarousel"; // Assure-toi du bon chemin

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
              .select('full_description, info_pratiques, sante_et_securite, formalite, budget, gastronomie, banner, hotels, activite, lieux, restaurant')
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
              setBanner(descData.banner);

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

  return (
    <div>
      {/* Bannière pleine largeur sans marges */}
      {banner && ( 
  <div className="w-full h-screen/3 overflow-hidden relative"> 
    <img
      src={banner}
      alt={`Banner ${destination}`}
      className="w-full h-full object-cover object-center"
    />
  </div>
)}

{/* Section L'essentiel à savoir */}
<div className="rounded-2xl p-4 bg-red-200 shadow-lg w-[90%] mx-auto mb-10 mt-10">




        <h1 className="text-[#9557fa] text-4xl text-left font-bold mb-4">L'essentiel à savoir</h1>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-left mb-3">Description générale</h2>
          <p className="text-sm text-left leading-relaxed mb-6">
            {fullDescription || "Non disponible"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Informations pratiques */}
          <div className="p-4 bg-blue-200">

            <h3 className="text-lg text-left font-bold mb-3">Informations pratiques :</h3>

            {infoPratiques ? (
              <>
                <div className="mb-1">
  <div className="flex flex-wrap items-start">
    {/* <p className="text-purple-600 bg-blue-200 font-bold text-sm mr-1 whitespace-nowrap">Idéal pour :</p>
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


          <div className="p-4 bg-blue-200">
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

          <div className="p-4 bg-blue-200">
            <h3 className="text-lg text-left font-bold mb-3">Budget :</h3>

            {budget ? (
              <>
                <div className="mb-1">
  <p className="text-purple-600 text-left font-bold text-sm mb-1">Coût de la vie :</p>
  <ul className="list-none pl-5">
    <li className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-purple-600 leading-tight">
      <span className="text-sm">
        Budget routard : {budget.budget_routard_par_jour || "Non disponible"} /jour
      </span>
    </li>
    <li className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-purple-600 leading-tight">
      <span className="text-sm">Budget confort : {budget.budget_confort_par_jour || "Non disponible"} /jour</span>
    </li>
    <li className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-purple-600 leading-tight">
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
          <div className="p-4 bg-blue-200">
            <h3 className="text-lg text-left font-bold mb-3">Gastronomie :</h3>

            {gastronomie ? (
              <>
                {/* Spécialités */}
                <div className="mb-1">
  <p className="text-purple-600 text-left font-bold text-sm mb-1">Spécialités :</p>
  <ul className="list-none pl-5">
    {gastronomie.specialites?.map((specialite, index) => (
      <li key={index} className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-purple-600 leading-tight">
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
  <p className="text-purple-600 text-left font-bold text-sm mb-1">Horaires :</p>
  {gastronomie.horaires_repas ? (
    <ul className="list-none pl-5">
      {gastronomie.horaires_repas.split(',').map((horaire, index) => (
        <li key={index} className="relative pl-7 text-xl text-left before:content-['•'] before:absolute before:left-0 before:text-purple-600 leading-tight">
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
      <div className="container mx-auto bg-green-400 flex">
  {/* Partie gauche (2/3 de la largeur) */}
  <div className="w-2/3 p-4">
    <h2 className="text-2xl font-bold mb-6">Découvrez les meilleurs hôtels</h2>

    {/* Utilisation du composant carrousel */}
    <HotelCarousel hotels={hotels} />
    <HotelCarousel hotels={lieux} />
    <HotelCarousel hotels={activites} />
    <HotelCarousel hotels={restaurants} />
  </div>

  {/* Partie droite (1/3 de la largeur) */}
  <div className="w-1/3">
    {/* Rien à mettre ici pour l'instant */}
  </div>
</div>
</div>

  );
};

export default ComposeVoyage;