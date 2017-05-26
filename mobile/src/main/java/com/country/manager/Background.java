package com.country.manager;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Parcel;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.widget.RemoteViews;
import android.widget.TextView;

import java.io.IOException;
import java.math.BigInteger;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.ByteOrder;
import java.util.Calendar;

/**
 * An {@link IntentService} subclass for handling asynchronous task requests in
 * a service on a separate handler thread.
 * <p>
 * TODO: Customize class - update intent actions, extra parameters and static
 * helper methods.
 */
public class Background extends IntentService {
    public static Server server;
    public static Background inst;
    public Background()
    {
        super("Background");
        inst = this;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Intent launch = new Intent(this.getBaseContext(),Connect.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this.getBaseContext(),0,launch,PendingIntent.FLAG_UPDATE_CURRENT);
        Notification notification = new NotificationCompat.Builder(this)
                .setTicker("Comfy Text")
                .setContentText("Server is running")
                .setContentTitle("Comfy Text")
                .setSmallIcon(R.drawable.business)
                .setOngoing(true)
                .setContentIntent(pendingIntent)
                .build();
        startForeground(101,notification);
        onHandleIntent(intent);
        return START_STICKY ;
    }



    @Override
    protected void onHandleIntent(Intent intent) {
        inst = this;

        try{
            server = new Server();
        }catch (IOException e){
            Log.e("Webserver Error", e.getMessage());
        }
    }
}
