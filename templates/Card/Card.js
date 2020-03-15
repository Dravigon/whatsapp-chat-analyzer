class Card extends HTMLElement {
    constructor() {
        super();
        this.containerId = "";
        this.buttonText = "";
        this.containerType = "canvas";
        this.canvasWidth;
        this.canvasHeight;
    }
    connectedCallback() {
        this.buttonText = this.getAttribute("card-text");
        this.containerId = "psuedo-container-" + this.buttonText.toLowerCase().replace(" ", "-");
        this.canvasId = this.buttonText.toLowerCase().replace(" ", "-");
        this.containerType = this.getAttribute("container-type") || "canvas";
        this.canvasHeight = this.getAttribute("canvas-height");
        this.canvasWidth = this.getAttribute("canvas-width");
        this.innerHTML = `
        <style>
            @import "templates/Card/Card.css";
        </style>
        <div id="${this.containerId}" class="card">
          Hello, World!
          </div>`;
        var button = document.createElement("button");
        button.textContent = "Click me";
        button.onclick = (evt) => {
            document.getElementById(this.containerId).innerHTML = `<div id='loading-${this.canvasId}' class="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                </div>`;
            var genericCanvas = document.createElement(this.containerType);
            genericCanvas.id = this.canvasId;
            genericCanvas.style.width = "100%";
            if (this.canvasWidth) {
                genericCanvas.width = this.canvasWidth;
            }
            if (this.canvasHeight) {
                genericCanvas.height = this.canvasHeight;
            }
            document.getElementById(this.containerId).appendChild(genericCanvas);
            this.dispatchEvent(new CustomEvent("clicked", {
                detail: {
                    "id": this.canvasId
                }
            }));
        };

        document.getElementById(this.containerId).append(button);
    }
}

customElements.define('custom-card', Card);
