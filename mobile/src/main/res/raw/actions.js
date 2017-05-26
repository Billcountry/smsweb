/**
 * Created by country on 12/1/16.
 */

var timer;
var _url = '';
var current_conv_timer, all_conv_timer, comp_clip_timer;
var curpos = 0;
var currentgroup = "0";

function insertAtCaret(areaId,text) {
    var txtarea = document.getElementById(areaId);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);
    var back = (txtarea.value).substring(strPos,txtarea.value.length);
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        range.moveStart ('character', strPos);
        range.moveEnd ('character', 0);
        range.select();
    }
    else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}

function Group_contact_add(number, name){
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=add_group_contact&name='+name+'&phone='+number+'&group='+currentgroup,
        async: true,
        dataType: 'text',
        success: function (data) {
            _Opengroup(currentgroup)
            Toast(data,6);
        }
    });
}

function Processcontact(number, name) {
    document.querySelector("#new_text_from_cont").style.display = "block";
    document.querySelector("#new_text_phone").value = number;
    document.querySelector("#new_text_phone_name").innerHTML = name+":";
}

function Toast(message,length) {
    document.getElementById("message").innerHTML = message;
    document.getElementById("toast").style.display = "block";
    timer = setInterval(function() {
        document.getElementById("message").innerHTML = "";
        document.getElementById("toast").style.display = "none";
        clearTimeout(timer);
    },(length*1000));
}

function Hidetoast(){
    document.getElementById("message").innerHTML = "";
    document.getElementById("toast").style.display = "none";
    clearTimeout(timer);
}

function loaditem(page,element){
    document.getElementById('Progress').innerHTML = "";
    document.getElementById('loader').style.display = 'block';
    var Request = new XMLHttpRequest();
    Request.open("POST",page,true);
    Request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    Request.onreadystatechange = function(){
        if(Request.readyState == 4 && Request.status == 200){
            document.getElementById(element).innerHTML = Request.responseText;
            document.getElementById(element).scrollIntoView(true);
            document.getElementById('loader').style.display = 'none';
        }else{
            document.getElementById('loader').style.display = 'block';
            document.getElementById('Progress').innerHTML = "<br>Loading Failed:<br><a onclick=\"Closeload('1','0','"+page+"','"+element+"','0')\">Retry</a><br><a onclick=\"Closeload('0','0','"+page+"','"+element+"','0')\">Close</a>";
        }
    };
    Request.onprogress = function(e) {
        if (e.lengthComputable) {

        }else{

        }
    };
    Request.onloadstart = function(e) {

    };
    Request.send(params);
    return false;
}

function loadwithparams(page,element,params){
    document.getElementById('Progress').innerHTML = "";
    document.getElementById('loader').style.display = 'block';
    var Request = new XMLHttpRequest();
    Request.open("POST",page,true);
    Request.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    Request.onreadystatechange = function(){
        if(Request.readyState == 4 && Request.status == 200){
            document.getElementById(element).innerHTML = Request.responseText;
            document.getElementById(element).scrollIntoView(true);
            document.getElementById('loader').style.display = 'none';
        }else{
            document.getElementById('loader').style.display = 'block';
            document.getElementById('Progress').innerHTML = "<br>Loading Failed:<br><a onclick=\"Closeload('1','1','"+page+"','"+element+"','"+params+"')\">Retry</a><br><a onclick=\"Closeload('0','1','"+page+"','"+element+"','0')\">Close</a>";
        }
    };
    Request.onprogress = function(e) {
        if (e.lengthComputable) {

        }
    };
    Request.onloadstart = function(e) {

    };
    Request.send(params);
    return false;
}

function Scroll(element) {
    document.getElementById(element).scrollIntoView(true);
    if(element=="panel_booking"){
        Changedetails(document.getElementById('room_type').value);
    }
}

