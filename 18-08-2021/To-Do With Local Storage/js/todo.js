let x = 0;
const array = Array();
function todo(){
    array[x] = document.getElementById("input").value;
    if(array[x] != ""){ 
        localStorage.setItem(x, JSON.stringify(array[x]));
        x++;
        document.getElementById("input").value="";
        to1();
    }
}

function clean(){
        localStorage.clear();
        x=0;
}

function to(){
    for(i=0; i<localStorage.length; i++){
        var lastname = localStorage.getItem(i);
        document.getElementById("list")
        .appendChild(document.createElement("h3")).innerText = lastname;
    }
}

let i=0;
function to1(){
        var lastname = localStorage.getItem(i);
        document.getElementById("list")
        .appendChild(document.createElement("h3")).innerText = lastname;
        i++;
    }
