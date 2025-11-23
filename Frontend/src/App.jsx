import React, { useState } from 'react';
import SurveyForm from './components/SurveyForm';
import ResultsDisplay from './components/ResultsDisplay';
import './index.css'; // Importamos los estilos

function App() {
  // 'results' guardará la respuesta del backend
  const [results, setResults] = useState(null);

  // Esta función se la pasaremos a SurveyForm
  // Se ejecutará cuando el backend responda
  const handleSurveySubmit = (data) => {
    setResults(data);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Evaluación de Riesgo de Salud</h1>
      </header>
      
      <main>
        {/*
          Si no hay resultados, muestra el formulario.
          Si SÍ hay resultados, muestra la pantalla de resultados.
        */}
        {!results ? (
          <SurveyForm onSurveySubmit={handleSurveySubmit} />
        ) : (
          <ResultsDisplay results={results} />
        )}
      </main>
    </div>
  );
}

export default App;