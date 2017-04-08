const Graph = require('./graph');

class Parser {

    constructor(start, end) {
        this.START = start;
        this.END = end;
        this.parse = this.parse.bind(this);
        this.parseLine = this.parseLine.bind(this);
    }
    parse(input) {

        let promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        let graph = new Graph();

        graph.addGraphConnection(this.parseLine(input.split('=')[1]), 'S', 'E');

        graph.cleanUp();

        this.resolve(graph);

        return promise;
    }

    parseLine(line) {

        let graph = new Graph();

        if(line.length == 1) {
            graph.addNode(line);
            graph.addConnection('S', line);
            graph.addConnection(line, 'E');
            return graph;
        }

        let path = line;

        path.split(';').forEach((e, i, a) => {
            if (i == 0) {
                graph.addGraphConnection(this.parseLine(e), 'S');
                return graph;
            }
            if (i == a.length - 1) {
                graph.addGraphConnection(this.parseLine(e), null, 'E');
                return graph;
            }
            if (e.indexOf('|') > -1) {
                e.split('|').forEach((ee, ii, aa) => {
                    graph.addNode(ee);

                    if (a[i - 1]) {
                        graph.addConnection(a[i - 1], ee);
                    }

                    if (a[i + 1]) {
                        graph.addConnection(ee, a[i + 1]);
                    }
                });
            } else {
                graph.addGraphConnection(this.parseLine(e), a[i - 1], a[i + 1]);
            }
        });

        return graph;
    }
}

module.exports = Parser;