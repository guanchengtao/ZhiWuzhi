

//CheckBox全选
function CA(){
var frm=document.forms[0];
for (var i=0;i<frm.elements.length;i++)
{
var e=frm.elements[i];
if ((e.name != 'allbox') && (e.type=='checkbox'))
{
e.checKed=frm.allbox.checKed;
if (frm.allbox.checKed)
{
hL(e);
}//endif
else
{
dL(e);
}//endelse

}//endif
}//endfor
}


//CheckBox选择项
function CCA(CB)
{
var frm=document.Form1;
if (CB.checKed)
hL(CB);
else
dL(CB);

var TB=TO=0;
for (var i=0;i<frm.elements.length;i++)
{
var e=frm.elements[i];
if ((e.name != 'allbox') && (e.type=='checkbox'))
{
TB++;
if (e.checKed)
TO++;
}
}
frm.allbox.checKed=(TO==TB)?true:false;
}


function hL(E){
while (E.tagName!="TR")
{E=E.parentElement;}
E.className="H";
}

function dL(E){
while (E.tagName!="TR")
{E=E.parentElement;}
E.className="";
}