function Closeload(what,which,page,element,params){
    document.getElementById('Progress').innerHTML = "";
    if(what>0){
        if(which>0){
            loadwithparams(page,element,params);
        }if(which<0){
            Submit();
        }else{
            loaditem(page,element);
        }
    }else{
        document.getElementById('loader').style.display = 'none';
    }
}

function GetContacts() {
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=contacts',
        async: true,
        dataType: 'json',
        success: function (data) {
            var contacts = data.contacts;
            var out = "";
            var out2 = "";
            console.log("Bill was here before you.");
            for(var i=0; i<contacts.length; i++){
                var contact = contacts[i];
                var contact_name = contact.name;
                var contact_number = contact.phone;
                out += "<span class='contact_item' onclick=\"Opencontact('"
                    +contact_name+"','"+contact_number+"')\"><table><tr><td class='contact_name'>"
                    +contact_name+"</td></tr><tr><td class='contact_number'>"
                    +contact_number+"</td></tr></table></span>";

                out2 += "<span class='groupcontact' onclick=\"Group_contact_add('"
                    +contact_number+"','"+contact_name+"')\"><table><tr><td class='contact_name'>"
                    +contact_name+"</td></tr><tr><td class='contact_number'>"
                    +contact_number+"</td></tr></table></span>";
            }

            document.getElementById("contact_holder").innerHTML = out;
            document.getElementById("cont_list").innerHTML = out2;
        }
    });
}

function Opencontact(name,phone) {
    Processcontact(phone,name);
}

function GetConversations() {
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=conversations',
        async: true,
        dataType: 'json',
        success: function (data) {
            var conversations = data.conversations;
            var out = "";
            for(var i=0; i<conversations.length; i++){
                var conversation = conversations[i];
                var name = conversation.name;
                var number = conversation.address;
                var id = conversation.thread_id;
                out += "<span class='conv_contact_item' onclick=\"GetConversation('"
                    +id+"','"+name+"','"+number+"')\"><table><tr><td class='contact_name'>"
                    +name+"</td></tr><tr><td class='contact_number'>"
                    +number+"</td></tr></table></span>";
            }
            document.getElementById("conversation_contact_holder").innerHTML = out;
        }
    });
}

function Removecontact(name,addrr) {
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=remove_group_contact&group='+currentgroup+'&name='+name+'&phone='+addrr,
        async: true,
        dataType: 'text',
        success: function (data) {
            _Opengroup(currentgroup);
            data += "<br><input type='button' value='Undo Delete' onclick='Group_contact_add(\""+addrr+"\",\""+name+"\")' /><br>";
            Toast(data,12);
        }
    });
}

function Removegroup() {
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=remove_group&group='+currentgroup,
        async: true,
        dataType: 'text',
        success: function (data) {
            Getgroups('');
            Toast(data,5);
        }
    });
}

var g_conts = null;

