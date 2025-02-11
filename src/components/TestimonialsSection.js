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
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre principal */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
          Déjà 1 million voyageurs nous font confiance
        </h2>

        {/* Cartes de témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-[20px] sm:rounded-[30px] md:rounded-[40px] shadow-lg p-6 sm:p-8 flex flex-col">
              {/* Avatar et nom */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-[#9557fa] font-bold text-base sm:text-lg">{testimonial.name}</h3>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-[#fa9b3d] text-sm sm:text-base">★</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Commentaire */}
              <p className="text-gray-700 text-sm sm:text-base mb-4 flex-grow">
                "{testimonial.comment}"
              </p>

              {/* Détails du voyage */}
              <p className="text-xs sm:text-sm text-[#9557fa] mt-auto">
                {testimonial.trip}
              </p>
            </div>
          ))}
        </div>

        {/* Section statistiques */}
        <div>
          <h3 className="text-2xl sm:text-3xl text-[#fa9b3d] font-bold mb-6 sm:mb-8 text-center">
            Stella c'est :
          </h3>
          
          <div className="bg-[#9557fa] rounded-lg py-4 sm:py-6 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0 text-white">
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-bold">95%</span>
                <p className="text-sm sm:text-base">de voyages réussis</p>
              </div>
              <div className="text-center">
                <div>
                  <span className="text-3xl sm:text-4xl font-bold">10</span>
                  <span className="text-xl sm:text-2xl"> heures</span>
                </div>
                <p className="text-sm sm:text-base">de planification</p>
              </div>
              <div className="text-center">
                <div>
                  <span className="text-3xl sm:text-4xl font-bold">32</span>
                  <span className="text-xl sm:text-2xl"> pays</span>
                </div>
                <p className="text-sm sm:text-base">Leader dans</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;