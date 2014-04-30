<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js">
</script>

/**
 * Normalizes columns
 * @params : Array to normalize, Array of normalizers
 * returns : Array of normalized values
 */
var normalizeCols = function (xArray, hArray) {
    var tempArray = [];
    for (var i = 0; i < xArray.length; i++) {
        var xNorm = xArray[i] / hArray[i];
        tempArray.push(xNorm);
    }
    return tempArray;
}

/**
 * Finds range of an array
 * @params : Array to find range, bool (false for min, true for max)
 * returns : A max or min determined by opt
 * yes I know this is janky and ugly. Could be better with enums
 */
var rangeFinder = function (xArray, opt) {
    var retVal = 0;
    for (var i = 0; i < xArray.length; i++) {
        if (!opt) { // min calc
            if (xArray[i] < retVal) {
                retVal = xArray[i];
            }
        }
        else { // max calc
            if (xArray[i] > retVal) {
                retVal = xArray[i];
            }
        }
    }
    return retVal;
}

/**
 * Weights a variable by its range
 * @params : min and maxes of that var
 * returns : a weight for the variable
 */
var weight = function (min, max) {
    var weight = 1 / (max - min);
    return weight;
}

/**
 * Normalizes X to N (weight)
 * @params : weight of var and weight of normalizer
 * returns : normalized weight of var X
 */
var normWeight = function (xWeight, nWeight) {
    var normalized = (xWeight / nWeight) * 100;
    return normalized;
}

/**
 * Scales the given var x
 * @params : normalized array of x, min of x, normalized weight of x
 * returns : an array of scaled x
 */
var scaleCols = function (xArray, xMin, xNormWeight) {
    var tempArray = [];
    for (var i = 0; i < xArray.length; i++) {
        var scale = (xArray[i] - xMin) * xNormWeight;
        tempArray.push(scale);
    }
    return tempArray;
}

/**
 * Normalizes scaled vars
 * @params : array of scaled values and two other vars to scale by
 * returns : an array of normalized, scaled vars
 */
var scaleNormalizer = function (xArray, nArray1, nArray2) {
    var tempArray = [];
    for (var i = 0; i < xArray.length; i++) {
        var scaled = xArray[i] / (xArray[i] + nArray1[i] + nArray2[i]);
        tempArray.push(scaled);
    }
    return tempArray;
}

/**
 * Transforms scaled, normalized points to Y coordinates
 * @params : array of scaled normalized points
 * returns : array of scaled Y coordinates
 */
var transformY = function (xArray) {
    var tempArray = [];
    for (var i = 0; i < xArray.length; i++) {
        var y = xArray[i] * Math.sin(Math.PI / 3);
        tempArray.push(y);
    }
    return tempArray;
}

/**
 * Transforms scaled, normalized points to X coordinates
 * @params : array of scaled, normalized points, array of Y points
 * returns : array of scaled X coordinates
 */
var transformX = function (xArray, yArray) {
    var tempArray = [];
    for (var i = 0; i < xArray.length; i++) {
        var x = xArray[i] + (yArray[i] / (Math.tan(Math.PI / 3)));
        tempArray.push(x);
    }
    return tempArray;
}

/**
 * Will make an 2d Array for drawing
 * @params : x points, y points
 * returns : array of [x_i,y_i]
 */
var makePoints = function (xArray, yArray) {
    var tempArray = [];
    for (var i = 0; i < xArray.length; i++) {
        tempArray[i] = [xArray[i], yArray[i]];
    }
    return tempArray;
}

/*
 * This anonymous function gets the data currently stored locally
 * TODO: when we move this to production we must adjust location
 * To ensure that this runs, start a python web server from the
 * directory - python -m SimpleHTTPServer
 * we must call all functions from within here
 * this is because getting is asynchronous
 */
var xy = [];
var dataset;
// This below will make an array based off of the headers we
// want from the csv file.
d3.csv("http://localhost:8000/database.csv", function (data) {
    dataset = data.map(function (d) {
        return [+d["id"], +d["name"], +d["H"], +d["S"], +d[
                "B"], +
            d["C28"]
        ];
    });

    /*
     * @param : the index in dataset from which to draw data
     * return : an array of one kind of data
     */
    // id = [0]; name = [1]; H = [2]; S = [3]; B = [4]; C = [5]
    var makeArray = function (k) {
        tempArray = [];
        for (var i = 0; i < dataset.length; i++) {
            tempArray.push(parseFloat(dataset[i][k]));
        }
        return tempArray;
    }
    var hArray = makeArray(2);
    var sArray = makeArray(3);
    var bArray = makeArray(4);
    var cArray = makeArray(5);

                    /**
     * Does all the work required other than making initial arrays
     * @params : data for each variable from the csv
     * returns : 2D array of x and y values
     */
    var getData = function(hArray, sArray, bArray, cArray) {
        var sNorm = normalizeCols(sArray, hArray);
        var bNorm = normalizeCols(bArray, hArray);
        var cNorm = normalizeCols(cArray, hArray);

        // false for min ; true for max
        var min = false;
        var max = true;
        var sHMin = rangeFinder(sNorm, min);
        var sHMax = rangeFinder(sNorm, max);
        var bHMin = rangeFinder(bNorm, min);
        var bHMax = rangeFinder(bNorm, max);
        var cHMin = rangeFinder(cNorm, min);
        var cHMax = rangeFinder(cNorm, max);

        var sWeight = weight(sHMin, sHMax);
        var bWeight = weight(bHMin, bHMax);
        var cWeight = weight(cHMin, cHMax);

        var sNormWeight = normWeight(sWeight, sWeight);
        var bNormWeight = normWeight(bWeight, sWeight);
        var cNormWeight = normWeight(cWeight, sWeight);

        var sScaled = scaleCols(sNorm, sHMin, sNormWeight);
        var bScaled = scaleCols(bNorm, bHMin, bNormWeight);
        var cScaled = scaleCols(cNorm, cHMin, cNormWeight);

        var sScaledNorm = scaleNormalizer(sScaled, bScaled, cScaled);
        var bScaledNorm = scaleNormalizer(bScaled, sScaled, cScaled);
        var cScaledNorm = scaleNormalizer(cScaled, sScaled, bScaled);

        var yPoints = transformY(cScaledNorm);
        var xPoints = transformX(bScaledNorm, yPoints);
        var retPoints = makePoints(xPoints, yPoints);
        return retPoints;
    }

    xy = getData(hArray, sArray, bArray, cArray);

    // Begin plotting. Must be done in async function

    // full of magic numbers that should be eliminated
    var margin = {top: 20, right: 15, bottom: 60, left: 60},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d[0];})])
            .range([0, width]);
    var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d[1];})])
            .range([height, 0]);

    var chart = d3.select('body')
                .append('svg:svg')
                .attr('width', width + margin.right + margin.left)
                .attr('height', height + margin.top + margin.bottom)
                .attr('class', 'chart')

    var main = chart.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top
                      + ')')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'main')

    // Draw x axis (we don't actually want to do this, we want a triangle)
    var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

    main.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'main axis date')
        .call(xAxis);

    // Draw y (see note above)
    var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

    main.append('g')
        .attr('transform', 'translate(0,0)')
        .attr('class', 'main axis date')
        .call(yAxis);

    var g = main.append("svg:g");

    g.selectAll("scatter-dots")
        .data(xy)
        .enter().append("svg:circle")
            .attr("cx", function(d,i) {return x(d[0]);})
            .attr("cy", function(d) {return y(d[1]);})
            .attr("r", 8);
});
