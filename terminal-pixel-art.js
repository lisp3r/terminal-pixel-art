#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');

SYMB = '▄'

fs.readFile('./frame.json', (err, data) => {
    if (err) throw err;
    let imgData = JSON.parse(data);
    console.log(paint(imgData['images'][0], imgData['colors'], "    ", "", 2,2, true))
});

function getBackground(image, colors) {
    let arr = image.map(row => Array.from(row)).flat();
    let counts = arr.reduce((a, c) => {
        a[c] = (a[c] || 0) + 1;
        return a;
      }, {});
      let maxCount = Math.max(...Object.values(counts));
      let mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);
      return colors[mostFrequent]
}


function paint(image, colorScheme, indentation="", comment="", xScale=1, yScale=1, noBg=false) {
    comment = comment.split('\n');
    const img = image.split('\n').filter(n => n);
    const imgHeight = img.length;
    const imgWidth = img[0].length;

    let imgBgColor = noBg ? getBackground(img, colorScheme) : false;
    console.log(imgBgColor);

    var outcome = [];
    for (let y = 0; y < imgHeight-1; y += yScale) {
        let row = []
        for (let x = 0; x < imgWidth; x += xScale) {
            bgColor = colorScheme[img[y][x]];
            fgColor = colorScheme[img[y+1][x]];

            // (imgBgColor == bgColor || imgBgColor == fgColor) ? row.push(' ') :
            // row.push(chalk.bgHex(bgColor).hex(fgColor)(SYMB));

            if (fgColor != imgBgColor && fgColor != imgBgColor) {
                row.push(chalk.bgHex(bgColor).hex(fgColor)(SYMB));
            } else {
                row.push(' ');
            }
        }
        outcome.push(indentation + row.join('') + (comment && comment[y / 2] ? comment[y / 2] : ""));
    }
    return outcome.join("\n");
}