function Opengroup(groupname) {
    //Performs a full refresh of the group interface
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=group_contacts&search=&group='+groupname,
        async: true,
        dataType: 'json',
        success: function (data) {
            var group_contacts = data.group_contacts;
            var out = "";
            var out2 = "";
            g_conts = [];
            for(var i=0; i<group_contacts.length; i++){
                var contact = group_contacts[i];
                var name = contact.name;
                var phone = contact.address;
                g_conts.push(phone);
                out += "<span class='group_item' onclick=\"Opencontact('"
                    +name+"','"+phone+"')\"><table><tr><td class='group_name'>"
                    +name+"</td></tr><tr><td class='group_desc'>("
                    +phone+")</td></tr></table></span>";
                out2 += "<span class='group_item' ondblclick=\"Removecontact('"+name+"','"+phone+"')\"><table><tr><td class='group_name'>"
                    +name+"</td></tr><tr><td class='group_desc'>("
                    +phone+")</td></tr></table></span>";
            }
            currentgroup = groupname;
            document.getElementById("group_contacts").innerHTML = out;
            document.getElementById("memb_list").innerHTML = out2;
            document.getElementById("gr_title").innerHTML = groupname;
            document.getElementById("leg_gp_ac").innerHTML = "Group Actions("+groupname+")";
            document.getElementById("leg_gp_add").innerHTML = "Add Members("+groupname+")";
            document.getElementById("tt_editor").innerHTML = "Add to "+groupname;
            document.getElementById("new_group_text_name").innerHTML = groupname;
            document.getElementById("group_members").style.display = "block";
            document.getElementById("group_editor").style.display = "none";
        }
    });
}
function _Opengroup(groupname) {
    //Refreshes only the changed parts of the group interface
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=group_contacts&search=&group='+groupname,
        async: true,
        dataType: 'json',
        success: function (data) {
            var group_contacts = data.group_contacts;
            var out = "";
            var out2 = "";
            g_conts = [];
            for(var i=0; i<group_contacts.length; i++){
                var contact = group_contacts[i];
                var name = contact.name;
                var phone = contact.address;
                out += "<span class='group_item' onclick=\"Opencontact('"
                    +name+"','"+phone+"')\"><table><tr><td class='group_name'>"
                    +name+"</td></tr><tr><td class='group_desc'>("
                    +phone+")</td></tr></table></span>";
                out2 += "<span class='group_item' ondblclick=\"Removecontact('"+name+"','"+phone+"')\"><table><tr><td class='group_name'>"
                    +name+"</td></tr><tr><td class='group_desc'>("
                    +phone+")</td></tr></table></span>";
            }
            currentgroup = groupname;
            document.getElementById("group_contacts").innerHTML = out;
            document.getElementById("memb_list").innerHTML = out2;
            document.getElementById("cur_rem_group").innerHTML = currentgroup;
            document.getElementById("new_group_text_name").innerHTML = currentgroup;
        }
    });
}

function GetConversation(threadid, name, phonenumber) {
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=conversation&thread_id='+threadid,
        async: true,
        dataType: 'json',
        success: function (data) {
            var conversation = data.conversation;
            var out = "";
            for(var i=0; i<conversation.length; i++){
                var message = conversation[i];
                var type = message.type;
                var text = message.message;
                var read = message.read;
                var date = message.date;
                console.log("The conversation "+name+" is ready");
                if(type==1){
                    out += "<div id='conmsg"+i+"' class=\"recieved\">"+text+"</div>";
                }else{
                    out += "<div id='conmsg"+i+"' class=\"sent\">"+text+"</div>";
                }
            }
            document.getElementById("conversation_holder").innerHTML = out;
            document.getElementById("new_text").innerHTML = "<input type='hidden' id='current_number' value='"+phonenumber+"' />"+"<input type='hidden' id='current_thread' value='"+threadid+"' />"+"<input type='hidden' id='current_name' value='"+name+"' />"+"<span class='bubble' style='background-color: #FFFFFF;'>Type your message here,(CTRL + Enter) to send<br><textarea id='convnewtext' onkeydown='if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey){Sendtext(\""+phonenumber+"\","+this.value+");}' style='width: calc(100% - 10px); height: calc(100% - 30px); border: none; resize: none;'></textarea></span>";
            document.getElementById("conversation_title").innerHTML = name+" : "+phonenumber;

            clearTimeout(current_conv_timer);
            current_conv_timer = setInterval(function() {
                Realtimetextreload(threadid);
            },(5000));
            $("#conversation_holder").scrollTop($("#conversation_holder")[0].scrollHeight);
        }
    });
}

function Realtimetextreload(threadid){
    //Reloads the current open conversation every 5 seconds to give the illusion of realtime sync
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=conversation&thread_id='+threadid,
        async: true,
        dataType: 'json',
        success: function (data) {
            var conversation = data.conversation;
            var out = "";
            for(var i=0; i<conversation.length; i++){
                var message = conversation[i];
                var type = message.type;
                var text = message.message;
                var read = message.read;
                var date = message.date;

                if(type==1){
                    out += "<div id='conmsg"+i+"' class=\"recieved\">"+text+"</div>";
                }else{
                    out += "<div id='conmsg"+i+"' class=\"sent\">"+text+"</div>";
                }
            }
            document.getElementById("conversation_holder").innerHTML = out;
        }
    });
}

