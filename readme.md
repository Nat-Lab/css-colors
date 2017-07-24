css-colors
---

Grab `color` and `background-color` from listed sites.

Example:

```
$ git clone https://github.com/Nat-Lab/css-colors.git
$ npm i
$ wget http://s3.amazonaws.com/alexa-static/top-1m.csv.zip
$ unzip top-1m.csv.zip
$ head -n 1000 < top-1m.csv | cut -d, -f2 > top1000.txt
$ node css_colors.js top1000.txt top1000-colors.json
```
