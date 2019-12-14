

(function(global){
    global.whatsappChart = global.whatsappChart||{};

      var dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
     };

    global.whatsappChart.countChart = function(countChartCanvasID,data){

        var chartData ={};
        chartData.labels=[];
        chartData.datasets=[];

        var chartDataset = {};
        chartDataset.label="Convo count";
        chartDataset.borderWidth= 1;
        chartDataset.data=[];
        chartDataset.backgroundColor= [];
        /* chartDataset.borderColor= [
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ];
                    */
        Object.keys(data).forEach(function(key) {
            chartData.labels.push(key);
            chartDataset.data.push(data[key]);
            chartDataset.backgroundColor.push(dynamicColors());
        })
        chartData.datasets.push(chartDataset);
            var ctx = document.getElementById(countChartCanvasID).getContext('2d');
            var myChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
            });
    };

})(window);

