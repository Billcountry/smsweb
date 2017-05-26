package com.country.manager;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.CompoundButton;
import android.widget.Switch;

import java.io.IOException;
import java.util.Calendar;

public class Connect extends AppCompatActivity {

    Server server;
    SharedPreferences appdata;

    public void Setprefs(String name, Object value, String type){

    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        appdata = getPreferences(MODE_PRIVATE);
        final Intent background = new Intent(Connect.this.getBaseContext(), Background.class);
        boolean state = appdata.getBoolean("power",true);
        if(state){
            try {
                if (!server.isAlive()) {
                    startService(background);
                }
            }catch(NullPointerException ex){
                startService(background);
            }
        }
        setContentView(R.layout.activity_connect);
        if(Build.VERSION.SDK_INT > Build.VERSION_CODES.LOLLIPOP){
            Checkperms();
        }
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        Switch power = (Switch) findViewById(R.id.powers);
        server = Background.server;
        power.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if(b){
                    try {
                        if (!server.isAlive()) {
                            startService(background);
                        }
                    }catch(NullPointerException ex){
                        startService(background);
                    }
                }else{
                    stopService(background);
                }
            }
        });
    }

    public class Permission{
        String name;
        int value;
        int code;
        public Permission(String name,int value, int code){
            this.name = name;
            this.value = value;
            this.code = code;
        }
    }

    public void Checkperms(){
        Permission[] permissions = new Permission[11];
        permissions[0] = new Permission("android.permission.READ_SMS",ContextCompat.checkSelfPermission(this, Manifest.permission.READ_SMS),0);
        permissions[1] = new Permission("android.permission.SEND_SMS",ContextCompat.checkSelfPermission(this, Manifest.permission.SEND_SMS),1);
        permissions[2] = new Permission("android.permission.READ_CONTACTS",ContextCompat.checkSelfPermission(this, Manifest.permission.READ_CONTACTS),2);
        permissions[3] = new Permission("android.permission.WRITE_CONTACTS",ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_CONTACTS),3);
        permissions[4] = new Permission("android.permission.INTERNET",ContextCompat.checkSelfPermission(this, Manifest.permission.INTERNET),4);
        permissions[5] = new Permission("android.permission.RECEIVE_SMS",ContextCompat.checkSelfPermission(this, Manifest.permission.RECEIVE_SMS),5);
        permissions[6] = new Permission("android.permission.WRITE_EXTERNAL_STORAGE",ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE),6);
        permissions[7] = new Permission("android.permission.READ_EXTERNAL_STORAGE",ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE),7);
        permissions[8] = new Permission("android.permission.ACCESS_NOTIFICATION_POLICY",ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_NOTIFICATION_POLICY),8);
        permissions[9] = new Permission("android.permission.WAKE_LOCK",ContextCompat.checkSelfPermission(this, Manifest.permission.WAKE_LOCK),9);
        permissions[10] = new Permission("android.permission.RECEIVE_BOOT_COMPLETED",ContextCompat.checkSelfPermission(this, Manifest.permission.RECEIVE_BOOT_COMPLETED),10);
        for(int i=0; i<permissions.length; i++) {
            Permission cur = permissions[i];
            if(ActivityCompat.shouldShowRequestPermissionRationale(this,cur.name)){

            }
            RequestPermision(cur);
        }
    }

    public void RequestPermision(Permission perm){
        if(perm.value != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(this,new String[]{perm.name},perm.code);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_connect, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            startActivity(new Intent(this,SettingsActivity.class));
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
