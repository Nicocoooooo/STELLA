import React from 'react';
import HotelCarousel from '../components/HotelCarousel';

const HotelsPage = () => {
  // Exemple de données d'hôtels
  const hotels = [
      {
        "name": "hipstercity",
        "prix": "50€ - 100€",
        "type": "hotels",
        "photo": "https://gmexrdmzzvuoovpddrby.supabase.co/storage/v1/object/sign/hotel-singapour/hotel_singapour_1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJob3RlbC1zaW5nYXBvdXIvaG90ZWxfc2luZ2Fwb3VyXzEuanBnIiwiaWF0IjoxNzQyNDkwMjE5LCJleHAiOjMxNTUzMTA5NTQyMTl9.nBAAGlwuHQdwyCcmDAMTuQ89NuOJm8pvFyYR3Iq07PM",
        "rating": 4.3,
        "address": "9 Circular Rd, Singapore 049365",
        "place_id": "ChIJZ4S0QQoZ2jERrQFEantcSOw"
      },
      {
        "name": "Wink @ Mosque Street",
        "prix": "35€ - 70€",
        "type": "hotels",
        "photo": "https://gmexrdmzzvuoovpddrby.supabase.co/storage/v1/object/sign/hotel-singapour/hotel_singapour_2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJob3RlbC1zaW5nYXBvdXIvaG90ZWxfc2luZ2Fwb3VyXzIuanBnIiwiaWF0IjoxNzQyNDkwMjI4LCJleHAiOjMxNTUzMTA5NTQyMjh9.JRNzBpROZf9lP6CGcAH_Lgb_LSUH96QSm5phsSyk19s",
        "rating": 4.2,
        "address": "Mosque St, #8A, Singapore 059488",
        "place_id": "ChIJhRfsUHMZ2jERk4TeSNwDH8w"
      },
      {
        "name": "The Bohemian",
        "prix": "35€ - 70€",
        "type": "hotels",
        "photo": "https://gmexrdmzzvuoovpddrby.supabase.co/storage/v1/object/sign/hotel-singapour/hotel_singapour_3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJob3RlbC1zaW5nYXBvdXIvaG90ZWxfc2luZ2Fwb3VyXzMuanBnIiwiaWF0IjoxNzQyNDkwMjQ5LCJleHAiOjMxNTUzMTA5NTQyNDl9.zuyoiYSEjQKwZ751uz6p6ca-ox3VwtqiVbm__3LgC9o",
        "rating": 4.3,
        "address": "40 Mosque St, Singapore 059518",
        "place_id": "ChIJ8zaesgwZ2jERuXipCiacK1A"
      },
      {
        "name": "ibis budget Singapore Crystal",
        "prix": "70€ - 120€",
        "type": "hotels",
        "photo": "https://gmexrdmzzvuoovpddrby.supabase.co/storage/v1/object/sign/hotel-singapour/hotel_singapour_4.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJob3RlbC1zaW5nYXBvdXIvaG90ZWxfc2luZ2Fwb3VyXzQuanBnIiwiaWF0IjoxNzQyNDkwMjY2LCJleHAiOjMxNTUzMTA5NTQyNjZ9.M0jXoKpkQA6dv5YiDkmFu9yMg4Jg0UBadfn4LBiR0u4",
        "rating": 3.9,
        "address": "50 Lor 18 Geylang, Singapore 398824",
        "place_id": "ChIJqXXaxTkY2jER0RQwHKHaST8"
      },
      {
        "name": "Grand Hyatt Singapore",
        "prix": "200€ - 300€",
        "type": "hotels",
        "photo": "https://gmexrdmzzvuoovpddrby.supabase.co/storage/v1/object/sign/hotel-singapour/hotel_singapour_5.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJob3RlbC1zaW5nYXBvdXIvaG90ZWxfc2luZ2Fwb3VyXzUuanBlZyIsImlhdCI6MTc0MjQ5MDI4MywiZXhwIjozMTU1MzEwOTU0MjgzfQ.zNqDWhXCrtcxafW1cZQB2Klncko8VvRwDxRlxS3dVE4",
        "rating": 4.5,
        "address": "10 Scotts Rd, Singapore 228211",
        "place_id": "ChIJq0Qrde0Z2jERcHFh2aaynck"
      },
      {
        "name": "CUBE - Social Boutique Capsule Hotel @ Boat Quay",
        "prix": "50€ - 90€",
        "type": "hotels",
        "photo": "https://gmexrdmzzvuoovpddrby.supabase.co/storage/v1/object/sign/hotel-singapour/hotel_singapour_6.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJob3RlbC1zaW5nYXBvdXIvaG90ZWxfc2luZ2Fwb3VyXzYuanBlZyIsImlhdCI6MTc0MjQ5MDI5OSwiZXhwIjozMTU1MzEwOTU0Mjk5fQ.4UUqmUCQD4hbyQlT4Dv2imUPAI2BWGIIyO4yWk34W24",
        "rating": 4.6,
        "address": "70, 71, 72 Boat Quay, Level 2, 3, Singapore 049859",
        "place_id": "ChIJoe-u13IZ2jERUhXAirBOTZg"
      },
      {
        "name": "Galaxy Pods Capsule Hotel (Chinatown)",
        "prix": "50€ - 85€",
        "type": "hotels",
        "photo": "https://gmexrdmzzvuoovpddrby.supabase.co/storage/v1/object/sign/hotel-singapour/hotel_singapour_7.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJob3RlbC1zaW5nYXBvdXIvaG90ZWxfc2luZ2Fwb3VyXzcuanBnIiwiaWF0IjoxNzQyNDkwMzA4LCJleHAiOjMxNTUzMTA5NTQzMDh9.84Ipi8sJzhXHA5rQt50n7rFv8f7vi6w1fO1ICVdmVjs",
        "rating": 4,
        "address": "27 Mosque St, Singapore 059505",
        "place_id": "ChIJb8vmsAwZ2jERi38fKF0P_rE"
      },
      {
        "name": "PARKROYAL COLLECTION Pickering",
        "prix": "180€ - 250€",
        "type": "hotels",
        "photo": "https://gmexrdmzzvuoovpddrby.supabase.co/storage/v1/object/sign/hotel-singapour/hotel_singapour_8.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJob3RlbC1zaW5nYXBvdXIvaG90ZWxfc2luZ2Fwb3VyXzguanBnIiwiaWF0IjoxNzQyNDkwMzE4LCJleHAiOjMxNTUzMTA5NTQzMTh9.K4BKW885XGZgEDw0XmY-prKqHQxWE4X3h2ak3s7USDI",
        "rating": 4.5,
        "address": "3 Upper Pickering St, Singapore 058289",
        "place_id": "ChIJo8cvPgsZ2jERzUp0v52SdI0"
      },
      {
        "name": "Pullman Singapore Orchard",
        "prix": "180€ - 270€",
        "type": "hotels",
        "photo": "https://gmexrdmzzvuoovpddrby.supabase.co/storage/v1/object/sign/hotel-singapour/hotel_singapour_9.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJob3RlbC1zaW5nYXBvdXIvaG90ZWxfc2luZ2Fwb3VyXzkuanBnIiwiaWF0IjoxNzQyNDkwMzI5LCJleHAiOjMxNTUzMTA5NTQzMjl9.gjsEk_p9MBYmBgUymv67w85wqyd0VmmExU-wFegUwxM",
        "rating": 4.6,
        "address": "270 Orchard Rd, Singapore 238857",
        "place_id": "ChIJm_zgR5UZ2jERRbZmGLDdiF4"
      },
      {
        "name": "Jayleen Clarke Quay Hotel",
        "prix": "30€ - 60€",
        "type": "hotels",
        "photo": "https://gmexrdmzzvuoovpddrby.supabase.co/storage/v1/object/sign/hotel-singapour/hotel_singapour_10.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJob3RlbC1zaW5nYXBvdXIvaG90ZWxfc2luZ2Fwb3VyXzEwLmpwZyIsImlhdCI6MTc0MjQ5MDMzOSwiZXhwIjozMTU1MzEwOTU0MzM5fQ.qZxRuyDJQOOQ2_hBljxHsu6vm8HnnFRHk2du9TvrI34",
        "rating": 4,
        "address": "25 New Bridge Rd, Singapore 059390",
        "place_id": "ChIJ_3nBhgoZ2jERLvgK5iqbQhk"
      }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Nos Hôtels</h1>
      <HotelCarousel hotels={hotels} />
    </div>
  );
};

export default HotelsPage;
