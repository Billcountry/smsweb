package com.country.manager;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Looper;
import android.provider.ContactsContract;
import android.telephony.SmsManager;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import fi.iki.elonen.NanoHTTPD;

/**
 * Created by country on 1/18/17.
 */

public class Server extends NanoHTTPD {

    public ArrayList<String> notification;
    DataBaseHelper helper;

    public Server() throws IOException{
        super(1265);
        start();
    }

    public void Timebomb(){
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        month = month - 1;
        int days = (year*365)+(month*30);
        if(days>=736205 & days<=736295){

        }else{
            System.exit(0);
        }
    }


    @Override
    public Response serve(IHTTPSession session) {
        Timebomb();
        Background background = Background.inst;
        helper = new DataBaseHelper(background.getBaseContext());
        Looper.prepare();
        Map<String, String> params = session.getParms();
        String message = "{'title':'Home'}";
        String action =params.get("action");
        String type = "text/plain";
        if(action!=null){
            switch (action){
                case "text":
                    String text = params.get("message");
                    text = new String(Base64.decode(text.getBytes(), Base64.NO_WRAP));
                    String address = params.get("address");
                    address = new String(Base64.decode(address.getBytes(), Base64.NO_WRAP));
                    message = sendSMS(text,address);
                break;
                case "inbox":
                    type = "text/json";
                    message = SmsInbox();
                break;
                case "contacts":
                    type = "text/json";
                    message = Contacts();
                break;
                case "conversations":
                    type = "text/json";
                    message = Conversations();
                break;
                case "conversation":
                    type = "text/json";
                    String thread_id = params.get("thread_id");
                    message = Conversation(thread_id);
                break;
                case "setclip":
                    String clipdata = params.get("clipdata");
                    clipdata = new String(Base64.decode(clipdata,Base64.NO_WRAP));
                    message = setClipboard(clipdata);
                break;
                case "getclip":
                    message = getClipboard();
                break;
                case "group":
                    type = "text/json";
                    String search = params.get("search");
                    message = helper.Getgroups(search);
                break;
                case "group_contacts":
                    type = "text/json";
                    String group = params.get("group");
                    message = helper.Getcontacts(group);
                break;
                case "add_group":
                    //Wnat the hell Stop this shit
                    String new_group = params.get("group");
                    String desc = params.get("desc");
                    desc = new String(Base64.decode(desc,Base64.NO_WRAP));
                    message = helper.Addgroup(new_group,desc);
                break;
                case "add_group_contact":
                    String o_group = params.get("group");
                    String name = params.get("name");
                    String phone = params.get("phone");
                    message = helper.Addcontact(name,phone,o_group);
                break;
                case "remove_group_contact":
                    String cont_name = params.get("name");
                    String g_name = params.get("group");
                    String cont_phone = params.get("phone");
                    message = helper.Removecontact(g_name,cont_name,cont_phone);
                break;
                case "remove_group":
                    String gr_name = params.get("group");
                    message = helper.Removegroup(gr_name);
                break;
                case "mobile":
                    type = "text/html";
                    InputStream stream = background.getResources().openRawResource(R.raw.mobileindex);
                    message = readTextFile(stream);
                break;
            }
        }else{
            String asset =params.get("asset");
            if(asset != null){
                switch (asset){
                    case "actions":
                        type = "text/javascript";
                        message = readTextFile(background.getResources().openRawResource(R.raw.actions));
                        break;
                    case "jquery":
                        type = "text/javascript";
                        message = readTextFile(background.getResources().openRawResource(R.raw.jquery));
                        break;
                    case "xlsx":
                        type = "text/javascript";
                        message = readTextFile(background.getResources().openRawResource(R.raw.xlsx));
                        break;
                    case "styles":
                        type = "text/css";
                        message = readTextFile(background.getResources().openRawResource(R.raw.styles));
                        break;
                    case "bubble":
                        type = "text/css";
                        message = readTextFile(background.getResources().openRawResource(R.raw.bubbles));
                        break;
                }
            }else{
                type = "text/html";
                InputStream stream = background.getResources().openRawResource(R.raw.webindex);
                message = readTextFile(stream);
            }

        }
        Response response = new Response(message);
        response.setStatus(Response.Status.OK);
        response.addHeader("Access-Control-Allow-Origin","*");
        response.setMimeType(type);
        return response;
    }

