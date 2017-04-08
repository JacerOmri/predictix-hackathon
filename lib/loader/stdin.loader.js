class StdinLoader {
    load(input) {
        return new Promise((resolve, reject) => {
            resolve(input.replace(/[ \t]/g, ''));
        })
    }
}

module.exports = StdinLoader;