/**
 * Add a parameter table to document based on JSON definition
 * @param {JSON} table_def 
 */
export function addTable(table_def) {
    let table = document.createElement("table");
    table_def.hrows.forEach(function (row) {
        let tr = document.createElement("tr");
        tr.classList.add("mcv");
        row.forEach(function (cell) {
            let th = document.createElement(cell.h ? "th" : "td");
            th.innerText = cell.h || "";
            if (cell.c > 1)
                th.setAttribute("colspan", cell.c);
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
    ofs = ofs||0;
    let o;
    if (typeof(n)=="string")
        o = n.split(",").map((u)=>`<option value='${u}'>${u}</option>`).join("");
    else
        o = Array.from(Array(n),(u,i)=>`<option value='${i+ofs}'>${i+ofs}</option>`).join("");
    return `<select>${o}</select>`;
}
/**
 * Generate html markup for select>option*n modulo 8 (ie Base output)
 * @param {Number} n total numer of options
 * @returns String markup
 */
export function opsm(n,ix,name){
    let o = Array.from(Array(n),(u,i)=>`${i>>3}/${(i%8)+1}`);
    o = o.map((u,i)=>`<option value='${i}'>${u.replace("0/","")}</option>`).join("");
    return `<select name="${name}${ix}">${o}</select>`;
}
export function cb(i,name){
    return `<input type="checkbox" name="${name}${i}" aria-label="${name}${i}"/>`
}
function setSelected(e){
    let lasttab = document.querySelector(".tab_bar>span.selected");
    if (lasttab)
        lasttab.classList.remove("selected");
    e.target.classList.add("selected");
}
export function tabs(){
    let tb = Array.from(document.querySelectorAll(".tab_bar>span"));
    tb.forEach(function(u){
        u.setAttribute("tabindex","0");
        u.addEventListener("click", setSelected);
        u.addEventListener("focus", setSelected);
    });
}
