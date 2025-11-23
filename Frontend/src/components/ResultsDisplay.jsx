import React from 'react';

const ResultsDisplay = ({ results }) => {
    // Asumimos que el backend devuelve un objeto como:
    // { score: 15, risk_level: "Alto", message: "Tu riesgo es...", bmi: 27.5 }

    // Si no hay 'results' (por si acaso)
    if (!results) {
        return <p>No se pudieron cargar los resultados.</p>;
    }

    // Define la clase CSS basada en el riesgo
    const riskClass = (results.risk_level || 'default').toLowerCase();

    return (
        <div className={`results-card ${riskClass}`}>
            <h2>Resultados de la Evaluación</h2>

            {/* AÑADIDO: Un grid para poner el Puntaje y el IMC juntos */}
            <div className="results-grid">
                <div className="results-score">
                    <p>Tu Puntaje:</p>
                    {/* Usamos '??' por si el puntaje es 0 (que es un valor válido) */}
                    <span>{results.score ?? 'N/A'}</span>
                </div>

                {/* --- ¡NUEVO! BLOQUE DE IMC --- */}
                <div className="results-score"> {/* Re-usamos la misma clase para consistencia */}
                    <p>Tu IMC (aprox):</p>
                    <span>{results.bmi || 'N/A'}</span>
                </div>
                {/* --- FIN DE LO NUEVO --- */}
            </div>


            <div className="results-level">
                <p>Nivel de Riesgo:</p>
                <strong>{results.risk_level || 'Desconocido'}</strong>
            </div>

            <p className="results-message">
                {results.message || 'Consulta a tu médico para una evaluación completa.'}
            </p>

            <button onClick={() => window.location.reload()} className="submit-button">
                Volver a empezar
            </button>
        </div>
    );
};

export default ResultsDisplay;