
import {runWasm, messageCount} from '../index.js' 

//runWasm(1,2).then(function(e){
//    console.log(e);
//})
function createButton(buttonText,clickCallback){
    //create canvas
    var genericCanvas = document.createElement("canvas");
    genericCanvas.id=buttonText.toLowerCase().replace(" ","-");
    var genericCanvasContainer = document.createElement("div");
    genericCanvasContainer.className="chart w-50";
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

              createButton("Convo Count",function(){
                    messageCount(data).then(function(e){
                          (function(chart){
                              chart.countChart("convo-count",e);
                          })(whatsappChart);
                    })
              });
          }
      };
      reader.readAsText(f);
  }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
