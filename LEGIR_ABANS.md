# Repartiment: Destacats (fitxer senzill) + Notícies (Sanity)

## Fitxers NOUS a afegir
- src/_data/destacats.json      → contingut dels Destacats (tu l'edites directament)
- src/destacats-data.njk        → genera /destacats-data.json

## Fitxers RENOMBRATS/eliminats (esborra els antics manualment)
Esborra aquests 3, ja NO calen:
    src/avisos.html
    src/es/avisos.html
    src/en/avisos.html
Substitueixen-se per aquests 3 (ja al zip):
    src/noticies.html
    src/es/noticies.html
    src/en/noticies.html

Esborra també:
    src/_data/avisos.js
    src/avisos-data.njk
(substituïts per src/_data/noticies.js i src/noticies-data.njk, ja al zip)

## Fitxers MODIFICATS (substitueix-los)
- src/index.html, src/es/index.html, src/en/index.html
- src/_includes/base.njk
- src/_data/i18n.json

## IMPORTANT: actualitza l'esquema del Sanity Studio
Al teu projecte LOCAL del Sanity Studio (institut-joan-miro---avisos),
dins la carpeta schemaTypes:
  1. Esborra (o renombra) avis.js
  2. Afegeix-hi noticia-schema.js (inclòs en aquest zip), i renombra'l a noticia.js
  3. Edita schemaTypes/index.js perquè quedi:
         import noticia from './noticia'
         export const schemaTypes = [noticia]
  4. Torna a desplegar el Studio:
         npx sanity deploy

Nota: el document de prova "Avis test" que ja tenies quedarà orfe
(de tipus antic "avis", que ja no existeix a l'esquema). No cal fer-hi
res, simplement no sortirà enlloc — el pots esborrar manualment des
del Studio si vols.

## Variables d'entorn a Netlify
Ja les tens configurades (SANITY_PROJECT_ID, SANITY_DATASET) — no cal
tocar-les, es continuen fent servir igual, ara per a "noticia" en lloc
de "avis".

## Passos a Git
    git add .
    git commit -m "Separa Destacats (fitxer senzill) de Noticies (Sanity)"
    git push