function Sendtext(phonenumber) {
    var textmessage = document.getElementById("convnewtext").value;
    document.getElementById("convnewtext").value = "";
    textmessage = btoa(textmessage);
    phonenumber = btoa(phonenumber);
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=text&message='+textmessage+'&address='+phonenumber,
        async: true,
        dataType: 'text',
        success: function (data) {
            if(data.indexOf("Message Sent")<0){
                Toast("Sending failed<br>"+data+"<br><input type='button' value='Retry' onclick='Retry(\""+phonenumber+"\",\""+textmessage+"\")'>",60);
            }else {
                Toast(data, 6);
            }
        },
        error: function (data) {
            Toast("Sending failed<br>Error connecting to the phone.<br><input type='button' value='Retry' onclick='Retry(\""+phonenumber+"\",\""+textmessage+"\")'>",60);
        }
    });
}

function Retry(phone,message){
    Hidetoast();
    message = atob(message);
    phone = atob(phone);
    document.getElementById("convnewtext").value = message;
    Sendtext(phone);
}

function Getgroups(search) {
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=group&search='+search,
        async: true,
        dataType: 'json',
        success: function (data) {
            var groups = data.groups;
            var out = "";
            for(var i=0; i<groups.length; i++){
                var group = groups[i];
                var name = group.name;
                var desc = group.desc;
                out += "<span class='group_item' onclick=\"Opengroup('"
                    +name+"')\"><table><tr><td class='group_name'>"
                    +name+"</td></tr><tr><td class='group_desc'>("
                    +desc+")</td></tr></table></span>";
            }
            document.getElementById("group_list").innerHTML = out;
        }
    });
}

function _Sendtext(phonenumber,textmessage) {
    textmessage = btoa(textmessage);
    phonenumber = btoa(phonenumber);
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=text&message='+textmessage+'&address='+phonenumber,
        async: true,
        dataType: 'text',
        success: function (data) {
            Toast(data,6);
        }
    });
}

function Addgoup(groupname,description) {
    description = btoa(description);
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=add_group&group='+groupname+'&desc='+description,
        async: true,
        dataType: 'text',
        success: function (data) {
            Getgroups("");
            Toast(data,6);
        }
    });
}

function Setclipboard(data) {
    data = btoa(data);
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=setclip&clipdata='+data,
        async: true,
        dataType: 'text',
        success: function (data) {
            document.getElementById("comp_clip").innerHTML = data;
        },
        error: function () {
            Toast("Connection Failed",4);
        }
    });
}

function Getclipboard() {
    $.ajax({
        type: 'GET',
        url: _url,
        data: 'action=getclip',
        async: true,
        dataType: 'text',
        success: function (data) {
            document.getElementById("comp_clip").innerHTML = data;
        }
    });
}

function Numbertoletter(number) {
    switch(number){
        case 1: return "A"; break;
        case 2: return "B"; break;
        case 3: return "C"; break;
        case 4: return "D"; break;
        case 5: return "E"; break;
        case 6: return "F"; break;
        case 7: return "G"; break;
        case 8: return "H"; break;
        case 9: return "I"; break;
        case 10: return "J"; break;
        case 11: return "K"; break;
        case 12: return "L"; break;
        case 13: return "M"; break;
        case 14: return "N"; break;
        case 15: return "O"; break;
        case 16: return "P"; break;
        case 17: return "Q"; break;
        case 18: return "R"; break;
        case 19: return "S"; break;
        case 20: return "T"; break;
        case 21: return "U"; break;
        case 22: return "V"; break;
        case 23: return "W"; break;
        case 24: return "X"; break;
        case 25: return "Y"; break;
        case 26: return "Z"; break;
        default: return ""; break;
    }
}

var workbook;
var worksheet;
var records = 0;
var headrow = 1;

