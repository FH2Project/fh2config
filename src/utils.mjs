/* © 2022 - Ian Sayer */
export let tblDefs = {};
export function setTblDef(obj){
    tblDefs = Object.assign(tblDefs, obj);
}
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
