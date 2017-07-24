const css = require('css'), getcss = require('get-css'),
      fs = require('fs'), args = process.argv.slice(2);

if (args.length < 2) {
  console.error('usage: node css_colors.js <url_list> <output_file>');
  process.exit(1);
}

var getColorByUrl = url => new Promise((res, rej) => {
  getcss(url, {timeout: 5000})
    .then(
      src => res(
        css.parse(src.css).stylesheet.rules
          .filter(r => r.declarations)
          .map(
            r => r.declarations.filter(
              d => d.type == 'declaration' &&
              [ 'color',
                'background-color' ].some(c => d.property == c)
            )
          )
          .reduce((d1, d2) => d1.concat(d2))
          .map(d => d.value)
      )
    ).catch(rej);
});

var urls = fs.readFileSync(args[0], 'utf8').split('\n');
var cs = [];

var fectchColors = function (urls, i, n) {
  if (i == n) {
    var re_color = /(#([0-9a-f]{3}){1,2}|(rgba|hsla)\(\d{1,3}%?(,\s?\d{1,3}%?){2},\s?(1|0?\.\d+)\)|(rgb|hsl)\(\d{1,3}%?(,\s?\d{1,3}%?\)){2})/;
    fs.writeFileSync(args[1], JSON.stringify(cs.map(c => {
      var re_rslt = re_color.exec(c);
      return re_rslt ? re_rslt[0] : null;
    }).filter(c => c != null)));
    return;
  };
  getColorByUrl(urls[i]).then(c => {
    console.log(`[${i + 1}/${n}] ${urls[i]}`)
    cs = cs.concat(c);
    fectchColors(urls, i+1, n);
  }).catch(e => fectchColors(urls, i+1, n));
};

fectchColors(urls, 0, urls.length - 1);
