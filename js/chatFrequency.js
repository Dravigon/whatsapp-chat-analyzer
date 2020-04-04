var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
};
export const drawChatFrequency = (canvasId, chatData) => {
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
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Chat Frequency Daily Basis'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Maximum words per minute'
                    }
                }],
                xAxes: [{
                    id: 'xAxis1',
                    type: "category",
                    labelString: 'day / month / Year',
                }]

            }
        }
    });

}
