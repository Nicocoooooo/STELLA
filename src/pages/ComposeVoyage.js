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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-purple-600 text-4xl font-bold mb-4">L'essentiel à savoir</h1>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Description générale</h2>
          <p className="text-sm leading-relaxed mb-6">
            {fullDescription || "Les Philippines, archipel paradisiaque de plus de 7 600 îles, offre un cocktail enchanteur de plages de sable blanc, d'eaux cristallines et de culture vibrante. Entre les rizières en terrasses de Banaue classées à l'UNESCO, les spots de plongée mondialement réputés de Palawan, et l'emblématique station balnéaire de Boracay, chaque voyageur trouve son petit coin de paradis.\nLe pays séduit par ses paysages à couper le souffle : littoraux turquoise, volcans majestueux, forêts tropicales luxuriantes et fonds marins exceptionnels où nagent les requins-baleines. La chaleur légendaire des Philippins, leur cuisine savoureuse mêlant influences asiatiques et hispaniques, et les nombreuses fêtes traditionnelles ajoutent une dimension culturelle unique à l'expérience."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Informations pratiques */}
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Informations pratiques :</h3>

            {infoPratiques ? (
              <>
                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Idéal pour :</p>
                  <p className="text-sm">{infoPratiques.ideal_pour?.join(", ") || "Non disponible"}</p>
                </div>

                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Décalage horaire :</p>
                  <p className="text-sm">{infoPratiques.decalage_horaire || "Non disponible"}</p>
                </div>

                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Langues :</p>
                  <p className="text-sm">{infoPratiques.langues?.join(", ") || "Non disponible"}</p>
                </div>

                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Devise :</p>
                  <p className="text-sm">{infoPratiques.devises || "Non disponible"}</p>
                </div>

                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Voltage :</p>
                  <p className="text-sm">{infoPratiques.voltage || "Non disponible"}</p>
                </div>

                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Températures :</p>
                  <p className="text-sm">
                    <strong>Été :</strong> {infoPratiques.temperatures?.ete || "Non disponible"}<br />
                    <strong>Hiver :</strong> {infoPratiques.temperatures?.hiver || "Non disponible"}<br />
                    <strong>Automne :</strong> {infoPratiques.temperatures?.automne || "Non disponible"}<br />
                    <strong>Printemps :</strong> {infoPratiques.temperatures?.printemps || "Non disponible"}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Meilleure période :</p>
                  <p className="text-sm">{infoPratiques.meilleure_periode || "Non disponible"}</p>
                </div>

                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Incontournables :</p>
                  <p className="text-sm">{infoPratiques.incontournables?.join(", ") || "Non disponible"}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Chargement des informations...</p>
            )}
          </div>


          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <div className="border-gray-200">
            <h3 className="text-lg font-bold mb-4">Santé & Sécurité :</h3>

            {santeEtSecurite ? (
              <>
                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Se déplacer :</p>
                  <p className="text-sm">{santeEtSecurite.se_deplacer?.join(", ") || "Non disponible"}</p>
                </div>

                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Vaccins :</p>
                  <p className="text-sm">{santeEtSecurite.vaccin?.join(", ") || "Non disponible"}</p>
                </div>

                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Assurance :</p>
                  <p className="text-sm">{santeEtSecurite.assurance?.join(", ") || "Non disponible"}</p>
                </div>

                <div className="mb-3">
                  <p className="text-purple-600 font-bold text-sm mb-1">Numéro d'urgence :</p>
                  <p className="text-sm">{santeEtSecurite.numero_urgence || "Non disponible"}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Chargement des informations...</p>
            )}
            </div>

            <div className="border-t border-gray-200 my-4"></div>

<h3 className="text-lg font-bold mb-4">Formalités</h3>