function Getvalue(header,record) {
    var out = "";
    var count = 1;
    do{
        var col = Cellid(count);
        var cell = worksheet[col+"1"];
        if(cell==undefined){
            break;
        }
        value = cell.v;
        if(value==header){
            out = worksheet[col+""+record].v;
            //alert("Found on:"+col+record+" Result: "+out);
            break;
        }
        count++;
    }while(value !== "" || value!== null);
    return out;
}

function Cellid(number) {
    var n = 0;
    var n2 = number;
    if(number>26){
        n = Math.round(number/26);
        while(n2>26){
            n2 = n2 - 26;
        }
    }
    return Numbertoletter(n) + Numbertoletter(n2);
}

function Processworksheet(sheetname) {
    worksheet = workbook.Sheets[sheetname];
    var count = 1;
    var value = "";
    var out = "Column Headers:(Click a header to add the column to the message)<br>";
    document.getElementById("phone_field").innerHTML = "<option>Select the phone number location</option>";
    document.getElementById("group_sel_cont").innerHTML = "<option>Select the contact name location</option>";
    document.getElementById("group_sel_phone").innerHTML = "<option>Select the phone number location</option>";
    do{
        var field1 = document.createElement("option");
        var field2 = document.createElement("option");
        var field3 = document.createElement("option");
        var cell = worksheet[Cellid(count)+"1"];
        if(cell==undefined){
            break;
        }
        value = cell.v;
        field1.value = value;
        field1.innerHTML = value;
        field2.value = value;
        field2.innerHTML = value;
        field3.value = value;
        field3.innerHTML = value;
        document.getElementById("phone_field").appendChild(field1);
        document.getElementById("group_sel_cont").appendChild(field2);
        document.getElementById("group_sel_phone").appendChild(field3);
        out += "<span class=\"sheet\" onclick=\"Typecolumn('"+value+"',event)\">"+value+"</span>";
        count++;
    }while(value !== "" || value!== null);
    count = 1;
    do{
        var cell = worksheet["A"+count];
        if(cell==undefined){
            break;
        }
        count++;
    }while(value !== "" || value!== null);
    count = count-2;
    records = count;
    document.getElementById("column_headers").innerHTML = out;
    document.getElementById("records_found").innerHTML = "<input type='hidden' id='records_total' value='"+count+"' /> <b>"+count+"</b> Records Found";
}

function Phonenumber(index) {
    index = index + headrow;
    var header = document.getElementById("phone_field").value;
    var out =Getvalue(header,index);
    return out;
}

function samplephone(){
    document.getElementById("sample_receiver").innerHTML = "Send to: "+Phonenumber(1);
}

function Getmessage(index) {
    index = index + headrow;
    var message = document.getElementById("merger_message_holder").value;

    var rem = "";
    while(message.indexOf("[")!==-1 && message.indexOf("]")!==-1){
        var start = message.indexOf("[");
        var end = message.indexOf("]");
        var head = message.substr(start+1,end-start-1);
        var out = Getvalue(head,index);
        var rem = message.substr(start,end-start+1);
        message = message.replace(rem,out);
    }
    return message;
}

function Createsample() {
    document.getElementById("sample_message").innerHTML = Getmessage(1);
}

