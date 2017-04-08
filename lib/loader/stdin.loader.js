class StdinLoader {
    load(input) {
        return new Promise((resolve, reject) => {
            input = input.replace(/[ \t]/g, '');
            let openParCount = (input.split("(").length - 1);
            let closeParCount = (input.split(")").length - 1);
            
            if(openParCount != closeParCount) {
                reject('Syntax Error: No matching parentheses');
            }
            
            resolve(input);
        })
    }
}

module.exports = StdinLoader;