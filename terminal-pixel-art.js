#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');

SYMB = '▄'

fs.readFile('./frame.json', (err, data) => {
    if (err) throw err;
    let imgData = JSON.parse(data);
    console.log(paint(imgData['images'][0], imgData['colors'], "    ", "", 1,1))
});


function paint(image, colorScheme, indentation="", comment="", xScale=1, yScale=1) {
    comment = comment.split('\n');
    const img = image.split('\n').filter(n => n);
    const imgHeight = img.length;
    const imgWidth = img[0].length;

    var outcome = [];
    for (let y = 0; y < imgHeight-1; y += yScale) {
        let row = []
        for (let x = 0; x < imgWidth; x += xScale) {
            curColor = colorScheme[img[y][x]];
            //row.push(chalk.hex(curColor)(SYMB));
            row.push(chalk.bgHex(curColor).hex(colorScheme[img[y+1][x]])(SYMB));
        }
        outcome.push(indentation + row.join('') + (comment && comment[y / 2] ? comment[y / 2] : ""));
    }
    if (imgHeight % 2 === 1) {
        let row = []
        for (let x = 0; x < imgWidth; x += xScale) {
            row.push(chalk['bgHex'](colorScheme[img[imgHeight - 1][x]])(' '));
        }
        outcome.push(indentation + row.join(''))
    }
    return outcome.join("\n");
}