function Sendbulk() {
    document.getElementById("loader").style.display = "block";
    var out = "";
    var c = 0;
    if(records<1){
        Toast("No records found",5);
        document.getElementById("loader").style.display = "none";
        return;
    }
    for(var i=1;i<=records;i++){
        var phonenumber = Phonenumber(i);
        var ph = phonenumber;
        var textmessage = Getmessage(i);
        textmessage = btoa(textmessage);
        phonenumber = btoa(phonenumber);
        $.ajax({
            type: 'GET',
            url: _url,
            data: 'action=text&message='+textmessage+'&address='+phonenumber,
            async: true,
            dataType: 'text',
            success: function (data) {
                c++;
                var progress = (c/records)*100;
                progress = Math.round(progress);
                document.getElementById("Progress").innerHTML = progress+"% Done" + c +"/"+records;
                var ret = data;
                if(ret.indexOf("Message Sent")<0){
                    out += "<tr><td>" + ph + "</td><td style='white-space: pre-wrap;'>" + atob(textmessage) + "</td><td>" + ret + "</td></tr>";
                }
                if(c==records){
                    if(out!==""){
                        out = "<html><head><title>Failed Messages</title></head><body><table style='margin: auto; max-width: 100%;' border='1' cellspacing='0' cellpadding='2'><tr><th>Phone Number</th><th>Message</th><th>Return Status</th></tr>"+out+"</table></body></html>";
                        out = btoa(out);
                        Toast("Some messages failed to send. Click the link below to view the messages<br><a style='color: #f1f1f1;' href='data:text/html;base64,"+out+"' target='_blank'>Sending Report</a>",60);
                    }else{
                        Toast("All messages sent successfully.",6);
                    }
                    document.getElementById("Progress").innerHTML = "";
                    document.getElementById("loader").style.display = "none";
                }
            },
            error: function () {
                c++;
            }
        });
    }
}

function Addfromexcel() {
    var out = "";
    var c = 0;
    if(records<1){
        Toast("No records found",5);
        return;
    }
    for(var i=1;i<=records;i++){
        var ph = document.querySelector("#group_sel_phone").value;
        var cn = document.querySelector("#group_sel_cont").value;
        var phonenumber = Getvalue(ph,i+1);
        var contactname = Getvalue(cn,i+1);
        Group_contact_add(phonenumber,contactname);
    }
}

function Sendtogroup(message) {
    document.getElementById("loader").style.display = "block";
    var out = "";
    var c = 0;
    var recs = g_conts.length;
    if(recs<1){
        Toast("No contacts found",5);
        document.getElementById("loader").style.display = "none";
        return;
    }
    var textmessage = btoa(message);
    for(var i=0;i<recs;i++){
        var phonenumber = g_conts[i];
        var ph = phonenumber;
        phonenumber = btoa(phonenumber);
        $.ajax({
            type: 'GET',
            url: _url,
            data: 'action=text&message='+textmessage+'&address='+phonenumber,
            async: true,
            dataType: 'text',
            success: function (data) {
                c++;
                var progress = (c/recs)*100;
                progress = Math.round(progress);
                document.getElementById("Progress").innerHTML = progress+"% Done" + c +"/"+records;
                var ret = data;
                if(ret.indexOf("Message Sent")<0) {
                    out += "<tr><td>" + ph + "</td><td style='white-space: pre-wrap;'>" + atob(textmessage) + "</td><td>" + ret + "</td></tr>";
                }
                if(c==recs){
                    if(out!==""){
                        out = "<html><head><title>Failed Messages</title></head><body><table style='margin: auto; max-width: 100%;' border='1' cellspacing='0' cellpadding='2'><tr><th>Phone Number</th><th>Message</th><th>Return Status</th></tr>"+out+"</table></body></html>";
                        out = btoa(out);
                        Toast("Some messages failed to send. Click the link below to view the messages<br><a style='color: #f1f1f1;' href='data:text/html;base64,"+out+"' target='_blank'>Sending Report</a>",60);
                    }else{
                        Toast("All messages sent successfully.",6);
                    }
                    document.getElementById("Progress").innerHTML = "";
                    document.getElementById("loader").style.display = "none";
                }
            },
            error: function () {
                c++;
            }
        });
    }
}

function Typecolumn(value,evt) {
    evt.preventDefault();
    evt.stopPropagation();
    insertAtCaret("merger_message_holder","["+value+"]");
    Createsample();
}
var filepos = 0;

