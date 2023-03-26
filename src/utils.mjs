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
        let doml = document.querySelector("table:not(.hide),canvas:not(.hide)");
        if (doml)
            doml.classList.add("hide");
    }
    e.target.classList.add("selected");
    // if (e.target.dataset.tbl)
    //     addTable(tblDefs[e.target.dataset.tbl]);
}
export function tabs(){
    let tb = Array.from(document.querySelectorAll(".tab_bar>span"));
    tb.forEach(function(u){
        u.setAttribute("tabindex","0");
        u.addEventListener("click", setSelected);
        u.addEventListener("focus", setSelected);
    });
}
