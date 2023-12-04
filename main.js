/**
 * Statistics library for JavaScript. Includes most methods.
 * Correctness is not guaranteed.
 * 
 * TODO: add more customizability to scatterplots, line graphs, bar graphs, histograms, and pie charts.
 * TODO: add fix for scatterplot lines with slope larger than 1. Restrict both the x- and y-axis to [0, MAX_VAL]
 * TODO: make negative axes possible
 * TODO: add documentation
 * TODO: comment methods
 * TODO: numXTicks and numYTicks are slightly off?
 * 
 * 
 * Constants
 *     [DONE] z-score for 95% confidence
 *     [DONE] z-score for 99% confidence
 * 
 * Basics
 *     [DONE] Mean
 *     [DONE] Median
 *     [DONE] Mode
 *     [DONE] Variance
 *     [DONE] Standard Deviation
 *     [DONE] Confidence intervals
 *     [DONE] Confidence intervals for mean differences
 * 
 * Tests
 *     Two-sample t-test
 *     Paired t-test
 *     Mann-Whitney test
 *     Kruskall-Wallis test
 *     ANOVA (analysis of variance)
 * 
 * Correlation
 *     [DONE] PMCC (product-moment correlation coefficient)
 *     [DONE] SRCC (spearman-rank correlation coefficient)
 *     Chi-square test for goodness of fit
 *     Chi-square test for association
 * 
 * Graphical
 *     [DONE] Scatterplots
 *     [DONE] Line graph
 *     [DONE] Pie charts
 *     [DONE] Bar graphs
 *     Histograms
 * 
 * Other
 *     Styling options for graphs
 * 
 * @author Gene Yang
 * @version June 6th, 2023
 */ 
