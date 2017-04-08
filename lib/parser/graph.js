const _ = require('lodash');

class Graph {

    constructor(start, end) {
        this.nodes = ['S', 'E'];
        this.connections = {};

        this.addNode = this.addNode.bind(this);
        this.addConnection = this.addConnection.bind(this);
        this.merge = this.merge.bind(this);
        this.getPrevisousNodes = this.getPrevisousNodes.bind(this);
        this.deleteEndingConnections = this.deleteEndingConnections.bind(this);
        this.cleanUp = this.cleanUp.bind(this);
    }

    addNode(nodeName) {
        if (this.nodes.indexOf(nodeName) < 0) {
            this.nodes.push(nodeName);
        }
    }

    addConnection(nodeOne, nodeTwo) {
        if (!this.connections[nodeOne]) {
            this.connections[nodeOne] = [];
        }

        if (this.connections[nodeOne].indexOf(nodeTwo) < 0) {
            this.connections[nodeOne].push(nodeTwo);
        }
    }

    addGraphConnection(otherGraph, previousNode, nextNode) {
        otherGraph.nodes.forEach(node => {
            this.addNode(node);
        }, this);

        if (previousNode) {
            otherGraph.connections['S'].forEach(node => {
                if (node != 'E') {
                    this.addConnection(previousNode, node);
                }
            })
        }

        if (nextNode) {
            otherGraph.getPrevisousNodes('E').forEach(node => {
                if (node != 'S') {
                    this.addConnection(node, nextNode);
                }
            })
        }

        if (previousNode || nextNode) {
            otherGraph.nodes = otherGraph.nodes.filter(e => ['S', 'E'].indexOf(e) < 0)
            delete otherGraph.connections['S'];
            otherGraph.deleteEndingConnections();
        }

        this.merge(otherGraph);
    }

    getPrevisousNodes(node) {
        let previousNodes = [];
        let keys = Object.keys(this.connections);

        keys.forEach(nodeName => {
            if (this.connections[nodeName].indexOf(node) > -1) {
                previousNodes.push(nodeName);
            }
        });

        return previousNodes;
    }

    merge(otherGraph) {
        otherGraph.nodes.forEach(node => this.addNode(node));
        let keys = Object.keys(otherGraph.connections);
        keys.forEach(key => {
            otherGraph.connections[key].forEach(k => this.addConnection(key, k))
        })
    }

    deleteEndingConnections() {
        let previousNodes = this.getPrevisousNodes('E');
        previousNodes.forEach(node => {
            this.connections[node] = this.connections[node].filter(e => e != 'E')
        })
    }

    cleanUp() {
        let keys = Object.keys(this.connections);
        keys.forEach(key => {
            this.connections[key] = this.connections[key].filter(k => {
                return  k.indexOf(';') === -1 &&  k.indexOf('|') === -1 &&
                key != '' &&  k != ''
            })
        })
    }
}

module.exports = Graph;