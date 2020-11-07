#!/usr/bin/env node

const image = `
╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬
╬╬╬╬╬╬╬╬╬╬████████████████╬╬╬╬╬╬╬╬╬╬
╬╬╬╬╬╬╬╬██▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒██╬╬╬╬╬╬╬╬
╬╬╬╬╬╬██▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒██╬╬╬╬╬╬
╬╬╬╬╬╬██▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒██╬╬╬╬╬╬
╬╬╬╬╬╬██▓▓░░░░        ▒▒▒▒▒▒██╬╬╬╬╬╬
╬╬╬╬╬╬██▓▓░░░░          ▒▒▒▒██╬╬╬╬╬╬
╬╬╬╬╬╬██▓▓░░██      ██  ▒▒  ██╬╬╬╬╬╬
╬╬╬╬╬╬██░░░░░░              ██╬╬╬╬╬╬
╬╬╬╬╬╬██░░░░██████████      ██╬╬╬╬╬╬
╬╬╬╬╬╬██░░░░░░              ██╬╬╬╬╬╬
╬╬╬╬╬╬╬╬██░░░░░░          ██╬╬╬╬╬╬╬╬
╬╬╬╬╬╬██░░██████░░░░░░░░░░  ██╬╬╬╬╬╬
╬╬╬╬██░░                      ██╬╬╬╬
╬╬██░░                  ██░░    ██╬╬
╬╬██░░░░████░░░░   ░░░░ ████░░  ██╬╬
╬╬██░░    ██░░          ██░░    ██╬╬
╬╬██░░░░  ██▓▓▒▒▒▒▒▒▒▒▒▒██░░░░  ██╬╬
╬╬╬╬████████▓▓▒▒▒▒▒▒▒▒▒▒████████╬╬╬╬
╬╬╬╬╬╬╬╬╬╬██▓▓▒▒████▓▓▒▒██╬╬╬╬╬╬╬╬╬╬
╬╬╬╬╬╬╬╬╬╬██████╬╬╬╬██████╬╬╬╬╬╬╬╬╬╬
╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬`


const chalk = require('chalk');

const color = {
    '╬': '#444444', // Dark Gray
    '█': '#000000', // Black
    '▓': '#c66e12', // Brown
    '▒': '#F0AD00', // Orange
    '░': '#5A6378', // Dark Blue
    ' ': '#60B5CC', // Cyan
}


function paint(image, colorScheme, indentation="", comment, xScale=1, yScale=1) {
    comment = comment.split('\n');
    const img = image.split('\n').filter(n => n);
    const imgHeight = img.length;
    const imgWidth = img[0].length;

    var outcome = [];
    for (let y = 0; y < imgHeight-1; y += yScale) {
        let row = []
        for (let x = 0; x < imgWidth; x += xScale) {
            curColor = colorScheme[img[y][x]];
            row.push(chalk.bgHex(curColor).hex(colorScheme[img[y + 1][x]])('▄'));
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

const comment = `  Terminal
  Pixel
  Art`

console.log("\n")
console.log(paint(image, color, "    ", comment, 2, 2))
console.log("\n")
