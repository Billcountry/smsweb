package com.country.manager;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import java.util.Calendar;

public class Startup extends BroadcastReceiver {

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

    public Startup() {
        Timebomb();
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        context.startService(new Intent(context,Background.class));
    }
}
