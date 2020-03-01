import {
    runWasm,
    messageCount,
    wordCount,
    heatMapData
} from '../index.js'
import {
    drawWordCloud
} from './wordCloud.js'
import {
    drawHeatChart
} from './heatChart.js'
//runWasm(1,2).then(function(e){
//    console.log(e);
//})
function createButton(buttonText, clickCallback, containerType, size, canvasSize) {
    //create canvas
    var genericCanvas = document.createElement(containerType || "canvas");
    genericCanvas.id = buttonText.toLowerCase().replace(" ", "-");
    genericCanvas.style.width = "100%";
    if (canvasSize) {
        genericCanvas.width = canvasSize.width;
        genericCanvas.height = canvasSize.height;
    }

    //create Button
    var genericButton = document.createElement("button");
    genericButton.textContent = buttonText;
    genericButton.onclick = function() {
        var genericCanvasContainer = document.getElementById(genericCanvas.id + "-container") || document.createElement("div");
        genericCanvasContainer.className = "chart w-" + (size || 50);
        genericCanvasContainer.id = genericCanvas.id + "-container";
        genericCanvasContainer.appendChild(genericCanvas);
        document.getElementById("canvas-div").appendChild(genericCanvasContainer);
        document.getElementById(genericCanvas.id).innerHTML = "<div class=\"lds-roller\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
        clickCallback(genericCanvas.id);
    }
    document.getElementById('whatsapp_content').appendChild(genericButton);
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                var data = evt.target.result;

                createButton("Conversation distribution", function(canvasId) {
                    messageCount(data).then(function(e) {
                        (function(chart) {
                            chart.countChart(canvasId, e);
                        })(whatsappChart);
                    })
                });
                createButton("Word Usage", function(canvasId) {
                    wordCount(data).then(function(e) {
                        drawWordCloud(canvasId, e);
                    })
                }, "div");
                createButton("heat chart",
                    function(canvasId) {
                        heatMapData(data).then(
                            function(datas) {
                                drawHeatChart(canvasId, datas);
                            }
                        )
                    }, "", "", {
                        height: "500",
                        width: "600"
                    })
            }
        };
        reader.readAsText(f);
    }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
