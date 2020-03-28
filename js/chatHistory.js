var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
};
export const drawChatHistory = (canvasId, chatData) => {
    chatData.datasets = [];

    for (var x in chatData.values) {
        const data = {
            "label": x,
            "data": chatData.values[x],
            "fill": false,
            "borderColor": dynamicColors()
        };
        chatData.datasets.push(data);
    }
    new Chart(document.getElementById(canvasId), {
        type: 'line',
        data: chatData,
        options: {
            title: {
                display: true,
                text: 'Chat Trends Per Weekly Basis'
            },
            tooltips: {
                callbacks: {
                    title: function(tooltipItem, data) {
                        var label =tooltipItem[0].xLabel || '';
                        var week = label.split("-")[0];
                        return week;
                    }
                }
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Total chats per week'
                    }
                }],
                xAxes: [{
                    id: 'xAxis1',
                    type: "category",
                    labelString: 'Month / Year',
                    ticks: {
                        callback: function(label) {
                            var month = label.split("-")[1];
                            return month;
                        }
                    }
                }]

            }
        }
    });

}