var STATS = (function(){
    /**
     * Constants
     *     z95 is the z-score for a 95% confidence interval.
     *     z99 is the z-score for a 99% confidence interval.
     */
    const z95 = 1.96;
    const z99 = 2.58;

    /**
     * Finds the mean of a specified array.
     * @param arr - The array whose mean is found
     * @return - The mean of the parameter array
     */ 
    function mean(arr){
        var sum = 0;
        for(var i = 0; i < arr.length; i++){
            sum += arr[i];
        }
        return sum/arr.length;
    }
    
    /**
     * Finds the median of a specified array.
     * @param arr - The array whose median is found
     * @return - The median of the array
     */ 
    function median(arr){
    	arr.sort();
        if(arr.length % 2 == 1){
        	return arr[Math.floor(arr.length/2)];
        }
        else {
        	return (arr[arr.length/2 - 1] + arr[arr.length/2])/2;
        }
    }
    
    /**
     * Finds the mode of a specified array
     * @param arr - The array to find the mode of
     * @return - An array of all modes.
     *           If the array size is 0, then the function returns undefined.
     *           If there's only 1 mode, the function returns an array with one item: that mode.
     *           If there are multiple modes, the function returns an array of all those modes.
     */
    function mode(arr){
        // Sort array
        arr.sort();

        // Check the elements that are equal
        var prevEl = arr[0];
        var curLength = 1,
            longestLength = 0;

        // Answer
        var modes = [];

        for(var i = 1; i < arr.length; i++){
            // Conditions where we need to check
            if(prevEl != arr[i]){
                // Another mode found
                if(curLength == longestLength){
                    modes.push(prevEl);
                }

                // One new mode found
                else if(curLength > longestLength){
                    modes = [prevEl];
                    longestLength = curLength;
                }

                prevEl = arr[i];
                curLength = 1;

            } else {
                curLength++;
            }
        }


        // Check for final elements
        if(curLength == longestLength) modes.push(prevEl);
        else if(curLength > longestLength) modes = [prevEl];

        return modes;
    }
    
    /**
     * Returns the sample variance of a dataset
     * @param arr - The dataset
     * @return - The sample variance of the dataset
     */ 
    function variance(arr){
        var xbar = mean(arr),
            sum = 0;
        for(var i = 0; i < arr.length; i++){
            sum += (xbar - arr[i])*(xbar - arr[i]);
        }

        return sum/(arr.length - 1);
    }

    /**
     * Returns the sample standard deviation of a specified dataset.
     * @param arr - The dataset of numbers
     * @return - The standard deviation of a dataset (square root of sample variance)
     */
    function stdDev(arr){
        return Math.sqrt(variance(arr));
    }
    
    /**
     * Finds the sample confidence interval of a dataset.
     * @param arr - The dataset
     * @param confidence - Either 95 or 99, the default is 95.
     * @return - An array of two elements: the lower bound and the upper bound
     */ 
    function confidenceInterval(arr, confidence){
        var xbar = this.mean(arr);
        var arg;
        if(confidence == 99)
            arg = z99 * this.stdDev(arr)/Math.sqrt(arr.length);
        else {
            // Warning message just in case.
            if(confidence != 95)
                console.log("STATS.confidenceInterval(): only 95% and 99% are supported, defaulted to 95% confidence.");

            arg = z95 * this.stdDev(arr)/Math.sqrt(arr.length);
        }

        return [xbar - arg, xbar + arg];
    }

    /**
     * Finds the confidence interval for mean differences between two datasets.
     * @param arr1 - Dataset #1
     * @param arr2 - Dataset #2
     * @param confidence - Either 95 or 99, the default is 95.
     * @return - An array of two elements: the lower bound and the upper bound
     */ 
    function CIMeanDifference(arr1, arr2, confidence){
        var arg1 = (this.mean(arr1) - this.mean(arr2));
        var arg2;
        if(confidence == 99)
            arg2 = z99 * Math.sqrt(this.variance(arr1)/arr1.length + this.variance(arr2)/arr2.length);
        else {
            // Warning message just in case.
            if(confidence != 95)
                console.log("STATS.CFMeanDifference(): only 95% and 99% are supported, defaulted to 95% confidence.");

            arg2 = z95 * Math.sqrt(this.variance(arr1)/arr1.length + this.variance(arr2)/arr2.length);
        }

        return [arg1 - arg2, arg1 + arg2];
    }

    /**
     * Finds the Product Moment Correlation Coefficient of a dataset.
     * Applicable to interval and ratio scale data.
     * @param data - An array of 2D elements in the form [x, y], e,g, [[x1, y1], [x2, y2], [x3, y3]...]
     * @return - The correlation coefficient, a number in the range [-1, 1].
     */
    function pmcc(data){
        // Get means of x and y observations
        var xBar = 0,
            yBar = 0;
        for(var i = 0; i < data.length; i++){
            xBar += data[i][0];
            yBar += data[i][1];
        }
        xBar /= data.length;
        yBar /= data.length;

        var sum0 = 0,
            sum1 = 0,
            sum2 = 0;

        for(var i = 0; i < data.length; i++){
            sum0 += (data[i][0] - xBar) * (data[i][1] - yBar);
            sum1 += (data[i][0] - xBar) * (data[i][0] - xBar);
            sum2 += (data[i][1] - yBar) * (data[i][1] - yBar);
        }

        return sum0/Math.sqrt(sum1 * sum2);
    }
    
    /**
     * Finds the Spearman Rank Correlation Coefficient of a dataset.
     * Applicable to ordinal, interval, and ratio scale data.
     * @param data - An array of 2D elements in the form [x, y], e,g, [[x1, y1], [x2, y2], [x3, y3]...]
     * @return - The correlation coefficient, a number in the range [-1, 1].
     */
    function srcc(data){
        // 1. Store data as an array of [number, original_position], [number, original_position], etc.
        //      original_position is the original position in which the number has appeared.
        var xData = [],
            yData = [];
        for(var i = 0; i < data.length; i++){
            xData.push([data[i][0], i]);
            yData.push([data[i][1], i]);
        }

        // 2. Sort the elements.
        xData.sort(function(arr1, arr2){ return arr1[0] - arr2[0]; });
        yData.sort(function(arr1, arr2){ return arr1[0] - arr2[0]; });

        // 3. Now assign ranks to each of the numbers given, found from the IDs.
        var xRank = new Array(data.length),
            yRank = new Array(data.length);
        for(var i = 0; i < data.length; i++){
            xRank[xData[i][1]] = i;
            yRank[yData[i][1]] = i;
        }

        // 4. Find the sum of d_i for the data set.
        var sum_di = 0;
        for(var i = 0; i < xRank.length; i++){
            sum_di += Math.abs(xRank[i] - yRank[i]);
        }

        // 5. Apply the equation
        return 1 - (6 * sum_di)/(data.length * (data.length*data.length - 1));
    }

    function chiSquareGoodnessOfFit(){}

    function chiSquareAssociation(){}

    /*
    Also pie graphs, bar graphs, histograms
    bar graphs have groups (like languages: French, Chinese, English, Spanish, etc.)
    histograms have continuous x-axis (like 5-10, 50-15, 15-20, 20-25, etc.)

    Maybe a little note about z-scores and t-scores?
    */

    /**
     * Creates a scatterplot with options to add a line of best fit.
     */ 
    var scatterplot = (function(){
        /**
         * Constructor for the scatterplot
         * @param title - The title of the scatterplot
         * @param x - The x-coordinate of the scatterplot, counting from the origin.
         * @param y - The y-coordinate of the scatterplot, counting from the origin.
         */ 
        scatterplot = function(title, x, y){
            this.title = title;
            this.x = x;
            this.y = y;

            // Defaults
            this.xTitle = "";
            this.xStartNum = 0;
            this.xValueSpacing = 1;
            this.xTickSpacing = 10;
            this.numXTicks = 3;

            this.yTitle = "";
            this.yStartNum = 0;
            this.yValueSpacing = 1;
            this.yTickSpacing = 10;
            this.numYTicks = 3;

            this.data = [];
        };

        scatterplot.prototype = {
            /**
             * Sets the relevant details for the x-axis.
             * @param xTitle - The title for the x-axis
             * @param xStartNum - The starting number for the x-axis
             * @param xSpacing - The spacing, in pixels, between each tick mark on the x-axis
             * @param numXTicks - The number of ticks on the x-axis
             */ 
            setX: function(xTitle, xStartNum, xValueSpacing, xTickSpacing, numXTicks){
                this.xTitle = xTitle;
                this.xStartNum = xStartNum;
                this.xValueSpacing = xValueSpacing;
                this.xTickSpacing = xTickSpacing;
                this.numXTicks = numXTicks;
            },

            /**
             * Sets the relevant details for the y-axis.
             * @param yTitle - The title for the y-axis
             * @param yStartNum - The starting number for the y-axis
             * @param ySpacing - The spacing, in pixels, between each tick mark on the y-axis
             * @param numYTicks - The number of ticks on the y-axis
             */ 
            setY: function(yTitle, yStartNum, yValueSpacing, yTickSpacing, numYTicks){
                this.yTitle = yTitle;
                this.yStartNum = yStartNum;
                this.yValueSpacing = yValueSpacing;
                this.yTickSpacing = yTickSpacing;
                this.numYTicks = numYTicks;
            },

            /**
             * Sets the coordinate data for the scatterplot.
             * @param data - The data for the line graph in the form of the points' coordinates.
             *               Should be a nested array in the form [[x1, y1], [x2, y2], [x3, y3]...]
             */
            addData: function(data){
                this.data = data;
            },

            /**
             * Draws the scatterplot.
             * @param ctx - The canvas rendering context
             */ 
            draw: function(ctx){
                graphSetup(ctx, this);
                xAxisSetup(ctx, this);
                yAxisSetup(ctx, this);

                ctx.fillStyle = "black";

                // dots
                for(var i = 0; i < this.data.length; i++){
                    if(this.data[i][0] >= this.xStartNum && this.data[i][1] >= this.yStartNum){
                        
                        ctx.beginPath();
                        ctx.ellipse(this.x + (this.data[i][0] - this.xStartNum) * this.xTickSpacing/this.xValueSpacing,
                                    this.y - (this.data[i][1] - this.yStartNum) * this.yTickSpacing/this.yValueSpacing, 2, 2, 0, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                    }
                }
            },

            /**
             * Calculates, draws, and returns the line of best fit.
             * Two options: simple linear regression and model 2 linear regression.
             * @param type - The type of linear regression to use, either "simple" or "model2." Default is "model2."
             * @param ctx - The canvas rendering context
             * @return - An array in the form [a, b], where the regression line is y = ax + b.
             */ 
            lineOfBestFit: function(type, ctx){
                // Simple linear regression
                if(type == "simple"){
                    var sumX = 0,
                        sumY = 0,
                        sumXY = 0,
                        sumXSquared = 0,
                        n = this.data.length;

                    for(var i = 0; i < this.data.length; i++){
                        sumX += this.data[i][0];
                        sumY += this.data[i][1];
                        sumXY += (this.data[i][0] * this.data[i][1]);
                        sumXSquared += (this.data[i][0] * this.data[i][0]);
                    }

                    // Mean center and slope
                    var slope = (n*sumXY - sumX*sumY)/(n*sumXSquared - sumX*sumX);
                    var meanCenter = [sumX/n, sumY/n];

                    // Equation form y = ax + b
                    // y - y1 = slope * (x - x1)
                    // y - meanCenter[1] = slope * (x - meanCenter[0])
                    // y - meanCenter[1] = slope*x - slope*meanCenter[0]
                    // y = slope*x + (-slope*meanCenter[0] + meanCenter[1])
                    var a = slope,
                        b = (-slope*meanCenter[0] + meanCenter[1])

                    // Draws the line on the graph.
                    // Using the equation y = ax + b, the first point on the graph is when x = this.xStartNum
                    //                                the second point is when x = this.xStartNum + this.numXTicks
                    ctx.fillStyle = "black";
                    var x1 = this.xStartNum,
                        x2 = this.xStartNum + this.numXTicks;
                    drawLine(ctx, this.x + (x1 - this.xStartNum) * this.xTickSpacing/this.xValueSpacing,
                                  this.y - this.yTickSpacing/this.yValueSpacing * (a*x1 + b - this.yStartNum),
                                  this.x + (x2 - this.xStartNum) * this.xTickSpacing/this.xValueSpacing,
                                  this.y - this.yTickSpacing/this.yValueSpacing * (a*x2 + b - this.yStartNum));


                    // Returns information needed for equation of the line as [slope, y-intercept]
                    return [a, b];
                }

                // Model 2 linear regression
                else {
                    // Warning message
                    if(type != "model2")
                        console.log("STATS.lineOfBestFit(): unrecognized type parameter, defaulted to 'model2.'");

                    // y = ax + b
                    var x = [],
                        y = [],
                        sumX = 0,
                        sumY = 0;

                    for(var i = 0; i < this.data.length; i++){
                        x.push(this.data[i][0]);
                        y.push(this.data[i][1]);
                        sumX += this.data[i][0];
                        sumY += this.data[i][1];
                    }

                    // It's either a positive or negative correlation (+- slope, we just have to know which one).
                    slope = stdDev(x)/stdDev(y);
                    slope *= (pmcc(this.data) < 0 ? -1 : 1);

                    // Slope and mean center
                    var meanCenter = [mean(x), mean(y)];
                    var a = slope,
                        b = (-slope*meanCenter[0] + meanCenter[1])

                    // Draws the line on the graph.
                    ctx.fillStyle = "black";
                    var x1 = this.xStartNum,
                        x2 = this.xStartNum + this.numXTicks;
                    drawLine(ctx, this.x + this.xTickSpacing/this.xValueSpacing * (x1 - this.xStartNum),
                                  this.y - this.yTickSpacing/this.yValueSpacing * (a*x1 + b - this.yStartNum),
                                  this.x + this.xTickSpacing/this.xValueSpacing * (x2 - this.xStartNum),
                                  this.y - this.yTickSpacing/this.yValueSpacing * (a*x2 + b - this.yStartNum));


                    // Returns information needed for equation of the line as [slope, y-intercept]
                    return [a, b];
                }
            },

            /**
             * Draws a custom line specified by the user onto the scatterplot.
             * @param a - The slope of the line, which is y = ax + b
             * @param b - The y-intercept of the line, which is y = ax + b.
             * @param ctx - The canvas rendering context
             */
            customLine: function(a, b, ctx){
                var x1 = this.xStartNum,
                    x2 = this.xStartNum + this.numXTicks;
                drawLine(ctx, this.x + this.xTickSpacing/this.xValueSpacing * (x1 - this.xStartNum),
                              this.y - this.yTickSpacing/this.yValueSpacing * (a*x1 + b - this.yStartNum),
                              this.x + this.xTickSpacing/this.xValueSpacing * (x2 - this.xStartNum),
                              this.y - this.yTickSpacing/this.yValueSpacing * (a*x2 + b - this.yStartNum));
            }
        };

        return scatterplot;
    })();

    /**
     * Creates a line graph.
     */ 
    var lineGraph = (function(){
        /**
         * Constructor for the line graph
         * @param title - The title of the line graph
         * @param x - The x-coordinate of the line graph, or the origin on the axes.
         * @param y - The y-coordinate of the line graph, or the origin on the axes.
         */ 
        lineGraph = function(title, x, y){
            this.title = title;
            this.x = x;
            this.y = y;

            // Defaults
            this.xTitle = "";
            this.xStartNum = 0;
            this.xValueSpacing = 1;
            this.xTickSpacing = 10;
            this.numXTicks = 3;

            this.yTitle = "";
            this.yStartNum = 0;
            this.yValueSpacing = 1;
            this.yTickSpacing = 10;
            this.numYTicks = 3;

            this.data = [];
        };

        lineGraph.prototype = {
            /**
             * Sets the relevant details for the x-axis.
             * @param xTitle - The title for the x-axis
             * @param xStartNum - The starting number for the x-axis
             * @param xSpacing - The spacing, in pixels, between each tick mark on the x-axis
             * @param numXTicks - The number of ticks on the x-axis
             */ 
            setX: function(xTitle, xStartNum, xValueSpacing, xTickSpacing, numXTicks){
                this.xTitle = xTitle;
                this.xStartNum = xStartNum;
                this.xValueSpacing = xValueSpacing;
                this.xTickSpacing = xTickSpacing;
                this.numXTicks = numXTicks;
            },

            /**
             * Sets the relevant details for the y-axis.
             * @param yTitle - The title for the y-axis
             * @param yStartNum - The starting number for the y-axis
             * @param ySpacing - The spacing, in pixels, between each tick mark on the y-axis
             * @param numYTicks - The number of ticks on the y-axis
             */ 
            setY: function(yTitle, yStartNum, yValueSpacing, yTickSpacing, numYTicks){
                this.yTitle = yTitle;
                this.yStartNum = yStartNum;
                this.yValueSpacing = yValueSpacing;
                this.yTickSpacing = yTickSpacing;
                this.numYTicks = numYTicks;
            },

            /**
             * Sets the coordinate data for the line graph.
             * @param data - The data for the line graph in the form of coordinates.
             *               Should be a nested array in the form [[x1, y1], [x2, y2], [x3, y3]...]
             *               Order doesn't matter.
             */ 
            addData: function(data){
                this.data = data;

                // Sort data depending on x (the first variable).
                this.data.sort(function(arr1, arr2){
                    if(arr1[0] == arr2[0]) return arr2[1] - arr1[1];
                    else return arr2[0] - arr1[0];
                });
            },

            /**
             * Draws the line graph.
             * @param ctx - The canvas rendering context
             */
            draw: function(ctx){
                graphSetup(ctx, this);
                xAxisSetup(ctx, this);
                yAxisSetup(ctx, this);

                // Data
                var prevX = this.x + (this.data[0][0] - this.xStartNum) * this.xTickSpacing/this.xValueSpacing,
                    prevY = this.y - (this.data[0][1] - this.yStartNum) * this.yTickSpacing/this.yValueSpacing;

                for(var i = 1; i < this.data.length; i++){
                    drawLine(ctx, prevX, prevY, this.x + (this.data[i][0] - this.xStartNum) * this.xTickSpacing/this.xValueSpacing,
                                                this.y - (this.data[i][1] - this.yStartNum) * this.yTickSpacing/this.yValueSpacing);

                    prevX = this.x + (this.data[i][0] - this.xStartNum) * this.xTickSpacing/this.xValueSpacing;
                    prevY = this.y - (this.data[i][1] - this.yStartNum) * this.yTickSpacing/this.yValueSpacing;
                }
            }
        };

        return lineGraph;
    })();

    var pieGraph = (function(){
        pieGraph = function(title, x, y, radius){
            this.title = title;
            this.x = x;
            this.y = y;
            this.radius = radius;

            this.data = [];
            this.colors = [
                ["rgb(66, 135, 245)"],
                ["rgb(245, 66, 75)"],
                ["rgb(102, 190, 114)"],
                ["rgb(189, 187, 80)"],
                ["rgb(133, 101, 13)"],
            ];
        };
        pieGraph.prototype = {
            addData: function(data){
                this.data = data;

                // Sort to display the greater proportions first
                this.data.sort((arr1, arr2) => {
                    return arr2[1] - arr1[1];
                });
            },
            draw: function(ctx){
                // Pie graph shape
                var prevAngle = -Math.PI/2;
                for(var i = 0; i < this.data.length; i++){

                    ctx.beginPath();
                        ctx.fillStyle = this.colors[i % this.colors.length];
                        
                        ctx.moveTo(this.x, this.y);
                        ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, prevAngle, prevAngle + Math.PI*2 * this.data[i][1]);
                        
                        ctx.fill();
                    ctx.closePath();
                    
                    prevAngle = prevAngle + Math.PI*2 * this.data[i][1];
                }

                // Legend
                ctx.fillStyle = "black";
                ctx.textAlign = "left";
                ctx.font = "15px serif";
                for(var i = 0; i < this.data.length; i++){
                    // Small dot
                    ctx.beginPath();
                        ctx.fillStyle = this.colors[i % this.colors.length];
                        ctx.ellipse(this.x + this.radius + 30, this.y + this.radius/3 + i*20 - 4, 4, 4, 0, 0, Math.PI*2);
                        ctx.fill();

                        ctx.fillStyle = "black";
                        ctx.fillText(this.data[i][0] + " (" + (this.data[i][1]*100).toFixed(2) + "%)", this.x + this.radius + 40, this.y + this.radius/3 + i*20);                    
                    ctx.closePath();
                }

            }
        };

        return pieGraph;
    })();

    var barGraph = (function(){
        barGraph = function(title, x, y){
            this.title = title;
            this.x = x;
            this.y = y;

            // Defaults
            this.xTitle = "Season";
            this.xTickSpacing = 60;
            this.numXTicks = 4;

            this.yTitle = "Percentage";
            this.yStartNum = 0;
            this.yValueSpacing = 25;
            this.yTickSpacing = 60;
            this.numYTicks = 3;

            this.data = [];
            this.colors = [
                ["rgb(66, 135, 245)"],
                ["rgb(245, 66, 75)"],
                ["rgb(102, 190, 114)"],
                ["rgb(189, 187, 80)"],
                ["rgb(133, 101, 13)"],
            ];
        };
        barGraph.prototype = {
            addData: function(data){
                this.data = data;
            },
            draw: function(ctx){
                graphSetup(ctx, this);
                yAxisSetup(ctx, this);

                for(let i = 0; i < this.data.length; i++){
                    ctx.beginPath();
                        ctx.fillStyle = this.colors[i % this.colors.length];
                        ctx.fillRect(this.x + this.xTickSpacing * i + this.xTickSpacing/4, this.y - this.data[i][1]/this.yValueSpacing * this.yTickSpacing, this.xTickSpacing/2, this.data[i][1]/this.yValueSpacing * this.yTickSpacing);
                    ctx.closePath();

                    // Labels
                    ctx.fillStyle = "black";
                    ctx.fillText(this.data[i][0], this.x + this.xTickSpacing * i + this.xTickSpacing/2, this.y + this.yTickSpacing/4);
                }
            }
        };

        return barGraph;
    })();

    var histogram = (function(){
        histogram = function(title, x, y){

        };
        histogram.prototype = {
            addData: function(){},
            draw: function(){}
        };

        return histogram;
    })();


    /* Helper methods */
    function drawLine(ctx, fromX, fromY, toX, toY){
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        ctx.closePath();
    }

    function graphSetup(ctx, obj){
        // Graph title
        ctx.font = "20px serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(obj.title, obj.x + obj.xTickSpacing*obj.numXTicks/2, obj.y - obj.yTickSpacing*(obj.numYTicks + 0.5));

        // x-axis title
        ctx.font = "17px serif";
        ctx.fillText(obj.xTitle, obj.x + obj.xTickSpacing*obj.numXTicks/2, obj.y + 40);

        // y-axis title
        ctx.save();
        ctx.translate(obj.x - 40, obj.y - obj.yTickSpacing*obj.numYTicks/2);
        ctx.rotate(3 * Math.PI/2);
        ctx.fillText(obj.yTitle, 0, 0);
        ctx.translate(-(obj.x - 40), -(obj.y - obj.yTickSpacing*obj.numYTicks/2));
        ctx.restore();

        // Axes
        drawLine(ctx, obj.x, obj.y, obj.x, obj.y - obj.yTickSpacing*obj.numYTicks); // y-axis
        drawLine(ctx, obj.x, obj.y, obj.x + obj.xTickSpacing*obj.numXTicks, obj.y); // x-axis
    }

    function xAxisSetup(ctx, obj){
        ctx.font = "12px serif";
        
        // x-axis bars
        for(var i = 0; i <= obj.numXTicks; i++){
            ctx.fillText(obj.xStartNum + i*obj.xValueSpacing, obj.x + i*obj.xTickSpacing - 3, obj.y + 20);
            if(i > 0) drawLine(ctx, obj.x + i*obj.xTickSpacing, obj.y - 3, obj.x + i*obj.xTickSpacing, obj.y + 3);
        }
    }

    function yAxisSetup(ctx, obj){
        ctx.font = "12px serif";
        
        // y-axis bars
        for(var i = 0; i <= obj.numYTicks; i++){
            ctx.fillText(obj.yStartNum + i*obj.yValueSpacing, obj.x - 20, obj.y - i*obj.yTickSpacing + 3);
            if(i > 0) drawLine(ctx, obj.x - 3, obj.y - i*obj.yTickSpacing, obj.x + 3, obj.y - i*obj.yTickSpacing);
        }
    }
    
    return {
        z95: z95,
        z99: z99,
    	
        mean: mean,
        mode: mode,
        median: median,
        stdDev: stdDev,
        variance: variance,
        confidenceInterval: confidenceInterval,
        CIMeanDifference: CIMeanDifference,

        pmcc: pmcc,
        srcc: srcc,
        
        chiSquareGoodnessOfFit: chiSquareGoodnessOfFit,
        chiSquareAssociation: chiSquareAssociation,
        
        scatterplot: scatterplot,
        lineGraph: lineGraph,
        pieGraph: pieGraph,
        barGraph: barGraph,
        histogram: histogram
    };
})();