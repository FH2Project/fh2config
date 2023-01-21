/* © 2022 - Ian Sayer */
export let tblDefs = {};
export function setTblDef(obj){
    tblDefs = Object.assign(tblDefs, obj);
}
/**
 * Add a parameter table to document based on JSON definition
 * @param {JSON} table_def 
 */
export function addTable(table_def) {
    let doml = document.getElementById(table_def.rowclass);
    if (doml){
        doml.classList.remove("hide");
        return;
    }
    let table = document.createElement("table");
    table.setAttribute("id",table_def.rowclass);
    table_def.hrows.forEach(function (row) {
        let tr = document.createElement("tr");
        tr.classList.add(table_def.rowclass);
        row.forEach(function (cell) {
            let th = document.createElement(cell.h ? "th" : "td");
            th.innerText = cell.h || "";
            if (cell.c > 1)
                th.setAttribute("colspan", cell.c);
            if (cell.c < -1)
                th.setAttribute("rowspan", Math.abs(cell.c));
            tr.appendChild(th);
        });
        table.appendChild(tr);
    });
    for (let i=0; i<table_def.drowCount; i++)
    {
        let tr = document.createElement("tr");
        tr.innerHTML = table_def.drowTemplate(i);
        tr.classList.add("b");
        table.appendChild(tr);
    }
    document.body.appendChild(table);
}
/**
 * Generate html markup for select>option*n
 * @param {Number} n    total numer of options; {String} n comma delimited list of option names
 * @param {Number} ofs  offset to add to each zero based n
 * @returns String markup
 */
export function ops(n,ofs){
    // returns a select element with options 1-n
    let rename0 = "", _ofs=0;
    if (typeof(ofs)=="string")
        rename0 = ofs;
    else
        _ofs = ofs||0;
    let o;
    if (typeof(n)=="string")
        o = n.split(",").map((u)=>`<option value='${u}'>${u}</option>`);
    else {
        o = Array.from(Array(n),(u,i)=>`<option value='${i}'>${i+_ofs}</option>`);
        if (rename0)
            o[0] = `<option value='0'>${rename0}</option>`;
    }
    return `<select>${o.join("")}</select>`;
}
/**
 * Generate html markup for select>option*n modulo 8 (ie Base output)
 * @param {Number} n total numer of options
 * @returns String markup
 */
export function opsm(n,ix,name,addAtStart){
    let o = Array.from(Array(n),(u,i)=>`${i>>3}/${(i%8)+1}`);
    if (addAtStart)
        o.unshift(addAtStart);
    o = o.map((u,i)=>`<option value='${i}'>${u.replace("0/","")}</option>`).join("");
    return `<select name="${name}${ix}">${o}</select>`;
}
export function cb(i,name){
    return `<input type="checkbox" name="${name}${i}" aria-label="${name}${i}"/>`
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
    if (e.target.dataset.tbl)
        addTable(tblDefs[e.target.dataset.tbl]);
}
export function tabs(){
    let tb = Array.from(document.querySelectorAll(".tab_bar>span"));
    tb.forEach(function(u){
        u.setAttribute("tabindex","0");
        u.addEventListener("click", setSelected);
        u.addEventListener("focus", setSelected);
    });
}
