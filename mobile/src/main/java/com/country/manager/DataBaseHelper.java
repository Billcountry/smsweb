package com.country.manager;

/**
 * Created by Noms on 11/14/2016.
 */
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteDatabase.CursorFactory;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Base64;
import android.util.Log;

public class DataBaseHelper extends SQLiteOpenHelper{

    public DataBaseHelper(Context context){
        super(context, "countrysmsdb", null, 1);
    }
    // Called when no database exists in disk and the helper class needs
// to create a new one.
    @Override
    public void onCreate(SQLiteDatabase db)
    {
        db.execSQL("CREATE TABLE IF NOT EXISTS Groups(Group_name VARCHAR(100), Group_description TEXT)");
        db.execSQL("CREATE TABLE IF NOT EXISTS Group_Members(Contact_name VARCHAR(100),Contact_address VARCHAR(100),Group_name VARCHAR(100))");
    }
    // Called when there is a database version mismatch meaning that the version
// of the database on disk needs to be upgraded to the current version.
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion)
    {
        db.execSQL("DROP TABLE Groups");
        db.execSQL("DROP TABLE Group_Members");
        onCreate(db);
    }

    public String Addcontact(String contactname, String Address, String Groupname){
        SQLiteDatabase db = this.getWritableDatabase();
        db.execSQL("INSERT INTO Group_Members values('"+contactname+"','"+Address+"','"+Groupname+"')");
        return contactname+" Added to "+Groupname;
    }

    public boolean Groupexist(String groupname){
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM Groups WHERE Group_name='"+groupname+"'",null);
        if(c.getCount()>0){
            return true;
        }else{
            return false;
        }
    }

    public String Addgroup(String Groupname, String Description){
        if(Groupexist(Groupname)){
            return "Group Exists.";
        }
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put("Group_name",Groupname);
        values.put("Group_description",Description);
        db.insert("Groups",null,values);
        values.clear();
        return Groupname+" Added";
    }

    public String MysqlRealScapeString(String str){
        String data = null;
        if (str != null && str.length() > 0) {
            str = str.replace("\\", "\\\\");
            str = str.replace("'", "\\'");
            str = str.replace("\0", "\\0");
            str = str.replace("\n", "\\n");
            str = str.replace("\r", "\\r");
            str = str.replace("\"", "\\\"");
            str = str.replace("\\x1a", "\\Z");
            data = str;
        }
        return data;
    }



    public String Getgroups(String search){
        String out = "{\"groups\":[\n";
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM Groups WHERE Group_name LIKE '%"+search+"%' OR Group_description LIKE '%"+search+"%'",null);
        if(cursor.getCount()>=1){
            int count = 0;
            cursor.moveToFirst();
            do{
                if(count>0){
                    out += ",\n";
                }
                count++;
                String name = MysqlRealScapeString(cursor.getString(cursor.getColumnIndex("Group_name")));
                String desc = MysqlRealScapeString(cursor.getString(cursor.getColumnIndex("Group_description")));

                out += "\t{\"name\":\""+name+"\",\"desc\":\""+desc+"\"}";
            }while (cursor.moveToNext());
        }
        return out+"\n]}";
    }

    public String Getcontacts(String group){
        String out = "{\"group_contacts\":[\n";
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM Group_Members WHERE Group_name='"+group+"'",null);
        if(cursor.getCount()>=1){
            int count = 0;
            cursor.moveToFirst();
            do{
                if(count>0){
                    out += ",\n";
                }
                count++;
                String name = MysqlRealScapeString(cursor.getString(0));
                String address = MysqlRealScapeString(cursor.getString(1));
                String groupname = MysqlRealScapeString(cursor.getString(1));

                out += "\t{\"name\":\""+name+"\",\"address\":\""+address+"\",\"group\":\""+groupname+"\"}";
            }while (cursor.moveToNext());
        }
        return out+"\n]}";
    }

    public String Removecontact(String group, String name, String number){
        SQLiteDatabase db = this.getWritableDatabase();
        db.execSQL("DELETE FROM  Group_Members WHERE Group_name='"+group+"' AND Contact_address='"+number+"'");
        return name+" removed from "+group;
    }

    public String Removegroup(String Groupname){
        SQLiteDatabase db = this.getWritableDatabase();
        db.execSQL("DELETE FROM  Group_Members WHERE Group_name='"+Groupname+"'");
        db.execSQL("DELETE FROM  Groups WHERE Group_name='"+Groupname+"'");
        return Groupname +" and all its members have been removed from the database";
    }

}








