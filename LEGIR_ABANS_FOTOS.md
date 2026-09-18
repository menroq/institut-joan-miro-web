# Secció de Fotos — què s'ha afegit i què cal fer

## Com funciona
Els repositoris de fotos es gestionen des del mateix Sanity Studio que
les Notícies (institut-joan-miro---avisos), amb un tipus de contingut
nou: "Repositori de Fotos" (títol, adreça/slug, foto de portada,
galeria de fotos, i una data que determina l'ordre — el més recent
primer).

- La pàgina **Fotos** (menú "Viu El Miró" → "Fotos") mostra una graella
  amb la portada + el títol de cada repositori.
- En clicar-hi, s'obre una pàgina amb un carrusel de totes les fotos
  d'aquell repositori (fletxes esquerra/dreta, també funciona amb les
  fletxes del teclat).
- No cal tocar cap Google Drive: totes les fotos es pugen directament
  des de Sanity Studio (com ja fas amb les Notícies) i es serveixen
  optimitzades des del CDN de Sanity.

## Fitxers NOUS a l'Eleventy (institut-joan-miro-eleventy)
    src/_data/fotos.js
    src/fotos-data.njk
    src/fotos.html
    src/es/fotos.html
    src/en/fotos.html
    src/fotos-repositori.html
    src/es/fotos-repositori.html
    src/en/fotos-repositori.html

## Fitxers MODIFICATS
    src/_includes/base.njk        (el menú "Viu El Miró" ara és un desplegable amb "Fotos")
    src/_data/i18n.json           (noves claus: menu.fotos + secció "fotos")

## IMPORTANT: actualitza l'esquema del Sanity Studio
Al teu projecte LOCAL del Sanity Studio (institut-joan-miro---avisos),
dins la carpeta schemaTypes, ja hi ha (afegits per aquest canvi):
    schemaTypes/repositoriFotos.js   (nou)
    schemaTypes/index.js             (actualitzat, hi afegeix el nou tipus)

Torna a desplegar el Studio perquè hi aparegui l'opció "Repositori de
Fotos" al menú d'esquerra:

    cd "institut-joan-miro---avisos"
    npx sanity deploy

## Variables d'entorn a Netlify
No cal afegir-ne cap de nova — es reutilitzen les mateixes SANITY_PROJECT_ID
i SANITY_DATASET que ja tens configurades per a les Notícies.

## Com provar-ho en local
    cd institut-joan-miro-eleventy
    npm run serve

Ves a http://localhost:8080/fotos.html — si encara no has creat cap
"Repositori de Fotos" a Sanity Studio, la pàgina mostrarà "Encara no hi
ha cap repositori de fotos." (no peta el build ni la pàgina).

## Com penjar el primer repositori (des de Sanity Studio)
1. Obre institut-joan-miro.sanity.studio i entra a "Repositori de Fotos" → "Crear".
2. Omple el Títol, prem "Generate" a l'Adreça (slug), puja la Fotografia
   de portada, puja totes les fotos a la Galeria de fotos (es poden
   arrossegar totes de cop), i posa la Data (per exemple, la data de
   l'activitat — determina l'ordre a la graella).
3. Publica el document. Al cap d'uns segons Netlify recompila el site
   sol (igual que amb les Notícies) i el repositori ja apareix a
   /fotos.html.

## Passos a Git
    git add .
    git commit -m "Afegeix la secció de Fotos (repositoris amb carrusel) via Sanity"
    git push
