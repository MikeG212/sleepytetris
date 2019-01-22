const SHAPES = {
    o: {
        startingIndices: [[0, 0], [0, 1], [1, 0], [1, 1]],
        val: 1,
        width: 2,

    },

    t: {
        startingIndices: [[1, 0], [0, 1], [1, 1], [1, 2]],
        val: 2,
        width: 3,

    },

    i: {
        startingIndices: [[0, 0], [0, 1], [0, 2], [0, 3]],
        val: 3,
        width: 4,
    },

    l: {
        startingIndices: [[0, 0], [1, 0], [1, 1], [1, 2]],
        val: 4,
        width: 3,
    },

    j: {
        startingIndices: [[1, 0], [1, 1], [1, 2], [0, 2]],
        val: 5,
        width: 3,
    },

    s: {
        startingIndices: [[1, 0], [2, 0], [1, 1], [0, 1]],
        val: 6,
        width: 3,
    },
    z: {
        startingIndices: [[0, 0], [1, 0], [1, 1], [2, 1]],
        val: 7,
        width: 3,
    }
};

function Shape(shape) {
    this.name = shape;
    this.val = SHAPES.shape;
    this.indices = SHAPES.shape.startingIndices;
    this.val = SHAPES.shape.val;
    this.width = SHAPES.shape.val; 

}

