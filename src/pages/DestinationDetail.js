import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Navigation, Syringe, Phone, FileText, CreditCard, Utensils, Clock } from 'lucide-react';
import Footer from '../components/Footer';



const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Données codées en dur pour chaque destination
  const destinationsData = {
    "hawaii": {
      name: "Hawaii",
      image: require('../assets/images/destinations/Hawai.webp'),
      description: "L'archipel d'Hawaii est un paradis tropical offrant des plages de sable blanc, des volcans majestueux et une culture polynésienne vibrante. Entre surf, randonnées et détente, chaque île a son propre caractère unique.",
      ideal_for: ["Couples", "Familles", "Amoureux de la nature"],
      timezone: "GMT-10 (HST)",
      language: "Anglais, Hawaïen",
      currency: "Dollar américain (USD)",
      voltage: "120V",
      temperature: "23-30°C toute l'année",
      best_period: "Avril à octobre",
      unmissable: "Volcan Kilauea, Waikiki Beach, Road to Hana, Pearl Harbor",
      health_safety: {
        transport: "Location de voiture recommandée, bus sur Oahu",
        vaccines: "Aucun vaccin spécifique requis",
        insurance: "Assurance voyage recommandée (coûts médicaux élevés)",
        emergency: "911"
      },
      formalities: {
        visa: "ESTA obligatoire (environ 14$ par personne)",
        passport: "Valide 6 mois après retour",
        documents: "Billet retour exigé",
        duration: "Jusqu'à 90 jours"
      },
      budget: {
        life_cost: "Budget routard : 100-150$/jour",
        comfort: "Budget confort : 200-300$/jour",
        luxury: "Budget luxe : 400$+/jour",
        payment: "Cartes de crédit largement acceptées"
      },
      gastronomy: {
        specialties: ["Poke Bowl (poisson cru mariné)", "Lomi-lomi (saumon)", "Kalua Pig (porc cuit en terre)", "Shave Ice (glace pilée)"],
        precautions: "Aucune précaution particulière",
        schedules: {
          breakfast: "6h-10h",
          lunch: "11h-14h",
          dinner: "17h-21h"
        }
      }
    },
    "perou": {
      name: "Pérou",
      image: require('../assets/images/destinations/Perou.png'),
      description: "Le Pérou, berceau de la civilisation inca, offre un mélange fascinant d'histoire ancienne, de paysages spectaculaires et de culture vibrante. Des mystérieuses lignes de Nazca au Machu Picchu emblématique, en passant par la forêt amazonienne luxuriante.",
      ideal_for: ["Amateurs d'histoire", "Randonneurs", "Photographes"],
      timezone: "GMT-5 (PET)",
      language: "Espagnol, Quechua, Aymara",
      currency: "Sol péruvien (PEN)",
      voltage: "220V",
      temperature: "10-28°C selon altitude et saison",
      best_period: "Mai à septembre (saison sèche)",
      unmissable: "Machu Picchu, Cusco, Vallée Sacrée, Lac Titicaca, Lignes de Nazca",
      health_safety: {
        transport: "Bus longue distance, trains touristiques, vols intérieurs",
        vaccines: "Fièvre jaune recommandée, Hépatite A et B",
        insurance: "Assurance voyage indispensable avec couverture altitude",
        emergency: "105 (police), 117 (ambulance)"
      },
      formalities: {
        visa: "Non requis jusqu'à 90 jours",
        passport: "Valide 6 mois après retour",
        documents: "Billet retour exigé",
        duration: "Jusqu'à 183 jours par an"
      },
      budget: {
        life_cost: "Budget routard : 30-40€/jour",
        comfort: "Budget confort : 60-100€/jour",
        luxury: "Budget luxe : 150€+/jour",
        payment: "Espèces privilégiées, CB dans les grandes villes"
      },
      gastronomy: {
        specialties: ["Ceviche (poisson cru mariné)", "Lomo Saltado (bœuf sauté)", "Cuy (cochon d'Inde)", "Pisco Sour (cocktail)"],
        precautions: "Éviter l'eau du robinet, préférer l'eau en bouteille",
        schedules: {
          breakfast: "6h-9h",
          lunch: "12h-14h",
          dinner: "19h-22h"
        }
      }
    },
    "alaska": {
      name: "Alaska",
      image: require('../assets/images/destinations/Alaska.png'),
      description: "L'Alaska, ultime frontière américaine, offre des paysages sauvages à couper le souffle. Entre glaciers majestueux, montagnes imposantes et faune exceptionnelle, c'est le paradis des amoureux de nature intacte et d'aventures en plein air.",
      ideal_for: ["Amoureux de nature", "Photographes", "Aventuriers"],
      timezone: "GMT-9 (AKST)",
      language: "Anglais, langues autochtones",
      currency: "Dollar américain (USD)",
      voltage: "120V",
      temperature: "-25°C à 18°C selon saison",
      best_period: "Mai à septembre (été)",
      unmissable: "Parc national Denali, Glacier Bay, Aurores boréales, Kenai Fjords",
      health_safety: {
        transport: "Location de voiture/4x4, trains panoramiques, hydravions",
        vaccines: "Aucun vaccin spécifique requis",
        insurance: "Assurance complète indispensable (évacuation incluse)",
        emergency: "911"
      },
      formalities: {
        visa: "ESTA obligatoire (environ 14$ par personne)",
        passport: "Valide 6 mois après retour",
        documents: "Billet retour exigé",
        duration: "Jusqu'à 90 jours"
      },
      budget: {
        life_cost: "Budget routard : 80-120$/jour",
        comfort: "Budget confort : 200-300$/jour",
        luxury: "Budget luxe : 400$+/jour",
        payment: "Cartes de crédit acceptées dans les zones urbaines"
      },
      gastronomy: {
        specialties: ["Saumon sauvage", "Crabe royal", "Élan", "Baies sauvages"],
        precautions: "Aucune précaution particulière",
        schedules: {
          breakfast: "6h-9h",
          lunch: "11h-14h",
          dinner: "17h-21h"
        }
      }
    },
    "chine": {
      name: "Chine",
      image: require('../assets/images/destinations/Chine.png'),
      description: "La Chine, empire du milieu, offre un contraste saisissant entre traditions millénaires et modernité fulgurante. Grande Muraille, cités impériales, rizières en terrasses et mégalopoles futuristes composent ce pays-continent aux multiples facettes.",
      ideal_for: ["Passionnés d'histoire", "Voyageurs culinaires", "Photographes"],
      timezone: "GMT+8 (CST)",
      language: "Mandarin (chinois), dialectes locaux",
      currency: "Yuan Renminbi (CNY)",
      voltage: "220V",
      temperature: "-10°C à 35°C selon région et saison",
      best_period: "Avril-Mai et Septembre-Octobre",
      unmissable: "Grande Muraille, Cité Interdite, Armée de terre cuite, Karsts de Guilin",
      health_safety: {
        transport: "Trains à grande vitesse, métros, taxis, vols intérieurs",
        vaccines: "Hépatite A et B, encéphalite japonaise recommandés",
        insurance: "Assurance santé obligatoire pour le visa",
        emergency: "110 (police), 120 (ambulance)"
      },
      formalities: {
        visa: "Obligatoire, à demander avant départ",
        passport: "Valide 6 mois après retour avec 2 pages vierges",
        documents: "Justificatif d'hébergement, itinéraire détaillé",
        duration: "30 à 90 jours selon visa"
      },
      budget: {
        life_cost: "Budget routard : 25-35€/jour",
        comfort: "Budget confort : 60-100€/jour",
        luxury: "Budget luxe : 200€+/jour",
        payment: "Espèces et applications (WeChat Pay, Alipay)"
      },
      gastronomy: {
        specialties: ["Canard laqué", "Hot Pot", "Dim Sum", "Nouilles Dan Dan"],
        precautions: "Éviter l'eau du robinet et les aliments crus",
        schedules: {
          breakfast: "7h-9h",
          lunch: "11h30-13h30",
          dinner: "17h30-20h30"
        }
      }
    },
    "dubai": {
      name: "Dubai",
      image: require('../assets/images/destinations/Dubai.jpg'),
      description: "Dubaï, joyau futuriste des Émirats arabes unis, incarne l'alliance du luxe et de la démesure. Entre gratte-ciels vertigineux, îles artificielles et centres commerciaux gigantesques, ce désert transformé offre une expérience unique entre tradition bédouine et modernité extravagante.",
      ideal_for: ["Amateurs de luxe", "Shoppers", "Familles"],
      timezone: "GMT+4 (GST)",
      language: "Arabe, Anglais",
      currency: "Dirham des Émirats arabes unis (AED)",
      voltage: "220V",
      temperature: "20-45°C selon saison",
      best_period: "Octobre à avril",
      unmissable: "Burj Khalifa, Palm Jumeirah, Dubai Mall, Desert Safari",
      health_safety: {
        transport: "Métro, taxis, VTC",
        vaccines: "Aucun vaccin spécifique requis",
        insurance: "Assurance voyage recommandée",
        emergency: "999 (police), 998 (ambulance)"
      },
      formalities: {
        visa: "Exemption pour plusieurs nationalités européennes",
        passport: "Valide 6 mois après retour",
        documents: "Billet retour exigé",
        duration: "30 à 90 jours selon nationalité"
      },
      budget: {
        life_cost: "Budget routard : 70-100€/jour",
        comfort: "Budget confort : 150-250€/jour",
        luxury: "Budget luxe : 400€+/jour",
        payment: "Cartes de crédit largement acceptées"
      },
      gastronomy: {
        specialties: ["Shawarma", "Hummus", "Al Machboos (riz épicé)", "Luqaimat (beignets)"],
        precautions: "Éviter de boire ou manger en public pendant le Ramadan",
        schedules: {
          breakfast: "6h-10h",
          lunch: "12h-15h",
          dinner: "19h-23h"
        }
      }
    },
    "singapour": {
      name: "Singapour",
      image: require('../assets/images/destinations/Singapour.png'),
      description: "Singapour, cité-État futuriste d'Asie du Sud-Est, allie harmonieusement ultramodernité et traditions multiculturelles. Cette métropole impeccable offre des jardins verticaux spectaculaires, une cuisine de rue renommée et une efficacité légendaire dans un environnement sûr et verdoyant.",
      ideal_for: ["City-breakers", "Foodies", "Familles"],
      timezone: "GMT+8 (SGT)",
      language: "Anglais, Mandarin, Malais, Tamil",
      currency: "Dollar singapourien (SGD)",
      voltage: "230V",
      temperature: "26-32°C toute l'année",
      best_period: "Février à avril (moins humide)",
      unmissable: "Gardens by the Bay, Marina Bay Sands, Sentosa Island, Hawker Centers",
      health_safety: {
        transport: "MRT (métro), bus, taxis",
        vaccines: "Aucun vaccin spécifique requis",
        insurance: "Assurance voyage recommandée",
        emergency: "999 (police), 995 (ambulance)"
      },
      formalities: {
        visa: "Exemption pour plusieurs nationalités européennes",
        passport: "Valide 6 mois après retour",
        documents: "Billet retour exigé",
        duration: "30 à 90 jours selon nationalité"
      },
      budget: {
        life_cost: "Budget routard : 50-80€/jour",
        comfort: "Budget confort : 120-200€/jour",
        luxury: "Budget luxe : 300€+/jour",
        payment: "Cartes de crédit largement acceptées"
      },
      gastronomy: {
        specialties: ["Chili Crab", "Chicken Rice", "Laksa", "Kaya Toast"],
        precautions: "Eau du robinet potable",
        schedules: {
          breakfast: "7h-10h",
          lunch: "11h30-14h",
          dinner: "18h-22h"
        }
      }
    },
    "canada": {
      name: "Canada",
      image: require('../assets/images/destinations/Canada.png'),
      description: "Le Canada, deuxième plus grand pays du monde, offre une nature grandiose et préservée. Des montagnes Rocheuses aux chutes du Niagara, en passant par les métropoles cosmopolites et les forêts d'érables emblématiques, ce pays multiculturel séduit par sa diversité et son hospitalité légendaire.",
      ideal_for: ["Amoureux de nature", "Familles", "Aventuriers"],
      timezone: "GMT-8 à GMT-3.5 selon provinces",
      language: "Anglais, Français",
      currency: "Dollar canadien (CAD)",
      voltage: "120V",
      temperature: "-30°C à 30°C selon région et saison",
      best_period: "Juin à septembre (été), Décembre à mars (sports d'hiver)",
      unmissable: "Parc national de Banff, Chutes du Niagara, Vieux-Québec, Toronto, Vancouver",
      health_safety: {
        transport: "Location de voiture, trains, vols intérieurs",
        vaccines: "Aucun vaccin spécifique requis",
        insurance: "Assurance voyage indispensable (coûts médicaux élevés)",
        emergency: "911"
      },
      formalities: {
        visa: "AVE obligatoire (environ 7$ par personne)",
        passport: "Valide pour la durée du séjour",
        documents: "Billet retour exigé",
        duration: "Jusqu'à 6 mois maximum"
      },
      budget: {
        life_cost: "Budget routard : 60-90€/jour",
        comfort: "Budget confort : 120-200€/jour",
        luxury: "Budget luxe : 300€+/jour",
        payment: "Cartes de crédit largement acceptées"
      },
      gastronomy: {
        specialties: ["Poutine", "Sirop d'érable", "Homard", "Tourtière"],
        precautions: "Aucune précaution particulière",
        schedules: {
          breakfast: "6h-10h",
          lunch: "11h30-13h30",
          dinner: "17h-21h"
        }
      }
    },
    "thailand": {
      name: "Thaïlande",
      image: require('../assets/images/destinations/Thailand.png'),
      description: "Les Philippines, archipel paradisiaque de plus de 7 600 îles, offre un cocktail enchanteur de plages de sable blanc, d'eaux cristallines et de culture vibrante. Entre les rizières en terrasses de Banaue classées à l'UNESCO, les spots de plongée réputés de Palawan, et l'emblématique station balnéaire de Boracay, chaque voyageur trouve son petit coin de paradis.",
      ideal_for: ["Plages", "Culture", "Food"],
      timezone: "GMT+7 (ICT)",
      language: "Thaï, Anglais (basique)",
      currency: "Baht thaïlandais (THB)",
      voltage: "220V",
      temperature: "25-35°C toute l'année",
      best_period: "Novembre à février (saison sèche)",
      unmissable: "Bangkok, Chiang Mai, Phuket, Koh Phi Phi, Ayutthaya",
      health_safety: {
        transport: "Tuk-tuks, taxis, trains, vols intérieurs, ferries",
        vaccines: "Hépatite A et B, typhoïde recommandés",
        insurance: "Assurance voyage indispensable",
        emergency: "191 (police), 1669 (ambulance)"
      },
      formalities: {
        visa: "Non requis jusqu'à 30 jours",
        passport: "Valide 6 mois après retour",
        documents: "Billet retour exigé",
        duration: "30 jours (extensible)"
      },
      budget: {
        life_cost: "Budget routard : 30-40€/jour",
        comfort: "Budget confort : 60-100€/jour",
        luxury: "Budget luxe : 150€+/jour",
        payment: "Espèces privilégiées, CB dans les grandes villes"
      },
      gastronomy: {
        specialties: ["Pad Thai (nouilles sautées)", "Tom Yum (soupe épicée)", "Som Tam (salade de papaye)", "Massaman Curry"],
        precautions: "Éviter l'eau du robinet, préférer l'eau en bouteille",
        schedules: {
          breakfast: "6h-8h",
          lunch: "11h-13h",
          dinner: "18h-22h"
        }
      }
    }
  };

  useEffect(() => {
    // Récupérer les données de la destination sélectionnée
    setLoading(true);
    // Simulation d'une requête API
    setTimeout(() => {
      const destinationId = id.toLowerCase();
      if (destinationsData[destinationId]) {
        setDestination(destinationsData[destinationId]);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Destination non trouvée</h2>
        <Link to="/dashboard" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={20} />
          Retour aux destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Bannière améliorée avec overlay plus stylisé */}
      <div className="relative h-[60vh] w-full">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex flex-col justify-end p-8 sm:p-12 md:p-16">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              Composez votre voyage
            </h1>
            <h2 className="text-accent text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              {destination.name}
            </h2>
          </div>
        </div>
        <Link 
          to="/dashboard" 
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/40 transition-all z-10"
        >
          <ArrowLeft size={24} />
        </Link>
      </div>

      {/* Contenu principal avec un style plus élaboré */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative -mt-16">
        {/* Section L'essentiel à savoir avec un style de carte */}
        <section className="mb-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-primary to-accent"></div>
          <div className="p-8">
            <h2 className="text-primary text-3xl font-bold mb-6 flex items-center">
              L'essentiel à savoir
            </h2>
            
            <div className="mb-8">
              <h3 className="font-semibold text-xl mb-4">Description générale</h3>
              <p className="text-gray-700 leading-relaxed">{destination.description}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium mb-3 text-primary">Idéal pour :</h4>
                <div className="flex gap-2 flex-wrap">
                  {destination.ideal_for.map((item, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">{item}</span>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium mb-3 text-primary">Décalage horaire :</h4>
                <p className="text-gray-700">{destination.timezone}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium mb-3 text-primary">Langue :</h4>
                <p className="text-gray-700">{destination.language}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium mb-3 text-primary">Devise :</h4>
                <p className="text-gray-700">{destination.currency}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium mb-3 text-primary">Voltage :</h4>
                <p className="text-gray-700">{destination.voltage}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium mb-3 text-primary">Température :</h4>
                <p className="text-gray-700">{destination.temperature}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium mb-3 text-primary">Meilleure période :</h4>
                <p className="text-gray-700">{destination.best_period}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl col-span-1 sm:col-span-2">
                <h4 className="font-medium mb-3 text-primary">Incontournables :</h4>
                <p className="text-gray-700">{destination.unmissable}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Santé & Sécurité et Formalités avec des icônes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-primary to-accent"></div>
            <div className="p-8">
              <h2 className="text-primary text-2xl font-bold mb-6 flex items-center">
                Santé & Sécurité
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Navigation className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-gray-800">Se déplacer :</h4>
                    <p className="text-gray-700">{destination.health_safety.transport}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Syringe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-gray-800">Vaccins :</h4>
                    <p className="text-gray-700">{destination.health_safety.vaccines}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-gray-800">Assurance :</h4>
                    <p className="text-gray-700">{destination.health_safety.insurance}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-gray-800">Numéro d'urgence :</h4>
                    <p className="text-gray-700">{destination.health_safety.emergency}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-primary to-accent"></div>
            <div className="p-8">
              <h2 className="text-primary text-2xl font-bold mb-6">Formalités</h2>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-1 text-gray-800">Visa :</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{destination.formalities.visa}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1 text-gray-800">Passeport :</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{destination.formalities.passport}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1 text-gray-800">Documents :</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{destination.formalities.documents}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1 text-gray-800">Durée max :</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{destination.formalities.duration}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Section Budget et Gastronomie avec un design plus ludique */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-primary to-accent"></div>
            <div className="p-8">
              <h2 className="text-primary text-2xl font-bold mb-6 flex items-center">
                <CreditCard className="mr-2 w-6 h-6" />
                Budget
              </h2>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1 text-gray-800">Coût de la vie :</h4>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">Routard</span>
                    <p className="text-gray-700">{destination.budget.life_cost}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1 text-gray-800">Budget confort :</h4>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-sm">Confort</span>
                    <p className="text-gray-700">{destination.budget.comfort}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1 text-gray-800">Budget luxe :</h4>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-sm">Luxe</span>
                    <p className="text-gray-700">{destination.budget.luxury}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1 text-gray-800">Paiement :</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{destination.budget.payment}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-primary to-accent"></div>
            <div className="p-8">
              <h2 className="text-primary text-2xl font-bold mb-6 flex items-center">
                <Utensils className="mr-2 w-6 h-6" />
                Gastronomie
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-gray-800">Spécialités :</h4>
                  <ul className="space-y-2">
                    {destination.gastronomy.specialties.map((item, index) => (
                      <li key={index} className="text-gray-700 bg-gray-50 p-3 rounded-lg flex items-center">
                        <span className="bg-accent/10 text-accent mr-2 w-5 h-5 rounded-full flex items-center justify-center text-sm">{index + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1 text-gray-800">Précautions :</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{destination.gastronomy.precautions}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-gray-800 flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> Horaires :
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Petit-déjeuner :</span>
                      <span className="font-medium">{destination.gastronomy.schedules.breakfast}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Déjeuner :</span>
                      <span className="font-medium">{destination.gastronomy.schedules.lunch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dîner :</span>
                      <span className="font-medium">{destination.gastronomy.schedules.dinner}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bouton Composer mon voyage avec un design plus attrayant */}
        <div className="flex justify-center mb-8">
          <Link to="/quiz" className="px-10 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-outfit text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden group">
            <span className="relative z-10">Composer mon voyage</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DestinationDetail;