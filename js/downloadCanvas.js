export const downloadAllCanvas = () => {
    function PrintDiv(div, paintOn) {
        html2canvas(div, {
            onrendered: function(canvas) {
                var hiddenLink = document.createElement("a");
                hiddenLink.style.display = "none";
                hiddenLink.setAttribute("download", div.id + ".png");
                hiddenLink.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
                hiddenLink.setAttribute('target', "_blank");
                hiddenLink.click();

            }
        });
    }


    function printDiv(nodeList, i, paintOn,loadingDiv) {

        if (i < 0) {
            // Clean up
            document.body.removeChild(paintOn);
    
            document.body.removeChild(loadingDiv);
            return;
        }
        var div = nodeList[i];
        i -= 1;
        if (div.id) {
            const id = div.id;
            const element = document.getElementById(id);
            const intersectionObserver = new IntersectionObserver((entries) => {
                let [entry] = entries;
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        printDiv(nodeList, i, paintOn,loadingDiv);
                        PrintDiv(document.getElementById(id), paintOn)
                    }, 1000);

                    intersectionObserver.disconnect();
                }
            });
            // start observing
            intersectionObserver.observe(element);
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "start"
            });
        } else {
            printDiv(nodeList, i, paintOn,loadingDiv);
        }

    }
    let loadingDiv = document.createElement("div");
    loadingDiv.style.position="absolute";
    loadingDiv.style.width="100vw";
    loadingDiv.style.height="100vh";
    loadingDiv.style.left="0";
    loadingDiv.style.top="0";
    loadingDiv.style.backgroundColor="rgba(0,0,0,0.8)"
    loadingDiv.style.zIndex="10";
    loadingDiv.id="loading";
    
    document.body.appendChild(loadingDiv);
    let canvas = document.createElement('div');
    canvas.id = "temp";
    document.body.appendChild(canvas);
    let nodeList = document.getElementById('canvas-div').childNodes;
    printDiv(nodeList, nodeList.length - 1, canvas,loadingDiv);


    /*    let canvasList = document.getElementsByTagName("canvas");

    let tempCanvas = document.createElement("canvas");
    var ctx = tempCanvas.getContext('2d');
    tempCanvas.width=canvasList[0].width*2;
    tempCanvas.height=canvasList[0].height*canvasList.length;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    var x = 0 , y=0;
    for(let i = 0 ; i < canvasList.length;i++){
            canvasList[i], 
        ctx
            .drawImage(
            canvasList[i], 
            x,
            y);  
        if(i%2==0){
           x+=parseInt(canvasList[i].width.toString());
        }else{
           y+=parseInt(canvasList[i].height.toString());
           x=0;
        }
    }
    //    var dataUri = canvasMain.toDataURL(); 
    //window.open(dataUrl, "toDataURL() image", "width=600, height=200");
    var hiddenLink = document.createElement("a");
    hiddenLink.style.display="none";
    hiddenLink.setAttribute('href', tempCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    hiddenLink.setAttribute('target', "_blank");
    hiddenLink.click();*/
}
