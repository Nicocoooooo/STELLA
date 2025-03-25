import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function SupabaseDebugPage() {
  const [debugResults, setDebugResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapping des destinations potentielles
  const destinationMapping = {
    'london': 'Canada', // Exemple de mapping
    // Ajoutez d'autres mappings si nécessaire
  };

  useEffect(() => {
    const debugSupabaseQuery = async () => {
      const logs = [];

      try {
        // Test récupération dernière réponse de quiz
        logs.push('🔍 Tentative de récupération des réponses du quiz...');
        const { data: formData, error: formError } = await supabase
          .from('quiz_responses')
          .select('id, destination')
          .order('created_at', { ascending: false })
          .limit(1);

        if (formError) {
          logs.push(`❌ Erreur quiz_responses: ${formError.message}`);
          setError(formError);
        }

        if (formData && formData.length > 0) {
          logs.push(`✅ Données quiz_responses trouvées: ${JSON.stringify(formData)}`);
          const destination = formData[0].destination;
          
          // Utiliser le mapping ou garder la destination originale
          const mappedDestination = destinationMapping[destination.toLowerCase()] || destination;
          const formattedDestination = mappedDestination.charAt(0).toUpperCase() + mappedDestination.slice(1);

          logs.push(`🔍 Destination mappée: ${formattedDestination}`);

          // Test récupération ID destination
          const { data: destData, error: destError } = await supabase
            .from('destinations')
            .select('id, name')
            .eq('name', formattedDestination);

          if (destError) {
            logs.push(`❌ Erreur destinations: ${destError.message}`);
            setError(destError);
          }

          if (destData && destData.length > 0) {
            logs.push(`✅ Destinations trouvées: ${JSON.stringify(destData)}`);
            
            const destinationId = destData[0].id;
            logs.push(`🔍 ID de destination utilisé: ${destinationId}`);

            // Test récupération description destination
            const { data: descData, error: descError } = await supabase
              .from('destinations_description')
              .select('*')
              .eq('destination_id', destinationId);

            if (descError) {
              logs.push(`❌ Erreur destinations_description: ${descError.message}`);
              setError(descError);
            }

            if (descData && descData.length > 0) {
              logs.push(`✅ Données destinations_description trouvées: ${JSON.stringify(descData)}`);
            } else {
              logs.push('⚠️ Aucune donnée trouvée dans destinations_description');
            }
          } else {
            logs.push('⚠️ Aucun ID de destination trouvé');
          }
        } else {
          logs.push('⚠️ Aucune donnée trouvée dans quiz_responses');
        }

      } catch (err) {
        logs.push(`❌ Erreur générale: ${err.message}`);
        setError(err);
      } finally {
        setDebugResults(logs);
        setIsLoading(false);
      }
    };

    debugSupabaseQuery();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Débogage Supabase</h1>
      
      {isLoading ? (
        <div>Chargement du débogage...</div>
      ) : (
        <div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Erreur : {error.message}
            </div>
          )}
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Résultats du débogage :</h2>
            {debugResults.map((result, index) => (
              <div key={index} className="mb-2 p-2 bg-white rounded">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SupabaseDebugPage;