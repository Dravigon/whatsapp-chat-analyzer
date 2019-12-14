
import {runWasm, messageCount,wordCount} from '../index.js' 
import {drawWordCloud} from './wordCloud.js'

//runWasm(1,2).then(function(e){
//    console.log(e);
//})
function createButton(buttonText,clickCallback,containerType,size){
    //create canvas
    var genericCanvas = document.createElement(containerType||"canvas");
    genericCanvas.id=buttonText.toLowerCase().replace(" ","-");
    genericCanvas.style.width="100%";
    var genericCanvasContainer = document.createElement("div");
    genericCanvasContainer.className="chart w-"+(size||50);
    genericCanvasContainer.appendChild(genericCanvas);
    document.getElementById("canvas-div").appendChild(genericCanvasContainer);

    //create Button
    var genericButton =  document.createElement("button");
    genericButton.textContent=buttonText;
    genericButton.onclick=clickCallback;
    document.getElementById('whatsapp_content').appendChild(genericButton);
}
function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.onloadend = function(evt) {
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
              var data=evt.target.result;

              createButton("Conversation distribution",function(){
                  document.getElementById("conversation-distribution").innerHTML="loading....";
                    messageCount(data).then(function(e){
                          (function(chart){
                              document.getElementById("conversation-distribution").innerHTML="";
                              chart.countChart("conversation-distribution",e);
                          })(whatsappChart);
                    })
              });
              createButton("Word Usage",function(){
                    document.getElementById("word-usage").innerHTML="<div class=\"lds-roller\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
                    wordCount(data).then(function(e){
                        document.getElementById("word-usage").innerHTML="";
                        drawWordCloud("word-usage",e);
                    })
              },"div");
          }
      };
      reader.readAsText(f);
  }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
