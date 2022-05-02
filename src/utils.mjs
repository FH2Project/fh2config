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
export function opsm(n){
    let o = Array.from(Array(n),(u,i)=>`${i>>3}/${(i%8)+1}`);
    o = o.map((u,i)=>`<option value='${i}'>${u.replace("0/","")}</option>`).join("");
    return `<select>${o}</select>`;
}
