class StdinLoader {
    load(input) {
        return new Promise((resolve, reject) => {
            resolve(input);
        })
    }
}

module.exports = StdinLoader;