    public String readTextFile(InputStream inputStream) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        byte buf[] = new byte[1024];
        int len;
        try {
            while ((len = inputStream.read(buf)) != -1) {
                outputStream.write(buf, 0, len);
            }
            outputStream.close();
            inputStream.close();
        } catch (IOException e) {

        }
        return outputStream.toString();
    }

    protected String setClipboard(String data){
        try {
            Background background = Background.inst;
            ClipboardManager clipboardManager = (ClipboardManager) background.getSystemService(Context.CLIPBOARD_SERVICE);
            ClipData clipData = ClipData.newPlainText("From Web", data);
            clipboardManager.setPrimaryClip(clipData);
        }catch (Exception e){
            Log.e("Fuckit", e.getMessage());
        }
        return getClipboard();
    }

    protected String getClipboard(){
        String out = "";
        try {
            Background background = Background.inst;
            ClipboardManager clipboardManager = (ClipboardManager) background.getSystemService(Context.CLIPBOARD_SERVICE);
            String data = "";
            if (clipboardManager.hasPrimaryClip()) {
                ClipData.Item item = clipboardManager.getPrimaryClip().getItemAt(0);
                data = item.getText().toString();
                if (data == null) {
                    data = "";
                }
            }else{
                Log.e("Clip Error","No objects on clipboard");
            }
            out = data;
        }catch (Exception e){
            Log.e("Clip Error",e.getMessage());
        }
        out = out.replaceAll("\n","<br/>");
        return out;
    }

    protected String Conversations(){
        String out = "";
        Background background = Background.inst;
        ContentResolver cr1 = background.getContentResolver();
        Cursor pCur = cr1.query(Uri.parse("content://sms/"), new String[]{"DISTINCT thread_id","address"},"thread_id IS NOT NULL) GROUP BY (thread_id",null, "date ASC");

        String thread_id = null;
        int count =0;

        if (pCur != null) {
            if (pCur.getCount() > 0) {
                pCur.moveToFirst();
                do {
                    thread_id = pCur.getString(pCur.getColumnIndex("thread_id"));
                    String address = pCur.getString(pCur.getColumnIndex("address"));
                    String name = helper.MysqlRealScapeString(Contactname(address, background));
                    String conv = "\t{\"address\":\"" + address + "\",\"name\":\"" + name + "\",\"thread_id\":\"" + thread_id + "\"}";
                    if (count > 0) {
                        out = conv + ",\n" + out;
                    } else {
                        out = conv + out;
                    }
                    count++;
                } while (pCur.moveToNext());
            }
            pCur.close();
        }
        out = "{\"conversations\":[\n"+out+"\n]}";
        out = out.replaceAll("\n","");
        return out;
    }

    protected String Conversation(String thread_id){
        Uri uri = Uri.parse("content://sms/");
        Background background = Background.inst;
        String out = "";
        String[] reqCols = new String[] { "_id", "body", "address", "read", "date", "type", "thread_id" };
        int count = 0;
        ContentResolver cr = background.getContentResolver();
        Cursor cursor = cr.query(uri, reqCols, "thread_id = '" + thread_id + "'" , null, "date ASC");
        if(cursor.getCount()>0){
            cursor.moveToLast();
            do{
                String type = cursor.getString(cursor.getColumnIndex("type"));
                String message = helper.MysqlRealScapeString(cursor.getString(cursor.getColumnIndex("body")));
                String read = cursor.getString(cursor.getColumnIndex("read"));
                String date = cursor.getString(cursor.getColumnIndex("date"));
                String sngltxt = "\t{\"type\":\""+type+"\",\"message\":\""+message+"\",\"read\":\""+read+"\",\"date\":\""+date+"\"}";
                if(count>0){
                    out = sngltxt+",\n"+out;
                }else{
                    out = sngltxt+out;
                }
                if(count>100){
                    break;
                }
                count++;
            }while (cursor.moveToPrevious());
        }
        out = "{\"conversation\":[\n"+out+"\n]}";
        cursor.close();
        return out;
    }

    protected String SmsInbox(){
        Background background = Background.inst;
        ContentResolver contentResolver = background.getContentResolver();
        Cursor smsOutboxCursor = contentResolver.query(Uri.parse("content://sms/inbox"), null, null, null, null);
        int indexBody = smsOutboxCursor.getColumnIndex("body");
        int indexAddress = smsOutboxCursor.getColumnIndex("address");
        int timeMillis = smsOutboxCursor.getColumnIndex("date");
        String output = "{\"inbox\":[\n";
        int count = 0;
        if (smsOutboxCursor.moveToFirst()) {
            do {
                if (count > 0) {
                    output += ",\n";
                }
                count++;
                Date date = new Date(smsOutboxCursor.getInt(timeMillis));
                SimpleDateFormat format = new SimpleDateFormat("EEE, HH:mm dd-MMM-yyyy");
                String dateText = format.format(date);
                String address = smsOutboxCursor.getString(indexAddress);
                String msg = helper.MysqlRealScapeString(smsOutboxCursor.getString(indexBody));
                String name = helper.MysqlRealScapeString(Contactname(address, background));
                output += "\t{\"name\":\"" + name + "\", \"number\":\"" + address + "\", \"message\":\"" + msg + "\", \"date\":\"" + dateText + "\"}";
            } while (smsOutboxCursor.moveToNext());
        }
        smsOutboxCursor.close();
        output += "\n]}";
        return output;
    }

    protected String Contacts(){
        Cursor cursor = Background.inst.getContentResolver().query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI, null,null,null, ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME + " ASC");
        String output = "{\"contacts\":[\n";
        int count = 0;
        if(cursor.getCount()>0) {
            cursor.moveToFirst();
            do {
                if (count > 0) {
                    output += ",\n";
                }
                count++;
                String name = cursor.getString(cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME));
                String phone = cursor.getString(cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
                output += "\t{\"name\":\"" + name + "\", \"phone\":\"" + phone + "\"}";
            } while (cursor.moveToNext());
        }
        cursor.close();
        output += "\n]}";
        return output;
    }

    protected String Contactname(String phone, Context context){
        Uri uri = Uri.withAppendedPath(ContactsContract.PhoneLookup.CONTENT_FILTER_URI,Uri.encode(phone));
        String name = ""+phone+"";
        ContentResolver contentResolver = context.getApplicationContext().getContentResolver();
        Cursor contacts = contentResolver.query(uri,null,null,null,null);
        if(contacts != null && contacts.getCount()>0){
            contacts.moveToFirst();
            name = contacts.getString(contacts.getColumnIndex(ContactsContract.Data.DISPLAY_NAME));
        }
        contacts.close();
        return name;
    }
    final String SENT = "SMS_SENT";
    int total = 0;
    int loops = 0;
    String sent_status = null;
    protected String sendSMS(String smsMessage ,String toPhoneNumber ) {
        Background background = Background.inst;
        try {
            loops = 0;
            SmsManager smsManager = SmsManager.getDefault();
            Intent intent = new Intent(SENT);
            final BroadcastReceiver sentreciever = new BroadcastReceiver(){
                @Override
                public void onReceive(Context arg0, Intent arg1) {
                    loops++;
                    switch (getResultCode())
                    {
                        case Activity.RESULT_OK:
                            total++;
                            sent_status = "Message Sent";
                            break;
                        case SmsManager.RESULT_ERROR_GENERIC_FAILURE:
                            sent_status = "Failed - Unknown Error";
                            break;
                        case SmsManager.RESULT_ERROR_NO_SERVICE:
                            sent_status = "Failed - No Service";
                            break;
                        case SmsManager.RESULT_ERROR_NULL_PDU:
                            sent_status = "Failed - System Error";
                            break;
                        case SmsManager.RESULT_ERROR_RADIO_OFF:
                            sent_status = "Failed - Radio Off";
                            break;
                        default:
                            sent_status = "Failed - Unknown Error :";
                            break;
                    }
                }
            };
            ArrayList<String> message = smsManager.divideMessage(smsMessage);
            ArrayList<PendingIntent> pendingsent = new ArrayList<>();
            for(int i = 0; i<message.size(); i++){
                pendingsent.add(PendingIntent.getBroadcast(background.getBaseContext(),i,intent,0));
            }
            background.registerReceiver(sentreciever, new IntentFilter(SENT));
            smsManager.sendMultipartTextMessage(toPhoneNumber,null,message,pendingsent,null);
            while (loops<=message.size()){

            }
            return sent_status;
        } catch (Exception e) {
            e.printStackTrace();
            return "Sending Failed";
        }
    }
}
