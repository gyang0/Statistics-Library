/**
 * Statistics library for JavaScript. Includes most methods.
 * Correctness is not guaranteed.
 * 
 * TODO: Ctrl-F for 'TODO' to find things I need to do.
 * 
 * List of methods:
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
 *     SRCC (spearman-rank correlation coefficient)
 *     Chi-square test for goodness of fit
 *     Chi-square test for association
 * 
 * Graphical
 *     Scatterplots
 *     Line graph
 *     Pie charts
 *     Bar graphs
 *     Histograms
 * 
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
    function srcc(data){}

    function chiSquareGoodnessOfFit(){}

    function chiSquareAssociation(){}

    /* Scatterplot outline
             *      var plot = STATS.newPlot(_title_, _x_, _y_);
             *      plot.setX(_title_, _spacing_, _numTicks_);
             *      plot.setY(_title_, _spacing_, _numTicks_);
             *      plot.addData(_[data]_);
             *      plot.addLine(_[calculated line of best fit OR custom line]_);
    */

    /*
    Also pie graphs, bar graphs, histograms
    bar graphs have groups (like languages: French, Chinese, English, Spanish, etc.)
    histograms have continuous x-axis (like 5-10, 50-15, 15-20, 20-25, etc.)

    Maybe a little note about z-scores and t-scores?
    */

    // TODO: add line width and color, font customization through a method called 'setStyle.'
    var scatterplot = (function(){
        scatterplot = function(title, x, y){
            this.title = title;
            this.x = x;
            this.y = y;

            // Defaults
            this.xStartNum = 0;
            this.yStartNum = 0;
            this.xSpacing = 10;
            this.ySpacing = 10;
            this.numXTicks = 3;
            this.numYTicks = 3;
            this.data = [];
        };

        scatterplot.prototype = {
            setX: function(xTitle, xStartNum, xSpacing, numXTicks){
                this.xTitle = xTitle;
                this.xStartNum = xStartNum;
                this.xSpacing = xSpacing;
                this.numXTicks = numXTicks;
            },
            setY: function(yTitle, yStartNum, ySpacing, numYTicks){
                this.yTitle = yTitle;
                this.yStartNum = yStartNum;
                this.ySpacing = ySpacing;
                this.numYTicks = numYTicks;
            },
            addData: function(data){
                this.data = data;
            },
            draw: function(ctx){
                // Scatterplot title
                ctx.font = "20px serif";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.fillText(this.title, this.x + this.xSpacing*this.numXTicks/2, this.y - this.ySpacing*(this.numYTicks + 1));

                // x-axis title
                ctx.font = "17px serif";
                ctx.fillText(this.xTitle, this.x+ this.xSpacing*this.numXTicks/2, this.y + this.ySpacing);

                // y-axis title
                ctx.save();
                ctx.translate(this.x - this.xSpacing, this.y - this.ySpacing*this.numYTicks/2);
                ctx.rotate(3 * Math.PI/2);
                ctx.fillText(this.yTitle, 0, 0);
                ctx.translate(-(this.x - this.xSpacing), -(this.y - this.ySpacing*this.numYTicks/2));
                ctx.restore();

                // Axes
                drawLine(ctx, this.x, this.y, this.x, this.y - this.ySpacing*this.numYTicks); // y-axis
                drawLine(ctx, this.x, this.y, this.x + this.xSpacing*this.numXTicks, this.y); // x-axis

                ctx.font = "12px serif";
                
                // y-axis bars
                for(var i = 0; i <= this.numXTicks; i++){
                    ctx.fillText(i, this.x - 20, this.y - i*this.ySpacing + 3);
                    if(i > 0) drawLine(ctx, this.x - 3, this.y - i*this.ySpacing, this.x + 3, this.y - i*this.ySpacing);
                }

                // x-axis bars
                for(var i = 0; i <= this.numXTicks; i++){
                    ctx.fillText(i, this.x + i*this.xSpacing - 3, this.y + 20);
                    if(i > 0) drawLine(ctx, this.x + i*this.xSpacing, this.y - 3, this.x + i*this.xSpacing, this.y + 3);
                }

                // dots
                for(var i = 0; i < this.data.length; i++){
                    ctx.fillStyle = "black";
                    ctx.beginPath();
                    ctx.ellipse(this.x + this.data[i][0] * this.xSpacing, this.y - this.data[i][1] * this.ySpacing, 2, 2, 0, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                }
            },
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
                    drawLine(ctx, this.x + this.xSpacing*x1, this.y - this.ySpacing*(a*x1 + b),
                                  this.x + this.xSpacing*x2, this.y - this.ySpacing*(a*x2 + b));


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
                    drawLine(ctx, this.x + this.xSpacing*x1, this.y - this.ySpacing*(a*x1 + b),
                                  this.x + this.xSpacing*x2, this.y - this.ySpacing*(a*x2 + b));


                    // Returns information needed for equation of the line as [slope, y-intercept]
                    return [a, b];
                }
            }
        };

        return scatterplot;
    })();

    var lineGraph = (function(){
        lineGraph = function(title, x, y){
            this.title = title;
            this.x = x;
            this.y = y;

            this.data = [];
        };
        lineGraph.prototype = {
            addData: function(data){
                this.data = data;
            },
            draw: function(data){}
        };
    })();

    var pieGraph = (function(){
        pieGraph = function(title, x, y){
            this.title = title;
            this.x = x;
            this.y = y;
        };
        pieGraph.prototype = {
            addData: function(data){

            }
        };
    })();

    var barGraph = (function(){
        barGraph = function(){};
        barGraph.prototype = {};
    })();

    var histogram = (function(){
        histogram = function(){};
        histogram.prototype = {};
    })();


    /* Helper methods */
    function drawLine(ctx, fromX, fromY, toX, toY){
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
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
