// src/_data/avisos.js
//
// Fitxer de dades global de l'Eleventy: es crida automàticament a cada
// compilació i deixa el resultat disponible a totes les plantilles com
// a variable "avisos". Aquí no cal cap templating especial — s'executa
// en Node.js pur.
//
// Requereix dues variables d'entorn a Netlify (Project configuration →
// Environment variables), NO són secretes (el dataset és de lectura
// pública), però així no cal tocar el codi si mai canvien:
//     SANITY_PROJECT_ID   (el "Project ID" del teu projecte Sanity)
//     SANITY_DATASET      (normalment "production")

const { createClient } = require('@sanity/client');
const { createImageUrlBuilder } = require('@sanity/image-url');
const { toHTML } = require('@portabletext/to-html');

module.exports = async function () {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';

  // Si encara no s'han configurat les variables (per exemple, la primera
  // vegada que es compila sense haver-les afegit a Netlify), no fem
  // petar el build — simplement no hi haurà avisos, i el site es
  // publica igualment amb la secció buida.
  if (!projectId) {
    console.warn(
      "Avís: falta la variable d'entorn SANITY_PROJECT_ID. " +
        "La secció d'Avisos sortirà buida fins que es configuri."
    );
    return [];
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: true, // llegeix del CDN de Sanity (més ràpid, dataset públic)
  });

  const builder = createImageUrlBuilder(client);
  function urlFor(source) {
    return builder.image(source);
  }

  try {
    const query = `*[_type == "avis"] | order(publishedAt desc){
      _id, title, body, publishedAt, image
    }`;
    const results = await client.fetch(query);

    return results.map((item) => {
      // Un "slug" senzill a partir de l'identificador intern, per poder
      // enllaçar-hi (p. ex. avisos.html#un-identificador).
      const slug = (item._id || '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();

      return {
        title: item.title || '',
        bodyHtml: item.body ? toHTML(item.body) : '',
        imageUrl: item.image ? urlFor(item.image).width(1000).auto('format').url() : null,
        publishedAt: item.publishedAt || null,
        slug,
      };
    });
  } catch (err) {
    // Si Sanity no respon (per exemple, un problema temporal de xarxa),
    // el build no s'ha de trencar: publiquem el site sense avisos i ho
    // deixem apuntat al log per si cal investigar-ho.
    console.error('Error carregant els Avisos des de Sanity:', err.message);
    return [];
  }
};
