// src/components/SupabaseTest.js
import React, { useState } from 'react';
import { supabase } from '../js/supabaseClient';

function SupabaseTest() {
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    try {
      // Test d'insertion d'une réponse
      const testData = {
        departure_date: new Date(),
        return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours plus tard
        number_of_travelers: 2,
        number_of_rooms: 1,
        destination: 'paris',
        travel_with: ['couple'],
        budget_allocation: {
          hebergement: 5,
          transport: 5,
          restaurant: 5,
          activites: 5
        },
        accommodation_preferences: ['Hotels'],
        activity_preferences: ['culture'],
        day_intensity_preference: 5,
        comfort_preference: 5,
        dietary_restrictions: [],
        specific_activities: [],
        completion_status: 'in_progress',
        current_step: 1
      };

      const { data, error: insertError } = await supabase
        .from('quiz_responses')
        .insert([testData])
        .select();

      if (insertError) throw insertError;

      // Test de lecture des réponses
      const { data: readData, error: readError } = await supabase
        .from('quiz_responses')
        .select('*')
        .limit(5);

      if (readError) throw readError;

      setTestResult({
        insertedData: data,
        recentResponses: readData
      });
      setError(null);

    } catch (err) {
      setError(err.message);
      setTestResult(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={testConnection}
          className="bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-6 py-2 rounded-full"
        >
          Tester la connexion Supabase
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Erreur : {error}
        </div>
      )}

      {testResult && (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 text-green-700 rounded-lg">
            Connexion réussie ! Les données ont été insérées et lues avec succès.
          </div>

          <div>
            <h3 className="font-medium mb-2">Données insérées :</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {JSON.stringify(testResult.insertedData, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">5 dernières réponses :</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {JSON.stringify(testResult.recentResponses, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupabaseTest;