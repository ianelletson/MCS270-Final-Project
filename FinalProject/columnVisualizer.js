// The MIT License (MIT)

// Copyright (c) <2014> <Ian Elletson, Dustin Luhmann, Andrew Olson>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


/*
 * Global Variables
 */
var drawingWindow;
var drawingWindowWidth = 500;
var drawingWindowHeight = 500;
var isQuickZoomedIn = false;
var isColumnClicked = false;
var points;

/**
 * Initializer to create the drawingWindow
 */
function drawingWindowInit() {

    // Strings that hold the details of the canvas and window
    drawingWindowDetails = "resizable=yes, width=%s1, height=%s2";
    canvasDetails =
        "<html>" +
        "<head>" +
        "<title>Drawing Window</title>" +
        "</head>" +
        "<body>" +
        "<canvas id=\"theCanvas\" height=\"%s1\" width=\"%s2\"></canvas>" +
        "<table width=\"100%\">" +
        "<tr>" +
        "<td width=\"50%\" id=\"Selected Column\">Selected Column: <br> No Column Selected</td>" +
        "<td width=\"50%\" id=\"Curser Column\">Curser Column: <br> %%%</td>" +
        "</tr>" +
        "<tr>" +
        "<td id= \"Buttons\">" +
        "<button id=\"inButton\" type=\"button\">+</button>" +
        "<button id=\"outButton\" type=\"button\">-</button>" +
        "<button id=\"downloadButton\" type=\"button\">Download</button>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</body>" +
        "</html>";

    // Replaces the value holder with the correct value
    drawingWindowDetails = drawingWindowDetails.replace("%s1", "" + drawingWindowWidth).replace("%s2", "" + drawingWindowHeight);
    canvasDetails = canvasDetails.replace("%s1", "" + (drawingWindowWidth * .95)).replace("%s2", "" + (drawingWindowHeight * .95));

    // Creates the window with the appropriate details
    drawingWindow = window.open("", "_blank", drawingWindowDetails);
    drawingWindow.document.write(canvasDetails);
}

/*
 * Mouse Response Helper Methods
 */
/**
 * A function that gets the current hovering position of the mouse
 * @param drawing canvas for columns, the event about the location of the mouse
 * @return the xy coordinates of the mouse position
 */
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

/**
 * Calculates the distance between the mouse position and a column point.
 * @param the position of the mouse, the xy point of one column
 * @return boolean value if the mouse is near a column
 */
function distanceCheck(mousePos, colPos) {
    var canvas = drawingWindow.document.getElementById("theCanvas");

    // Scaled points of the column based on the size of the canvas
    scaledX = (colPos[0] * canvas.width);
    scaledY = (canvas.height - colPos[1] * canvas.height) - 25;
    // distance between the mouse and the column
    var distance = Math.sqrt(Math.pow(mousePos.x - scaledX, 2) + Math.pow(mousePos.y - scaledY, 2));

    return distance;
}

/**
 * Test the mouse position against the rest of the columns.
 * @param the position of the mouse on the canvas
 * @return the name of the column the mouse is over
 **/
function testMouseToCol(mousePos, nameArray) {
    var colPos = [];
    var colosestColIndex = -1;
    var retName = "No Column";
    for (var i = 0; i < points.length; i++) {
        colPos = [points[i][0], points[i][1]];
        if (distanceCheck(mousePos, colPos) <= 5) { // finds the first column near the mouse position
            if (colosestColIndex === -1 || colosestColIndex > distanceCheck(mousePos, colPos)) {
                colosestColIndex = i;
                retName = nameArray[i];
            }
        }
    }
    return retName;
}

/*
 * Display helper methods
 */
/**
 * Rewrites the UI-display to have the name of the nearest column to the mouse position
 * @param the name of the coulmn nearest to the mouse position
 */
function reWrite(message, id) {
    var canvas = drawingWindow.document.getElementById("theCanvas");
    var context = canvas.getContext("2d");
    drawingWindow.document.getElementById(id).innerHTML = id + ": <br>" + message;
}

/**
 * Resizes the canvas when the size of the drawingWindow changes
 */
function resizeCanvas() {
    var canvas = drawingWindow.document.getElementById("theCanvas");
    var maxLength = Math.max(drawingWindow.innerWidth, drawingWindow.innerHeight);

    canvas.width = maxLength * .95;
    canvas.height = maxLength * .95;
    var context = canvas.getContext("2d");

    isQuickZoomedIn = false;
    clickFunction();
}

/**
 * A double click method to zoom in on a certain position
 */
function quickZoom() {
    var canvas = drawingWindow.document.getElementById("theCanvas");
    if (!isQuickZoomedIn) {
        zoomIn();
        isQuickZoomedIn = true;

        // Auto scrolls the drawingWindow to center about the zoom location
        drawingWindow.scrollBy(canvas.width / 4, canvas.height / 4);
    } else {
        zoomOut();
        drawingWindow.scrollTo((canvas.width / 2 - (drawingWindow.innerWidth / 2)), (canvas.height / 2 - (drawingWindow.innerHeight / 2)));
        isQuickZoomedIn = false;
    }
}

/**
 * Zooms in on a scale of 2
 */
function zoomIn() {
    var canvas = drawingWindow.document.getElementById("theCanvas");
    canvas.width = canvas.width * 2;
    canvas.height = canvas.height * 2;
    clickFunction();
}

/**
 * Zooms out on a scale of .5
 */
function zoomOut() {
    var canvas = drawingWindow.document.getElementById("theCanvas");
    canvas.width = canvas.width / 2;
    canvas.height = canvas.height / 2;
    clickFunction();
}

/*
 * Drawing Methods
 */
/**
 * Helper function to draw the Comparison Triangle
 * @param The drawing canvas, the "pen" for drawing, and space for drawing
 */
function drawComparisonTriangle(canvas, context, drawingGap) {
    triangleHeight = Math.sqrt(canvas.height * canvas.height - (canvas.width / 2) * (canvas.width / 2));

    // Triangle Section
    context.beginPath();
    context.moveTo(0, canvas.height - drawingGap);
    context.lineTo(canvas.width, canvas.height - drawingGap);
    context.lineTo(canvas.width / 2, (canvas.height - triangleHeight) - drawingGap);
    context.lineTo(0, canvas.height - drawingGap);
    context.closePath();
    context.strokeStyle = "#000000";
    context.stroke();

    // Labels
    context.font = "bold 32px Arial";
    context.fillText("S", (canvas.width / 8), canvas.height / 2);
    context.fillText("C", canvas.width - (canvas.width / 8), canvas.height / 2);
    context.textAlign = "center";
    context.fillText("B", canvas.width / 2, canvas.height);
}

/**
 * Plots each column as a point in the triangle
 * @param points of the columns being plotted, point that will be
 * highlighted, the drawing canvas, the "pen" for drawing, and size
 * of the points being plotted
 */
function plotColumns(columns, columnOfIntrest, canvas, context, radius) {
    //For loop for each column
    var colInt;
    for (var i = 0; i < columns.length; i++) {
        // Checks if the column is the column of interest
        if (columnOfIntrest[0] == columns[i][0] &&
            columnOfIntrest[1] == columns[i][1]) {
            colInt = [columns[i][0], columns[i][1]];
        } else {
            context.strokeStyle = "#3D352A";
        }

        // Drawing the point
        context.beginPath();
        context.arc(columns[i][0] * canvas.width, (canvas.height - columns[i][1] * canvas.height) - radius * radius, radius, 0, 2 * Math.PI, false);
        context.closePath();
        context.stroke();
    }
    // Drawing the point
    context.strokeStyle = "#FF0000";
    context.beginPath();
    context.arc(colInt[0] * canvas.width, (canvas.height - colInt[1] * canvas.height) - radius * radius, radius, 0, 2 * Math.PI, false);
    context.closePath();
    context.stroke();
}

/*
 * Column Math Methods
 */
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
        } else { // max calc
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
        var scaled = xArray[i] / (xArray[i] + nArray1[i] + nArray2[
            i]);
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
 * Scales points
 * @params array of x, y points each in array
 * returns array of [x,y]
 */
var makePoints = function (xArray, yArray) {
    var tempArray = [];
    for (var i = 0; i < xArray.length; i++) {
        var x = xArray[i];
        var y = yArray[i];

        tempArray[i] = [x, y];
    }
    return tempArray;
}

function helpFunction() {
    helpWindowDetails = "resizable=yes, width=%s1, height=%s2";

    // Replaces the value holder with the correct value
    helpWindowDetails = helpWindowDetails.replace("%s1", "" + drawingWindowHeight).replace("%s2", "" + drawingWindowWidth);

    // Creates the window with the appropriate details
    helpWindow = window.open("", "_blank", helpWindowDetails);

    helpWindow.document.write("- Each column is represented as a hollow circle on the graph. <br>- Hover over a circle to view  the column it represents. Click on a column to select it. <br>- Zoom in by clicking the '+' button <br>- Zoom out by clicking the '-' button. <br>- Quick zoom in and out by double clicking anywhere on the graph.");
    }

/**
 * Action Listener to draw the triangle and plot the points
 */
function clickFunction() {
    // Checks to see if the drawingWindow needs to be initialized
    // or if it needs to re-opened
    if (!(drawingWindow) || drawingWindow.closed) {
        drawingWindowInit();
    }
    if (!drawingWindow.closed) {
        window.blur();
        drawingWindow.focus();
    }

    /*
     * This anonymous function gets the data from a csv
     * we must call all functions from within here
     * this is because getting is asynchronous
     */
    var xy = [];
    var dataset;
    // This below will make an array based off of the headers we
    // want from the csv file.
    d3.csv("Http://hplccolumns.org/database.csv", function (data) {
        dataset = data.map(function (d) {
            return [+d["id"], d["name"], +d["H"], +d["S"], +d[
                "B"], +d["C28"]];
        });

        /*
         * @param : the index in dataset from which to draw data
         * return : an array of one kind of data
         */
        var makeArray = function (k) {
            tempArray = [];
            for (var i = 0; i < dataset.length; i++) {
                if (k === 1) {
                    tempArray.push(dataset[i][k]);
                } else {
                    tempArray.push(parseFloat(dataset[i][k]));
                }
            }
            return tempArray;
        }
        var hArray = makeArray(2);
        var sArray = makeArray(3);
        var bArray = makeArray(4);
        var cArray = makeArray(5);
        var nameArray = makeArray(1);

        var canvas = drawingWindow.document.getElementById(
            "theCanvas");
        var context = canvas.getContext("2d");
        var radius = 5;

        /**
         * Does all the work required other than making initial arrays
         * @params : data for each variable from the csv
         * returns : 2D array of x and y values
         */
        var getData = function (hArray, sArray, bArray, cArray) {
            var sNorm = normalizeCols(sArray, hArray);
            var bNorm = normalizeCols(bArray, hArray);
            var cNorm = normalizeCols(cArray, hArray);

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
        points = xy;

        // Clears canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draws comparison triangle
        drawComparisonTriangle(canvas, context, radius * radius);

        columnPointsToBePlotted = xy;

        // Column of interest WILL GET SOME HOW
        // TODO
        var chosenColumn = columnPointsToBePlotted[0];

        // Plots the columns
        plotColumns(xy, chosenColumn, canvas, context, radius);

        var canvas = drawingWindow.document.getElementById('theCanvas');

        // Action Listeners
        drawingWindow.addEventListener('resize', resizeCanvas, false);
        drawingWindow.addEventListener('click', function (evt) {
            var mousePos = getMousePos(canvas, evt);
            reWrite(testMouseToCol(mousePos, nameArray), "Selected Column");
        }, false);

        drawingWindow.addEventListener('dblclick', quickZoom, false);
        drawingWindow.document.getElementById('inButton').onclick = zoomIn;
        drawingWindow.document.getElementById('outButton').onclick = zoomOut;
        drawingWindow.document.getElementById('downloadButton').onclick = function () {
            pictureWindowDetails = "resizable=yes, width=%s1, height=%s2";

            // Replaces the value holder with the correct value
            pictureWindowDetails = pictureWindowDetails.replace("%s1", "" + drawingWindow.innerWidth).replace("%s2", "" + drawingWindow.innerHeight);

            // Creates the window with the appropriate details
            pictureDrawingWindow = drawingWindow.open(canvas.toDataURL(), "_blank", pictureWindowDetails);
        }

        // adds listener for Mouse Move
        canvas.addEventListener('mousemove', function (evt) {
            // gets mouse pos and creates the message the will be sent to the window. 
            var mousePos = getMousePos(canvas, evt);
            reWrite(testMouseToCol(mousePos, nameArray), "Curser Column");
        }, false);
    });
}