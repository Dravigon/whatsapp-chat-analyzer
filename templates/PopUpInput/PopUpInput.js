class PopUpInput extends HTMLElement{
    constructor(){
        super();
        let styleSheet = document.createElement('style');
        styleSheet.textContent=`
        .pop-up-container{
            padding:5px;
            display:flex;
            height:auto;
            width:calc(100% - 10px);
        }
        .input-div{
            padding:5px;
            border:1px solid black;
            min-height:20px;
            min-width:100px;
            width:calc(100% - 10px);
            word-wrap: break-word;
            text-overflow: ellipsis;
            background-color: #fff;
            white-space: nowrap;
            overflow: hidden;
        }
        .pop-up-div{
            position:absolute;
            height:calc(100vh - 20px);
            width:calc(100vw - 20px);
            left:0;
            right:0;
            top:0;
            padding:10px;
        }
        .pop-up{
            margin:auto;
            height:80%;
            width:80%;
            background-color:#fff;
            padding:10px;
            color:black;
            z-index:9999;
        }
        @media only screen and (max-width: 600px) {
            .pop-up-div{
                padding:0px;
            }
            .pop-up{
               height:100%;
               width:100%;
            }
        }
        .pop-up textarea{
            height:80%;
            width:100%;
            color:black;
        }
        `;
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(styleSheet);
        let popUp = document.createElement('div');
        popUp.setAttribute('class', 'pop-up-container')

        this.inputDiv = document.createElement('div');
        this.inputDiv.setAttribute('class', 'input-div');
        
        popUp.appendChild(this.inputDiv);
        popUp.onclick = (evt)=>{
            let popUpDivContainer = document.createElement("div");
            popUpDivContainer.setAttribute('class', 'pop-up-div');
            let popUpDiv = document.createElement("div");
            popUpDiv.setAttribute('class', 'pop-up');
            let popUpDivLable = document.createElement("span");
            popUpDivLable.innerHTML=this.getAttribute("label")||"Provide a input";
            let popUpDivButton = document.createElement("button");
            popUpDivButton.innerHTML="Ok";
            let popUpDivInput = document.createElement("textarea");
            popUpDivInput.value=this.getAttribute('value');
            popUpDivButton.onclick=(e)=>{
                this.inputDiv.textContent=popUpDivInput.value;
                this.setAttribute('value', popUpDivInput.value);
                popUpDivContainer.parentNode.removeChild(popUpDivContainer);
            };
            popUpDiv.appendChild(popUpDivLable);
            popUpDiv.appendChild(popUpDivInput);
            popUpDiv.appendChild(popUpDivButton);
            popUpDivContainer.appendChild(popUpDiv);
            shadow.appendChild(popUpDivContainer);
        };
        shadow.appendChild(popUp);
    }
    get value(){
      return this.getAttribute('value')||"";
    }
    set value(newValue){
        this.inputDiv.textContent=newValue;
        this.setAttribute('value', newValue);
    }
    get label(){
      return this.getAttribute('label')||"";
    }
    set label(newValue){
        this.setAttribute('label', newValue);
    }
    connectedCallback(){
    }
}

customElements.define('pop-up-input', PopUpInput);
