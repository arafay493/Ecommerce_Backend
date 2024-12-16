const _ = require("lodash");
const slugify = require("slugify");

// Convert the text to lowercase
function toLowerCaseSlug(text) {
  //   const slug = slugify(text);
//   const slug = slugify(text, { lower: true });
  const slug = slugify(text, { lower: true, replacement: "_" });
  console.log(slug);
}

function toLowerCaseLodash(text) {
  //   const slug = slugify(text);
//   const slug = slugify(text, { lower: true });
//   const slug = _.kebabCase(text);
  const slug = _.camelCase(text);
  console.log(slug);
}

module.exports = { toLowerCaseSlug , toLowerCaseLodash };
