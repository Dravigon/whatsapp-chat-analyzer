

(function(global){
    global.whatsappChart = global.whatsappChart||{};


    global.whatsappChart.countChart = function(countChartCanvasID,data){

        var chartData ={};
        chartData.labels=[];
        chartData.datasets=[];

        var chartDataset = {};
        chartDataset.label="Convo count";
        chartDataset.borderWidth= 1;
        chartDataset.data=[];
        chartDataset.backgroundColor= [
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ];
         chartDataset.borderColor= [
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ];

        Object.keys(data).forEach(function(key) {
            chartData.labels.push(key);
            chartDataset.data.push(data[key]);
        })
        chartData.datasets.push(chartDataset);
            var ctx = document.getElementById(countChartCanvasID).getContext('2d');
            var myChart = new Chart(ctx, {
            type: 'bar',
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

