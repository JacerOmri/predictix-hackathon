const Graph = require('./graph');

class Parser {

    constructor(start, end) {
        this.START = start;
        this.END = end;
        this.parse = this.parse.bind(this);
        this.parseLine = this.parseLine.bind(this);
        this.partialGraph = this.partialGraph.bind(this);
    }
    parse(input) {

        let promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        let graph = new Graph();


        let path = input.split('=')[1];

        let paths = this.decompose(path);

        if (paths.length === 0) {
            paths = [path];
        }

        paths.forEach(p => {
            let g = this.partialGraph(p);
            console.log(p, g)
            graph.addGraphConnection(g, 'S', 'E');
            path = path.replace('('+p+')', '')
        });

        let g = this.partialGraph(path);
        console.log(path, g)
        graph.addGraphConnection(g, 'S', 'E');

        graph.cleanUp();

        this.resolve(graph);

        return promise;
    }

    parseLine(line) {

        let graph = new Graph();

        if (line.indexOf(';') === -1 && line.indexOf('|') === -1) {
            graph.addNode(line);
            graph.addConnection('S', line);
            graph.addConnection(line, 'E');
            return graph;
        }

        let path = line;
        
        if (line.indexOf(';') > -1) {
            path.split(';').forEach((e, i, a) => {
                if (i == 0) {
                    graph.addGraphConnection(this.parseLine(e), 'S');
                }
                if (i == a.length - 1) {
                    graph.addGraphConnection(this.parseLine(e), null, 'E');
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
        } else {
            path.split('|').forEach((e, i, a) => {
                if (i == 0) {
                    graph.addGraphConnection(this.parseLine(e), 'S', 'E');
                }
                if (i == a.length - 1) {
                    graph.addGraphConnection(this.parseLine(e), 'S', 'E');
                }
            });
        }

        return graph;
    }

    partialGraph(path, graph) {
        path = this.generateTransitions(path);
        return this.parseLine(path);
    }

    generateTransitions(str) {
        let transCount = 0;
        const regex = /\|[a-z];[a-z]\|/ig;
        let m;

        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                str = str.replace(match, match.split(';').join(';t' + (transCount++) + ';'));
            });
        }
        return str;
    }

    decompose(path) {
        const regex = /\(([^\(\)]+)\)/ig;
        let m;
        let out = [];

        while ((m = regex.exec(path)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            out.push(m.map(x => x.match())[1].input);
        }
        return out;
    }
}

module.exports = Parser;