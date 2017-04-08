const _ = require('lodash');

class Output {
    constructor(graph) {
        this.graph = graph;
        this.output = [];
        this.build = this.build.bind(this);
        this.addNodeConnections = this.addNodeConnections.bind(this);
    }

    build() {
        console.log(this.graph);
        if (this.graph.nodes) {
            this.graph.nodes.forEach(node => {
                if (this.graph.connections[node]) {
                    this.addNodeConnections(node, this.graph.connections[node]);
                }
            });
        }
        return _.uniq(this.output);
    }

    addNodeConnections(node, connections) {
        connections.forEach(connection => {
            this.output.push({
                from: node,
                to: connection
            });
        }, this);
    }
}

module.exports = Output;