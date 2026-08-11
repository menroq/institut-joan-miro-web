module.exports = function (eleventyConfig) {
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    // Els fitxers .html de "src" es tracten com a contingut pla (només
    // s'hi llegeix el "front matter" per triar la plantilla/base.njk),
    // sense passar-los pel motor de plantilles Nunjucks. Això evita
    // qualsevol conflicte si algun dia el codi CSS/JS d'una pàgina conté
    // caràcters { } que Nunjucks podria intentar interpretar.
    htmlTemplateEngine: false,
  };
};
