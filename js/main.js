import {
    runWasm,
    messageCount,
    wordCount,
    heatMapData,
    chatBehaviourHistory 
} from '../index.js'
import {
    drawWordCloud
} from './wordCloud.js'
import {
    drawHeatChart
} from './heatChart.js'
import {
    drawChatHistory
} from './chatHistory.js'
//runWasm(1,2).then(function(e){
//    console.log(e);
//})
//

let pronoun_list = "i,me,my,myself,we,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,s,t,can,will,just,don,should,now";
function createButton(buttonText, clickCallback, containerType, size, canvasSize) {
    
        ga('send', 'event', 'File selected', 'click', 'test');
        //console.log(clickCallback.toString());
    //create Button
    var canvasComponent = document.createElement("custom-card");
    canvasComponent.setAttribute("card-text", buttonText);
    containerType && canvasComponent.setAttribute("container-type", containerType);
    if (canvasSize) {
        canvasComponent.setAttribute("canvas-height", canvasSize.height);
        canvasComponent.setAttribute("canvas-width", canvasSize.width);
    }
    canvasComponent.addEventListener("clicked", (evt) => {
        clickCallback(evt.detail.id);
    });
    var genericCanvasContainer = document.createElement("div");
    genericCanvasContainer.className = "chart w-" + (size || 50);
    genericCanvasContainer.id = buttonText.toLowerCase().replace(" ", "-") + "-container";
    genericCanvasContainer.appendChild(canvasComponent);
    document.getElementById("canvas-div").appendChild(genericCanvasContainer);
}

let removeDescription = function() {
    let canvasDiv = document.getElementById("canvas-div");
    if(canvasDiv.innerHTML.trim()!==""){
        canvasDiv.innerHTML="";
        return;
    }
    let elems = document.getElementsByClassName("description");
    let title = document.getElementsByClassName("title");
    let titleText = document.getElementsByClassName("title-text");
    let contentContainer = document.getElementsByClassName("content-container");
    title[0].style.height="15%";
    title[0].style.boxShadow="0px 1px 1px black";
    titleText[0].style.fontSize="30px";
    contentContainer[0].style.height="calc(100vh - 23%)";
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
                    let repaintContainer = document.createElement('div');
                    repaintContainer.style.display="flex";
                    repaintContainer.style.flexWrap="wrap";
                    let labelText  = document.createElement('div');
                    labelText.style.width="100%";
                    labelText.style.textAlign="left";
                    labelText.style.padding="10px";
                    labelText.innerHTML="Ignore words:";
                    let ignoreWordList = document.createElement("pop-up-input");
                    ignoreWordList.value=pronoun_list;
                    ignoreWordList.style.width="calc(70% - 10px)";
                    ignoreWordList.style.zIndex="9";
                    ignoreWordList.label="Words to Ignore(comma seperated)";
                    let repaintChartButton = document.createElement("button");
                    repaintChartButton.style.margin="5px";
                    repaintChartButton.style.width="calc(30% - 10px)";
                    repaintChartButton.innerHTML="Repaint";
                    repaintChartButton.onclick=(e)=>{
                        var loading = document.getElementById("loading-"+canvasId);
                        loading.style.display = 'inline-block';
                        loading.style.position='fixed';
                        loading.style.zIndex='9';
                        loading.style.transform='translateY(200%)';
                        wordCount(data,ignoreWordList.value).then(function(e) {
                            document.getElementById(canvasId).innerHTML="";
                            repaintContainer.appendChild(labelText);
                            repaintContainer.appendChild(ignoreWordList);
                            repaintContainer.appendChild(repaintChartButton);
                            document.getElementById(canvasId).appendChild(repaintContainer);
                            drawWordCloud(canvasId, e);
                            document.getElementById("loading-"+canvasId).style.display = 'none';
                        })
                    }
                    wordCount(data,pronoun_list).then(function(e) {
                        repaintContainer.appendChild(labelText);
                        repaintContainer.appendChild(ignoreWordList);
                        repaintContainer.appendChild(repaintChartButton);
                        document.getElementById(canvasId).appendChild(repaintContainer);
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
                    });
                createButton("chat history",
                    function(canvasId) {
                        chatBehaviourHistory(data).then(
                            function(datas) {
                                drawChatHistory(canvasId, datas);
                                document.getElementById("loading-"+canvasId).style.display = 'none'
                            }
                        )
                    }, "", "", {
                        height: "100",
                        width: "150"
                    });
            }
        };
        reader.readAsText(f);
    }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
