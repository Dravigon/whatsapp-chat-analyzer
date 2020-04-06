export const downloadAllCanvas = () => {
    function PrintDiv(div, paintOn) {
        html2canvas(div, {
            onrendered: function(canvas) {
                var isEven = (localStorage['odd-canvas'] || "")!=="";
                if (isEven) {
                    var oldCanvasHeight = Number(localStorage['remember-height']) || 0;
                    var startX = localStorage['odd-canvas'].split("~")[1];
                } else {
                    var oldCanvasHeight = Number(localStorage['canvas-height']) || 0;
                    var startX = 0;
                }
                var ctx = paintOn.getContext('2d');
                ctx.drawImage(canvas, startX, oldCanvasHeight);
                if (!isEven) {
                    localStorage['remember-height'] = oldCanvasHeight;
                    localStorage['odd-canvas'] = canvas.height + "~" + canvas.width;
                } else {
                    var oddCanvasHeight = Number(localStorage['odd-canvas'].split("~")[0]);
                    localStorage['canvas-height'] = Math.max(canvas.height, oddCanvasHeight) + oldCanvasHeight;
                    localStorage['odd-canvas'] = "";
                }



            }
        });
    }


    function printDiv(nodeList, i, paintOn, loadingDiv) {

        if (i < 0) {
            setTimeout(() => {
                var hiddenLink = document.createElement("a");
                hiddenLink.style.display = "none";
                hiddenLink.setAttribute("download", "chatanalysis.png");
                hiddenLink.setAttribute('href', paintOn.toDataURL("image/png").replace("image/png", "image/octet-stream"));
                hiddenLink.setAttribute('target', "_blank");
                hiddenLink.click();
                // Clean up
                document.body.removeChild(paintOn);

                document.body.removeChild(loadingDiv);
            }, 1000);
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
                        printDiv(nodeList, i, paintOn, loadingDiv);
                        console.log(id);
                        PrintDiv(document.getElementById(id), paintOn);
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
            printDiv(nodeList, i, paintOn, loadingDiv);
        }

    }
    let loadingDiv = document.createElement("div");
    loadingDiv.style.position = "absolute";
    loadingDiv.style.width = "100vw";
    loadingDiv.style.height = "100vh";
    loadingDiv.style.left = "0";
    loadingDiv.style.top = "0";
    loadingDiv.style.backgroundColor = "rgba(0,0,0,0.8)"
    loadingDiv.style.zIndex = "10";
    loadingDiv.id = "loading";

    let nodeList = document.getElementById('canvas-div').childNodes;

    document.body.appendChild(loadingDiv);
    let canvas = document.createElement("canvas");
    canvas.id = "temp";
    var height = nodeList[0].offsetHeight || 0;
    var width = nodeList[0].offsetWidth || 0;
    var previousHeight = 0;
    var count = 0 ;
    for (var i = 0; i < nodeList.length; i++) {
        if (!nodeList[i].id) {
            continue;
        }else{
            count++;
        }
        if(count%2!==0)
            height +=Math.max(nodeList[i].offsetHeight || 0,previousHeight) + 50;
        else
            previousHeight = nodeList[i].offsetHeight||0;
        width = Math.max(width, nodeList[i].offsetWidth || 0);
    }
    canvas.height = height ;
    canvas.width = width * 2;
    localStorage['canvas-height'] = 0;
    localStorage['odd-canvas'] = "";
    localStorage['remember-height']=0;

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgb(51, 174, 255)";
    ctx.fill();
    document.body.appendChild(canvas);
    printDiv(nodeList, nodeList.length - 1, canvas, loadingDiv);


}
