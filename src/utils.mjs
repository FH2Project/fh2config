/* © 2022 - Ian Sayer */
export let tblDefs = {};
export function setTblDef(obj){
    tblDefs = Object.assign(tblDefs, obj);
}
function updateKnobValue(knob, v)
{
    knob.setAttribute("data-value", v);
    // knob.style=`--k-rotate: ${(v-64)*5}`;
}
function clickKnob(e){
    // updateKnobValue(this, Math.floor(Math.random()*128));
    updateKnobValue(this, e.shiftKey?++this.dataset.value:--this.dataset.value);
}
function scrollKnob(e){
    e.preventDefault();
    let deltaT, excelerate = 1;
    if (this.dataset.prevTimeStamp)
    {
        deltaT = e.timeStamp - this.dataset.prevTimeStamp;
        if (deltaT<60)
            excelerate = 8;
        else if (deltaT<180)
            excelerate = 3;
    }
    let v = this.dataset.value>>0;
    let normalisedDelta = (e.wheelDeltaY>0?1:-1)*excelerate;
    v += normalisedDelta;
    v = Math.max(0, v);
    v = Math.min(127, v);
    this.dataset.value = v;
    this.dataset.prevTimeStamp = e.timeStamp;
}
document.addEventListener("DOMContentLoaded", function(){
    let dups = this.querySelectorAll("[data-duplicate]");
    dups.forEach(function(ele){
        let count = ele.dataset.duplicate>>0;
        ele.removeAttribute("data-duplicate");
        while (--count){
            let newele = ele.cloneNode(true);
            ele.parentNode.insertBefore(newele,ele.nextElementSibling);
        }
    });
    let knobs = document.querySelectorAll(".knob");
    knobs.forEach(knob=>{
        knob.onclick = clickKnob;
        knob.onwheel = scrollKnob;
        updateKnobValue(knob, knob.classList.length==2?64:0);
    });
});
const muCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.attributeName=='data-value'){
            let t = mutation.target;
            let v = t.dataset.value;
            t.style=`--k-rotate: ${(v-64)*-2.25}`;
            if (t.classList.contains('note'))
                t.ariaDescription = "CĊDḊEFḞGĠAȦB"[v%12]+(Math.floor(v/12)-2);
            else if (t.classList.contains('bipole'))
                t.ariaDescription=(v-64);
            else
                t.ariaDescription=v;
        }
    }
};

const observer = new MutationObserver(muCallback);
observer.observe(watchKnobs,{attributes: true, subtree: true});

function setSelected(e){
    let lasttab = document.querySelector(".tab_bar>span.selected");
    if (lasttab==e.target)
        return;
    if (lasttab) {
        lasttab.classList.remove("selected");
        let oldContent = document.querySelector(".tab-content.show");
        if (oldContent)
            oldContent.classList.remove("show");
    }
    e.target.classList.add("selected");
    let selector = `.tab-content.${e.target.textContent.toLowerCase()}`;
    let activeElement = document.querySelector(selector);
    if (activeElement)
        activeElement.classList.add("show");
    // e.target.parentElement.dataset.active = e.target.textContent.toLowerCase();
}
export function tabs(){
    let tb = Array.from(document.querySelectorAll(".tab_bar>span"));
    tb.forEach(function(u){
        u.setAttribute("tabindex","0");
        u.addEventListener("click", setSelected);
        u.addEventListener("focus", setSelected);
    });
}
