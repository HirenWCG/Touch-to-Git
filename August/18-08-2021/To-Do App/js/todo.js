let x = 0;
const array = Array();

function todo(){
    array[x] = document.getElementById("input").value;
    if(array[x] != ""){
        let e = "<br/>";
        for (let y=0; y<array.length; y++){
            e = e + array[y] + "<br/>";
        }
        document.getElementById("input2").innerHTML = e;
        x++;
        document.getElementById("input").value="";
    }
}
