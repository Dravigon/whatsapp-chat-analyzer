import {
    runWasm,
    messageCount,
    wordCount,
    heatMapData,
    chatBehaviourHistory,
    chatIntrestHistory
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
import {
    drawChatFrequency
} from './chatFrequency.js'
import {
    downloadAllCanvas
} from './downloadCanvas.js'
import { drawChatContribution } from './whatsappCharts.js'

let pronoun_list = "i,me,my,myself,we,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,s,t,can,will,just,don,should,now";
function createButton(buttonText, cardDescription, clickCallback, containerType, size, canvasSize) {


    //create Button
    var canvasComponent = document.createElement("custom-card");
    canvasComponent.setAttribute("card-text", buttonText);
    canvasComponent.setAttribute("card-description", cardDescription);
    containerType && canvasComponent.setAttribute("container-type", containerType);
    if (canvasSize) {
        canvasComponent.setAttribute("canvas-height", canvasSize.height);
        canvasComponent.setAttribute("canvas-width", canvasSize.width);
    }
    canvasComponent.addEventListener("clicked", (evt) => {
        ga('send', 'event', buttonText, 'click', 'analyse');
        clickCallback(evt.detail.id);
    });
    var genericCanvasContainer = document.createElement("div");
    genericCanvasContainer.className = "chart w-" + (size || 50);
    genericCanvasContainer.id = buttonText.toLowerCase().replace(" ", "-") + "-container";
    genericCanvasContainer.appendChild(canvasComponent);
    document.getElementById("canvas-div").appendChild(genericCanvasContainer);
}

let removeDescription = function () {
    let canvasDiv = document.getElementById("canvas-div");
    if (canvasDiv.innerHTML.trim() !== "") {
        ga('send', 'event', 'New Document in a single session', 'click', 'reload-data');
        canvasDiv.innerHTML = "";
        return;
    }
    let elems = document.getElementsByClassName("description");
    let title = document.getElementsByClassName("title");
    let titleText = document.getElementsByClassName("title-text");
    let contentContainer = document.getElementsByClassName("content-container");
    title[0].style.height = "auto";
    title[0].style.boxShadow = "0px 1px 1px black";
    titleText[0].style.fontSize = "30px";
    titleText[0].style.lineHeight = "30px"
    contentContainer[0].style.height = "calc(100vh - 23%)";
    for (var elem of elems) {
        const x = elem;
        x.style.fontSize = 0;
        setTimeout(function () {
            x.innerHTML = "";
        }, 500);
    }
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                removeDescription();
                var data = evt.target.result;
                const convoDistDescription = "This gives the total number of conversation done by a person compared it to others in the chat (This would give a rough estimate of user's contibution to your chat)";
                createButton("Conversation distribution", convoDistDescription, function (canvasId) {


                    let regexp = /(\d{1,2}\/\d{1,2}\/\d{2},\s\d{1,2}:\d{2}\s-\s([^:]*)?:\s(.*)?)(?=\n\d{1,2}\/\d{1,2}\/\d{2},\s\d{1,2}:\d{2}\s-\s[^:]+:|$)/gm
                    const altRegex = /\[(\d{2}\/\d{2}\/\d{2}, \d{1,2}:\d{2}:\d{2} [AP]M)\] ~(.*): (.*)/gm


                    let messages = Array.from(data.matchAll(regexp));
                    if (!messages.length) {
                        messages = Array.from(data.matchAll(altRegex))
                    }

                    drawChatContribution(canvasId, messages);
                    document.getElementById("loading-" + canvasId).style.display = 'none'

                });
                const wordUsageDescription = "This gives the top most used words displayed bigged if most used, common words like i,am,he...etc., are ignored. To ignore some words specific for your chat please change the ignore list and click Repaint";
                createButton("Word Usage", wordUsageDescription, function (canvasId) {

                    let regexp = /(\d{1,2}\/\d{1,2}\/\d{2},\s\d{1,2}:\d{2}\s-\s([^:]*)?:\s(.*)?)(?=\n\d{1,2}\/\d{1,2}\/\d{2},\s\d{1,2}:\d{2}\s-\s[^:]+:|$)/gm
                    const altRegex = /\[(\d{2}\/\d{2}\/\d{2}, \d{1,2}:\d{2}:\d{2} [AP]M)\] ~(.*):/gm

                    let messages = Array.from(data.matchAll(regexp));
                    if (!messages.length) {
                        messages = data.replaceAll(altRegex,"")
                    } else {
                        messages = data.replaceAll(regexp,"")
                    }
                    drawWordCloud(canvasId, messages);
                    document.getElementById("loading-" + canvasId).style.display = 'none'
                }, "", "", {
                    height: "500",
                    width: "600"
                });
                const heatChartDescription = "This gives average chat activity time during every hour for every week day (This shows when the user/group was actively intracting with other user(s))";
                createButton("Heat Chart", heatChartDescription,
                    function (canvasId) {
                        let regexp = /(\d{1,2}\/\d{1,2}\/\d{2},\s\d{1,2}:\d{2}\s-\s([^:]*)?:\s(.*)?)(?=\n\d{1,2}\/\d{1,2}\/\d{2},\s\d{1,2}:\d{2}\s-\s[^:]+:|$)/gm
                        const altRegex = /\[(\d{2}\/\d{2}\/\d{2}, \d{1,2}:\d{2}:\d{2} [AP]M)\] ~(.*): (.*)/gm


                        let messages = Array.from(data.matchAll(regexp));
                        if (!messages.length) {
                            messages = Array.from(data.matchAll(altRegex))
                        }
                        console.log({ messages })
                        drawHeatChart(canvasId, messages);
                        document.getElementById("loading-" + canvasId).style.display = 'none'


                    }, "", "", {
                    height: "500",
                    width: "600"
                });
                const chatHistoryDescription = "This gives the total number of convos typed by per month over the time period of the chat (Provides you with the detail of amounts of words excahged over time)";
                createButton("Chat History", chatHistoryDescription,
                    function (canvasId) {

                        const regexp = /(\d{1,2}\/\d{1,2}\/\d{2},\s\d{1,2}:\d{2}\s-\s([^:]*)?:\s(.*)?)(?=\n\d{1,2}\/\d{1,2}\/\d{2},\s\d{1,2}:\d{2}\s-\s[^:]+:|$)/gm
                        const altRegex = /\[(\d{2}\/\d{2}\/\d{2}, \d{1,2}:\d{2}:\d{2} [AP]M)\] ~(.*): (.*)/gm
                        let messages = Array.from(data.matchAll(regexp));
                        if (messages.length > 0) {
                            drawChatHistory(canvasId, messages);
                        }
                        else {
                            messages = Array.from(data.matchAll(altRegex))
                            drawChatHistory(canvasId, messages);
                        }


                        document.getElementById("loading-" + canvasId).style.display = 'none'


                    }, "", "", {
                    height: "100",
                    width: "150"
                });
                const chatIntrestHistoryDescription = "This gives the Max words per minute every day over the time period of the chat (Gives the rate at which Conversation occured over time Can roughly translate to the user's intrest in the conversation)";
                createButton("Chat Intrest", chatIntrestHistoryDescription,
                    function (canvasId) {
                        let regexp = /(\d{1,2}\/\d{1,2}\/\d{2},\s\d{1,2}:\d{2}\s-\s([^:]*)?:\s(.*)?)(?=\n\d{1,2}\/\d{1,2}\/\d{2},\s\d{1,2}:\d{2}\s-\s[^:]+:|$)/gm
                        const altRegex = /\[(\d{2}\/\d{2}\/\d{2}, \d{1,2}:\d{2}:\d{2} [AP]M)\] ~(.*): (.*)/gm


                        let messages = Array.from(data.matchAll(regexp));
                        if (!messages.length) {
                            messages = Array.from(data.matchAll(altRegex))
                        }
                        console.log({ messages })
                        drawChatFrequency(canvasId, messages);
                        document.getElementById("loading-" + canvasId).style.display = 'none'
                        // chatIntrestHistory(data).then(
                        //     function(datas) {

                        //     }
                        // )
                    }, "", "", {
                    height: "100",
                    width: "150"
                });
                let downloadCard = document.createElement("div");
                downloadCard.className = "chart w-50";
                downloadCard.innerHTML = `
                <div id="psuedo-container-download-data" class="card" style="background-image:none">
                <p>every chart would download as induvidual image</p>
                </div>
                `;
                document.getElementById("canvas-div").appendChild(downloadCard);
                let downloadButton = document.createElement('button');
                downloadButton.innerHTML = "Download Analysed Data";
                let reccomendationText = document.createElement('p');
                reccomendationText.innerText = "Your feed backs are valuble please let us know what you would want to see or change \n please text me in whatsapp 8939373312";
                // let recommendationMessage = document.createElement('textarea');
                // recommendationMessage.id = "feedback";
                // recommendationMessage.style.verticalAlign = "middle";
                // let reccomendationButton = document.createElement('button');
                // reccomendationButton.innerHTML = "Send FeedBack";
                downloadButton.innerHTML = "Download Analysed Data";
                document.getElementById("psuedo-container-download-data").appendChild(downloadButton);
                document.getElementById("psuedo-container-download-data").appendChild(reccomendationText);
                // document.getElementById("psuedo-container-download-data").appendChild(recommendationMessage);
                // document.getElementById("psuedo-container-download-data").appendChild(reccomendationButton);
                downloadButton.onclick = (e) => {
                    ga('send', 'event', 'Download Analysis', 'click', 'download');
                    downloadAllCanvas()
                }
                // reccomendationButton.onclick = (e) => {
                //     let feedbackText = document.getElementById('feedback');
                //     ga('send', 'event', 'FeedBack', 'click', 'feedback-data', feedbackText.value);
                // }
            }
        };
        reader.readAsText(f);
    }
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);
let contentContainer = document.getElementsByClassName("content-container");
let offset = document.getElementsByTagName("footer")[0].offsetHeight;
contentContainer[0].style.marginBottom = (offset + 2) + "px";
