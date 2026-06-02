import { NewsArticle } from "@/types/news";

export const staticNewsArticles: NewsArticle[] = [
  {
    id: 1,
    slug: "alianzas-hospitalarias-2026",
    title: "Alianzas hospitalarias 2026: claves para crecer con estabilidad",
    shortText: "Una mirada estratégica sobre cómo fortalecer acuerdos entre clínicas e instituciones en un entorno regulatorio cambiante.",
    image: "https://images.pexels.com/photos/3183198/pexels-photo-3183198.jpeg",
    publishedAt: "2026-05-18",
    contentHtml:
      "<h2>Contexto de mercado</h2><p>Durante los últimos meses, el sector sanitario ha acelerado sus procesos de colaboración público-privada para sostener la calidad asistencial y responder a una demanda creciente. Este escenario exige acuerdos más robustos y medibles.</p><p><strong>Una alianza efectiva</strong> no solo depende de firmar convenios; requiere objetivos compartidos, trazabilidad y capacidad de ejecución entre equipos clínicos y directivos.</p><h3>Elementos que marcan la diferencia</h3><ul><li>Definición temprana de indicadores de éxito.</li><li>Gobernanza clara entre las instituciones participantes.</li><li>Modelos de seguimiento trimestral con foco en resultados.</li></ul><p>Cuando estas bases se aplican con disciplina, las alianzas se convierten en un activo de crecimiento sostenible y reputacional.</p>",
  },
  {
    id: 2,
    slug: "talento-medico-movilidad-internacional",
    title: "Talento médico y movilidad internacional: oportunidades reales",
    shortText: "Recomendaciones para instituciones que buscan atraer profesionales altamente calificados desde LATAM y Europa.",
    image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg",
    publishedAt: "2026-05-10",
    contentHtml:
      "<h2>Un mercado más competitivo</h2><p>La movilidad internacional de talento sanitario exige procesos de selección más ágiles y planes de acompañamiento mejor diseñados. Las organizaciones que combinan velocidad y soporte integral captan mejores perfiles.</p><p>El onboarding clínico y cultural debe empezar antes de la incorporación formal para reducir fricción y mejorar la retención.</p><blockquote>La captación ya no termina con la contratación; comienza allí el verdadero trabajo de integración.</blockquote><h3>Buenas prácticas recomendadas</h3><ol><li>Definir rutas de homologación con hitos claros.</li><li>Asignar mentores por área y especialidad.</li><li>Monitorear satisfacción del profesional en los primeros 90 días.</li></ol><p>Este enfoque mejora la continuidad asistencial y eleva el valor percibido por pacientes e instituciones.</p>",
  },
  {
    id: 3,
    slug: "innovacion-comercial-dispositivos-quirurgicos",
    title: "Innovación comercial en dispositivos quirúrgicos: del producto al valor",
    shortText: "Cómo evolucionar de un discurso técnico a una propuesta centrada en impacto clínico y eficiencia operativa.",
    image: "https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg",
    publishedAt: "2026-04-29",
    contentHtml:
      "<h2>Más allá de la ficha técnica</h2><p>En la conversación con hospitales, los equipos de ventas obtienen mejores resultados cuando conectan atributos técnicos con resultados clínicos, tiempos de quirófano y eficiencia financiera.</p><p>El valor se construye al traducir evidencia en decisiones operativas concretas para cada institución.</p><h3>Modelo sugerido de conversación comercial</h3><ul><li>Contexto del hospital y prioridades del servicio.</li><li>Evidencia clínica relevante para su casuística.</li><li>Impacto esperado en productividad y seguridad.</li></ul><p>Esta metodología acelera la toma de decisiones y fortalece relaciones de largo plazo con los equipos médicos.</p>",
  },
];

export function getSortedNewsArticles(): NewsArticle[] {
  return [...staticNewsArticles].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function getNewsArticleBySlug(slug: string): NewsArticle | undefined {
  return staticNewsArticles.find((article) => article.slug === slug);
}
