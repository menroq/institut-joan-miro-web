// src/_data/fotos.js
//
// Fitxer de dades global de l'Eleventy: es crida automàticament a cada
// compilació i deixa el resultat disponible a totes les plantilles com
// a variable "fotos". Igual que noticies.js, llegeix els repositoris de
// fotos (tipus "repositoriFotos") des de Sanity.
//
// Fa servir les mateixes variables d'entorn que les Notícies — no calen
// variables noves a Netlify:
//     SANITY_PROJECT_ID
//     SANITY_DATASET

const { createClient } = require('@sanity/client');
const { createImageUrlBuilder } = require('@sanity/image-url');

module.exports = async function () {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';

  // Si encara no s'han configurat les variables, no fem petar el build —
  // simplement no hi haurà repositoris, i el site es publica igualment
  // amb la secció de Fotos buida.
  if (!projectId) {
    console.warn(
      "Avís: falta la variable d'entorn SANITY_PROJECT_ID. " +
        'La secció de Fotos sortirà buida fins que es configuri.'
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
    const query = `*[_type == "repositoriFotos"] | order(date desc){
      _id, title, "slug": slug.current, date, coverImage, gallery
    }`;
    const results = await client.fetch(query);

    return results
      .filter((item) => item.slug) // sense slug no es pot enllaçar la pàgina de detall
      .map((item) => {
        const gallery = Array.isArray(item.gallery) ? item.gallery : [];
        return {
          title: item.title || '',
          slug: item.slug,
          date: item.date || null,
          coverUrl: item.coverImage
            ? urlFor(item.coverImage).width(700).height(700).fit('crop').auto('format').url()
            : null,
          // Mida gran per al carrusel de la pàgina de detall.
          images: gallery.map((img) => ({
            url: urlFor(img).width(1800).auto('format').url(),
          })),
        };
      });
  } catch (err) {
    // Si Sanity no respon, el build no s'ha de trencar: publiquem el site
    // sense repositoris i ho deixem apuntat al log per si cal investigar-ho.
    console.error('Error carregant els Repositoris de Fotos des de Sanity:', err.message);
    return [];
  }
};