function Getxlfile(drop,evt) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        if(drop){
            var files = evt.dataTransfer.files;
            if(filepos==1){
                var input = document.querySelector('#xlfile_contacts'),
                    file = files[0];
            }else {
                var input = document.querySelector('input[type=file]'),
                    file = files[0];
            }
        }else{
            if(filepos==1){
                var input = document.querySelector('#xlfile_contacts'),
                    file = input.files[0];
            }else {
                var input = document.querySelector('input[type=file]'),
                    file = input.files[0];
            }
        }

        if (!file){
            document.getElementById('list').innerHTML = "<br>File not found "+filepos;
            document.getElementById('list2').innerHTML = "<br>File not found "+filepos;
            return;
        }

        var imname = file.name;
        var imtype = file.type;
        var imsize = file.size;

        var output = [];
        output.push('<strong>', file.name, '</strong> (', file.type || 'n/a', ') - ',
            file.size, ' bytes, last modified: ',
            file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
            '');

        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
        document.getElementById('list2').innerHTML = '<ul>' + output.join('') + '</ul>';

        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            workbook = XLSX.read(data, {type: 'binary'});
            var out = "Select Worksheet:<br>";
            workbook.SheetNames.forEach(function (y) {
                out += "<span class=\"sheet\" onclick=\"Processworksheet('"+y+"')\">"+y+"</span>";
            });
            document.getElementById("work_sheets").innerHTML = out;
            document.getElementById("cont_sheets").innerHTML = out;
        }

        reader.readAsBinaryString(file);
    } else {
        var fileDisplayArea = document.getElementById('list');
        fileDisplayArea.innerHTML = '<strong>NB:</strong><br> Our upload system does not support your browser. Please email your logo to: <a href="mailto://bilcountrymwaniki@gmail.com">bilcountrymwaniki@gmail.com</a> Use your blog address as the subject. Thankyou.';
    }
}

function Editgroup(option){
    document.getElementById("group_editor").style.display = "block";
    document.getElementById("group_members").style.display = "none";
    document.getElementById("edit_contacts").style.display = "none";
    document.getElementById("edit_excel").style.display = "none";
    document.getElementById("edit_manual").style.display = "none";
    document.getElementById(option).style.display = "block";
}
function Switch(display,menu){
    document.getElementById("conversations").style.display = "none";
    document.getElementById("contacts").style.display = "none";
    document.getElementById("clip_board").style.display = "none";
    document.getElementById("bulksms").style.display = "none";
    document.getElementById("group_message").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById("m_conv").setAttribute("class","menu");
    document.getElementById("m_cont").setAttribute("class","menu");
    document.getElementById("m_cp").setAttribute("class","menu");
    document.getElementById("m_bs").setAttribute("class","menu");
    document.getElementById("m_gs").setAttribute("class","menu");
    document.getElementById("m_about").setAttribute("class","menu");
    document.getElementById(display).style.display = "block";
    document.getElementById(menu).setAttribute("class","menu-selected");
}
function init() {
    all_conv_timer = setInterval(function() {
        GetConversations();
    },(5000));
    Switch('conversations','m_conv');
    GetConversations();
    GetContacts();
    Getgroups("");
    document.onpaste = function (e) {
        var clipdata = window.clipboardData || e.clipboardData;
        var copytext = clipdata.getData("text/plain");
        if(copytext==""){
            Toast("Clipboard only supports text objects at the moment.",5);
        }
        Setclipboard(copytext);
    };
    comp_clip_timer = setInterval(function () {
        Getclipboard();
    },5000);
    var dropZone = document.getElementById('file_iput_holder');
    dropZone.addEventListener('dragover', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'Drop Here';
    }, false);
    dropZone.addEventListener('drop', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        filepos = 0;
        Getxlfile(true,evt);
    }, false);
    dropZone = document.getElementById("lbl_xlfile_contacts");
    dropZone.addEventListener('dragover', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'Drop Here';
    }, false);
    dropZone.addEventListener('drop', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        filepos = 1;
        Getxlfile(true,evt);
    }, false);
    document.getElementById("xlfile").onchange = function (evt) {
        filepos = 0;
        Getxlfile(false,evt);
    };
    document.getElementById("xlfile_contacts").onchange = function (evt) {
        filepos = 1;
        Getxlfile(false,evt);
    };
}

