/**
 * Statistics library for JavaScript. Includes most methods.
 * Correctness is not guaranteed.
 * 
 * TODO: Ctrl-F for 'TODO' to find things I need to do.
 * 
 * List of methods:
 * Constants
 *     z-score for 95% confidence
 *     z-score for 99% confidence
 * 
 * Basics
 *     Mean
 *     Median
 *     Mode
 *     Variance
 *     Standard Deviation
 *     Confidence intervals
 *     Confidence intervals for mean differences
 * 
 * Tests
 *     Two-sample t-test
 *     Paired t-test
 *     Mann-Whitney test
 *     Kruskall-Wallis test
 *     ANOVA (analysis of variance)
 * 
 * Correlation
 *     PMCC (product-moment correlation coefficient)
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
 * @version June 4th, 2023
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
     * @return The sample variance of the dataset
     */ 
    function variance(arr){
        var xbar = this.mean(arr),
            sum = 0;
        for(var i = 0; i < arr.length; i++){
            sum += (xbar - arr[i])*(xbar - arr[i]);
        }

        return sum/(arr.length - 1);
    }

    /**
     * Returns the sample standard deviation of a specified dataset.
     * @param arr - The dataset of numbers
     * @return the standard deviation of a dataset (square root of sample variance)
     */
    function stdDev(arr){
        return Math.sqrt(this.variance(arr));
    }
    
    /**
     * Finds the sample confidence interval of a dataset.
     * @param arr - The dataset
     * @param confidence - Either 95 or 99, the default is 95.
     * @return An array of two elements: the lower bound and the upper bound
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
     * @return An array of two elements: the lower bound and the upper bound
     */ 
    function CFMeanDifference(arr1, arr2, confidence){
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

    function pmcc(){}

    function srcc(){}

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
                // TODO: Add titles for entire scatterplot, x-axis, and y-axis.

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
            lineOfBestFit: function(){
                // TODO: Line of best fit goes here
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
            }
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
        CFMeanDifference: CFMeanDifference,

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