{formalite ? (
  <>
    <div className="mb-3">
      <p className="text-purple-600 font-bold text-sm mb-1">Visa :</p>
      <p className="text-sm">{formalite.visa || "Non disponible"}</p>
    </div>
    
    <div className="mb-3">
      <p className="text-purple-600 font-bold text-sm mb-1">Passeport :</p>
      <p className="text-sm">{formalite.passeport || "Non disponible"}</p>
    </div>

    <div className="mb-3">
      <p className="text-purple-600 font-bold text-sm mb-1">Documents :</p>
      {formalite.documents?.length ? (
        <ul className="text-sm list-disc pl-5">
          {formalite.documents.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm">Non disponible</p>
      )}
    </div>

    <div className="mb-3">
      <p className="text-purple-600 font-bold text-sm mb-1">Durée max :</p>
      <p className="text-sm">{formalite.duree_max || "Non disponible"}</p>
    </div>
  </>
) : (
  <>
    <div className="mb-3">
      <p className="text-purple-600 font-bold text-sm mb-1">Visa :</p>
      <p className="text-sm">Non requis jusqu'à 30 jours</p>
    </div>
    
    <div className="mb-3">
      <p className="text-purple-600 font-bold text-sm mb-1">Passeport :</p>
      <p className="text-sm">Valide 6 mois après retour</p>
    </div>

    <div className="mb-3">
      <p className="text-purple-600 font-bold text-sm mb-1">Documents :</p>
      <p className="text-sm">Billet retour exigé</p>
    </div>

    <div className="mb-3">
      <p className="text-purple-600 font-bold text-sm mb-1">Durée max :</p>
      <p className="text-sm">30 jours (extensible)</p>
    </div>
  </>
)}
</div>

<div className="bg-gray-50 rounded-lg p-4 shadow-sm">
  <h3 className="text-lg font-bold mb-4">Budget :</h3>

  {budget ? (
    <>
      <div className="mb-3">
        <p className="text-purple-600 font-bold text-sm mb-1">Coût de la vie :</p>
        <ul className="list-none pl-4">
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">
            Budget routard : {budget.budget_routard_par_jour || "Non disponible"} /jour
          </li>
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">
            Budget confort : {budget.budget_confort_par_jour || "Non disponible"} /jour
          </li>
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">
            Budget luxe : {budget.budget_luxe_par_jour || "Non disponible"} /jour
          </li>
        </ul>
      </div>

      <div className="mb-3">
        <p className="text-purple-600 font-bold text-sm mb-1">Paiement :</p>
        {budget.mode_de_paiement?.length ? (
          <ul className="list-disc pl-5 text-sm">
            {budget.mode_de_paiement.map((mode, index) => (
              <li key={index}>{mode}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">Non disponible</p>
        )}
      </div>
    </>
  ) : (
    <>
      <div className="mb-3">
        <p className="text-purple-600 font-bold text-sm mb-1">Coût de la vie :</p>
        <ul className="list-none pl-4">
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">
            Budget routard : 30-40€/jour
          </li>
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">
            Budget confort : 60-100€/jour
          </li>
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">
            Budget luxe : 150€+/jour
          </li>
        </ul>
      </div>

      <div className="mb-3">
        <p className="text-purple-600 font-bold text-sm mb-1">Paiement :</p>
        <p className="text-sm">Espèces privilégiées, CB dans les grandes villes</p>
      </div>
    </>
  )}
</div>

          {/* Gastronomie */}
<div className="bg-gray-50 rounded-lg p-4 shadow-sm">
  <h3 className="text-lg font-bold mb-4">Gastronomie :</h3>

  {gastronomie ? (
    <>
      {/* Spécialités */}
      <div className="mb-3">
        <p className="text-purple-600 font-bold text-sm mb-1">Spécialités :</p>
        <ul className="list-none pl-4">
          {gastronomie.specialites?.map((specialite, index) => (
            <li key={index} className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">
              {specialite}
            </li>
          ))}
        </ul>
      </div>

      {/* Précautions */}
      <div className="mb-3">
        <p className="text-purple-600 font-bold text-sm mb-1">Précautions :</p>
        <ul className="list-none pl-4">
          {gastronomie.precautions?.map((precaution, index) => (
            <li key={index} className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">
              {precaution}
            </li>
          ))}
        </ul>
      </div>

      {/* Horaires de repas */}
      <div className="mb-3">
        <p className="text-purple-600 font-bold text-sm mb-1">Horaires :</p>
        <p className="text-sm">{gastronomie.horaires_repas}</p>
      </div>
    </>
  ) : (
    <>
      {/* Spécialités par défaut */}
      <div className="mb-3">
        <p className="text-purple-600 font-bold text-sm mb-1">Spécialités :</p>
        <ul className="list-none pl-4">
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">Adobo (viande marinée)</li>
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">Lechon (cochon grillé)</li>
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">Sinigang (soupe aigre)</li>
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">Pancit (nouilles sautées)</li>
        </ul>
      </div>

      {/* Précautions par défaut */}
      <div className="mb-3">
        <p className="text-purple-600 font-bold text-sm mb-1">Précautions :</p>
        <p className="text-sm">Éviter l'eau du robinet, préférer l'eau en bouteille</p>
      </div>

      {/* Horaires par défaut */}
      <div className="mb-3">
        <p className="text-purple-600 font-bold text-sm mb-1">Horaires :</p>
        <ul className="list-none pl-4">
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">Petit-déjeuner : 6h-8h</li>
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">Déjeuner : 11h-13h</li>
          <li className="relative pl-3 mb-1 text-sm before:content-['•'] before:absolute before:left-0 before:text-purple-600">Dîner : 18h-23h</li>
        </ul>
      </div>
    </>
  )}
</div>

        </div>
      </div>

      {/* Contenu avec le padding habituel */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Découvrez les meilleurs hôtels</h2>

        {/* Utilisation du composant carrousel */}
        <HotelCarousel hotels={hotels} />
        <HotelCarousel hotels={lieux} />
        <HotelCarousel hotels={activites} />
        <HotelCarousel hotels={restaurants} />
      </div>
    </div>
  );
};

export default ComposeVoyage;