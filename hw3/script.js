/* global keys     */
/* global keysFlip */

/* jshint -W104 */
/* jshint -W119 */

// console.log(keys.a);
// console.log(keys.openbracket);
// console.log(keys.delete);
// console.log(keys['0']);

function assignInput(input) {
    document.getElementById('keys').innerHTML = input;
}

function assignKeywd(keyword) {
    document.getElementById('keyword').innerHTML = keyword;
}

const keywords  = ['Yes', 'No'];
const kwdLower  = keywords.map((kw) => (kw.toLowerCase()));
var currentWord = '';

window.onkeydown = function(e) {
    let keyCode = e.keyCode ? e.keyCode : e.which;
    let key = keysFlip[keyCode];

    if (key === 'enter') {
        if (kwdLower.indexOf(currentWord) >= 0) {
            assignKeywd('match found!');
            currentWord = '';
        }

    } else if (key === 'space') {
        assignKeywd('');
        currentWord += ' ';
        assignInput(currentWord);

    } else if ((key === 'backspace') ||
               (key === 'delete')    ||
               (key === 'esc')) {
        assignKeywd('');
        currentWord = '';
        assignInput(currentWord);

    } else if (key.length > 1) {
        // pass

    } else if (currentWord.length > 20) {
        currentWord = '';

    } else {
        assignKeywd('');
        currentWord += key;
        assignInput(currentWord);
    }

    console.log(currentWord);
};

assignInput('');
assignKeywd('');
