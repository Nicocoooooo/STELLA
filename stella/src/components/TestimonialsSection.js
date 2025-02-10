import React from 'react';
import SophieImg from '../assets/images/Femme.png';
import ThomasImg from '../assets/images/Homme.png';
import AlixJamesImg from '../assets/images/Couple.png';

const testimonials = [
  {
    name: 'Sophie, 34 ans',
    avatar: SophieImg,
    rating: 5,
    comment: 'Une véritable révélation pour organiser nos vacances en famille ! J\'ai planifié notre séjour de 2 semaines au Japon sans stress. L\'application m\'a suggéré des activités adaptées aux enfants et des restaurants family-friendly. Le partage du planning avec mon mari nous a permis de collaborer facilement pour l\'organisation. Un vrai gain de temps - ce qui m\'aurait pris des semaines n\'a nécessité que quelques heures. Je recommande vivement !',
    trip: 'Voyage : 2 semaines au Japon - Famille de 4 personnes'
  },
  {
    name: 'Thomas, 27 ans',
    avatar: ThomasImg,
    rating: 4,
    comment: 'Parfait pour gérer notre road trip entre amis ! Nous étions 6 à partir en Italie et la synchronisation des agendas était un vrai casse-tête avant. L\'app nous a permis de voter pour les activités, de répartir les réservations et de garder tous nos documents au même endroit. Le plus ? Les recommandations de restaurants locaux qu\'on n\'aurait jamais trouvés autrement. Notre voyage était un succès total !',
    trip: 'Voyage : Road trip de 10 jours en Italie - Groupe de 6 amis'
  },
  {
    name: 'Alix et James, 25 ans',
    avatar: AlixJamesImg,
    rating: 5,
    comment: 'Enfin une application qui comprend les vrais besoins des voyageurs ! Pour notre mini-aventure de 5 jours, je voulais organiser un week-end surprise à Amsterdam. L\'application m\'a aidée à créer un itinéraire parfait avec un mélange d\'activités culturelles et de moments romantiques. La fonction budget m\'a permis de tout gérer sans dépassement. Un grand merci pour avoir rendu ce moment si spécial !',
    trip: 'Voyage : City-break de 3 jours à Amsterdam - Couple'
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Titre principal */}
        <h2 className="text-4xl font-bold text-center mb-16">
          Déjà 1 million voyageurs nous font confiance
        </h2>

        {/* Cartes de témoignages */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-[40px] shadow-lg p-8 flex flex-col">
              {/* Avatar et nom */}
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-[#9557fa] font-bold text-lg">{testimonial.name}</h3>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-[#fa9b3d]">★</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Commentaire */}
              <p className="text-gray-700 mb-4 flex-grow">
                "{testimonial.comment}"
              </p>

              {/* Détails du voyage */}
              <p className="text-sm text-[#9557fa] mt-auto">
                {testimonial.trip}
              </p>
            </div>
          ))}
        </div>

        {/* Section statistiques */}
        <div>
          <h3 className="text-3xl text-[#fa9b3d] font-bold mb-8 text-center">
            Stella c'est :
          </h3>
          
          <div className="bg-[#9557fa] rounded-lg py-6 px-8 flex justify-between items-center text-white">
            <div className="text-center">
              <span className="text-4xl font-bold">95%</span>
              <p>de voyages réussis</p>
            </div>
            <div className="text-center">
              <div>
                <span className="text-4xl font-bold">10</span>
                <span className="text-2xl"> heures</span>
              </div>
              <p>de planification</p>
            </div>
            <div className="text-center">
              <div>
                <span className="text-4xl font-bold">32</span>
                <span className="text-2xl"> pays</span>
              </div>
              <p>Leader dans</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;