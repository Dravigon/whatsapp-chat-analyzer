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

        console.log(clickCallback.toString());
    //create Button
    var canvasComponent = document.createElement("custom-card");
    canvasComponent.setAttribute("card-text", buttonText);
    containerType && canvasComponent.setAttribute("container-type", containerType);
    if (canvasSize) {
        canvasComponent.setAttribute("canvas-height", canvasSize.height);
        canvasComponent.setAttribute("canvas-width", canvasSize.width);
    }
    canvasComponent.addEventListener("clicked", (evt) => {
        console.log(evt.detail);

        clickCallback(evt.detail.id);
    });
    var genericCanvasContainer = document.createElement("div");
    genericCanvasContainer.className = "chart w-" + (size || 50);
    genericCanvasContainer.id = buttonText.toLowerCase().replace(" ", "-") + "-container";
    genericCanvasContainer.appendChild(canvasComponent);
    document.getElementById("canvas-div").appendChild(genericCanvasContainer);

    //    document.getElementById('whatsapp_content').appendChild(genericButton);
}

let removeDescription = function() {
    let elems = document.getElementsByClassName("description");
    for (var elem of elems) {
        const x = elem;
        x.style.fontSize = 0;
        setTimeout(function() {
            x.innerHTML = "";
        }, 500);
    }
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                removeDescription();
                var data = evt.target.result;

                createButton("Conversation distribution", function(canvasId) {
                    messageCount(data).then(function(e) {
                        (function(chart) {
                            chart.countChart(canvasId, e);
                            document.getElementById("loading-"+canvasId).style.display = 'none'
                        })(whatsappChart);
                    })
                });
                createButton("Word Usage", function(canvasId) {
                    wordCount(data).then(function(e) {
                        drawWordCloud(canvasId, e);
                        document.getElementById("loading-"+canvasId).style.display = 'none'
                    })
                }, "div");
                createButton("heat chart",
                    function(canvasId) {
                        heatMapData(data).then(
                            function(datas) {
                                drawHeatChart(canvasId, datas);
                                document.getElementById("loading-"+canvasId).style.display = 'none'
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
