var STATS = (function(){
    function mean(arr){
        var sum = 0;
        for(var i = 0; i < arr.length; i++){
            sum += arr[i];
        }
        return sum/arr.length;
    }
    
    function median(arr){
    	arr.sort();
        if(arr.length % 2 == 1){
        	return arr[Math.floor(arr.length/2)];
        }
        else {
        	return (arr[arr.length/2 - 1] + arr[arr.length/2])/2;
        }
    }
    
    function mode(arr){}
    
    function stdDeviation(arr){}
    
    function variance(arr){}
    
    function confidenceInterval(arr){}
    
    return {
    	mean: mean,
        mode: mode,
        median: median,
        stdDeviation: stdDeviation,
        variance: variance,
        confidenceInterval: confidenceInterval
    };
})();
