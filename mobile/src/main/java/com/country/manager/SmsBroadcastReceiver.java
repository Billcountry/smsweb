package com.country.manager;

/**
 * Created by Noms on 11/15/2016.
 */

import android.app.*;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.telephony.SmsMessage;
import java.text.SimpleDateFormat;
import java.util.Date;

public class SmsBroadcastReceiver extends BroadcastReceiver {

    public static final String SMS_BUNDLE = "pDus";

        protected String Contactname(String phone, Context context){
            Uri uri = Uri.withAppendedPath(ContactsContract.PhoneLookup.CONTENT_FILTER_URI,Uri.encode(phone));
            String name = "Unknown("+phone+")";
            ContentResolver contentResolver = context.getApplicationContext().getContentResolver();
            Cursor contacts = contentResolver.query(uri,null,null,null,null);
            if(contacts != null && contacts.getCount()>0){
                contacts.moveToFirst();
                name = contacts.getString(contacts.getColumnIndex(ContactsContract.Data.DISPLAY_NAME));
            }
            contacts.close();
            return name;
        }

    public void onReceive(Context context, Intent intent) {
        Bundle intentExtras = intent.getExtras();

        if (intentExtras != null) {
            Object[] sms = (Object[]) intentExtras.get("pdus");
            String smsMessageStr = "";
            for (int i = 0; i < sms.length; ++i) {
                SmsMessage smsMessage = SmsMessage.createFromPdu((byte[]) sms[i]);

                String smsBody = smsMessage.getMessageBody().toString();
                String address = smsMessage.getOriginatingAddress();
                long timeMillis = smsMessage.getTimestampMillis();

                Date date = new Date(timeMillis);
                SimpleDateFormat format = new SimpleDateFormat("dd/MM/yy");
                String cname = Contactname(address,context);
                String dateText = format.format(date);

                if(smsBody.contains("smse://")){


                }else if(smsBody.contains("smsec://")){

                }
            }

            //this will update the UI with message
        }

    }
}