package org.androidtown.identifyinglocation;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import static java.lang.StrictMath.abs;
import static java.lang.StrictMath.pow;
import static java.lang.StrictMath.sqrt;


public class MainActivity extends ActionBarActivity {

    /**
     * 블루투스 어뎁터
     */
    private BluetoothAdapter mBluetoothAdapter;
    /**
     * 블루투스 메니져, 블루투스 어뎁터 등등 자원 관리
     */
    private BluetoothManager mBluetoothManager;
    /**
     * 블루투스 기기 주소
     */
    private String mBluetoothDeviceAddress;
    /**
     * !! GATT
     */
    private BluetoothGatt mBluetoothGatt;
    /**
     * !! BT Service
     */
    private BluetoothLeService mBluetoothLeService;
    /** */
    private static Context mcontext;
    /** */
    private int mConnectionState = STATE_DISCONNECTED;
    /** */
    private BluetoothDevice mdevice;

  //  private Cordinate mCordinate;

    /*!!STATE*/
    private static final int STATE_DISCONNECTED = 0;
    private static final int STATE_CONNECTING = 1;
    private static final int STATE_CONNECTED = 2;

    private final static String TAG = MainActivity.class.getSimpleName();

    /*!! */
    private boolean mScanning;
    private Handler mHandler;
    private static BluetoothGattCallback mGattCallback;

    private static final int REQUEST_ENABLE_BT = 1;
    // Stops scanning after 10 seconds.
    private static final long SCAN_PERIOD = 10000;

    /*dev info*/
    Deviceinfo beacon1 = new Deviceinfo("78:A5:04:3E:1A:9D");
    Deviceinfo beacon2 = new Deviceinfo("54:4A:16:6F:E8:7B");
    Deviceinfo object = new Deviceinfo("54:4A:16:6F:CA:88");
    Deviceinfo B1toB2 = new Deviceinfo("b1tob2");
    Deviceinfo B1toOb = new Deviceinfo("b1toOb");
    Deviceinfo B2toOb = new Deviceinfo("b2toOb");



    /*GUI component*/
    private Button mSearch;
    private Button mConnect;

    private TextView mDirection;
    private TextView mDistance;
    private TextView mLog;
    private TextView corcor;


    private Button mService;
    boolean scann = false;
    //int number[] = new int[3];
    double number[] = new double[3];
    int a=0;
    String test_string="";
    int test_rssi=0;
    boolean threadvalue=true;
    boolean threadstartvalue =false;
    boolean running = false;
    Thread thread = new setup_device();
    int previous =0;

    double x[] = new double[100];
    double y[] = new double[100];
    int k=0;
    int state=0;

    /*MediaPlayer*/
    Sound mSoundC;

    /*Cordinate */
    static public double phone[] = new double[2];
    static public double object1[] = new double[2];
    static public double fixed1[] = new double[2];
    static public double fixed2[] = new double[2];






    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final BluetoothManager bluetoothManager =
                (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();

        // 블루투스가 활성화 되지 않은 상황이면 켤 수 있는 액티비티를 실행.
        if (mBluetoothAdapter == null || !mBluetoothAdapter.isEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
        }

        mSearch = (Button) findViewById(R.id.button);

        mConnect = (Button) findViewById(R.id.button2);
        //mDirection = (TextView) findViewById(R.id.textView4);
        mDistance = (TextView) findViewById(R.id.textView3);

        mLog = (TextView) findViewById(R.id.textView5);
        corcor = (TextView) findViewById(R.id.textView2);



        for (int i=0;i<3;i++){
            number[i] =0;
        }

        mSoundC = new Sound(this, R.raw.b9);

        for(int i=0;i<2;i++){
            phone[i] =0;
            object1[i] =0;
            fixed1[i] =0;
            fixed2[i]=0;
        }


        //Handler mHandler = new Handler();

        Intent gattServiceIntent = new Intent(this, BluetoothLeService.class);
        // service bind
        bindService(gattServiceIntent, mServiceConnection, BIND_AUTO_CREATE);
        // receiver
        registerReceiver(mGattUpdateReceiver, makeGattUpdateIntentFilter());




        LinearLayout container = (LinearLayout) findViewById(R.id.container);
        CustomView myview = new CustomView(this);
        myview.setBackgroundColor(Color.TRANSPARENT);
        container.addView(myview);

        Button button23 = (Button) findViewById(R.id.button);


    };


    private final ServiceConnection mServiceConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName componentName, IBinder service) {
            mBluetoothLeService = ((BluetoothLeService.LocalBinder) service).getService();
            if (!mBluetoothLeService.initialize()) {
                Log.e(TAG, "Unable to initialize Bluetooth");
                finish();
            }
            // Automatically connects to the device upon successful start-up initialization.
//            mBluetoothLeService.connect(object.getMac_address());
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            mBluetoothLeService = null;
        }
    };


    @Override
    protected void onResume() {
        super.onResume();
        registerReceiver(mGattUpdateReceiver, makeGattUpdateIntentFilter());//수정본.
    }

    @Override
    protected void onPause() {
        super.onPause();
        unregisterReceiver(mGattUpdateReceiver);
        mBluetoothAdapter.stopLeScan(mLeScanCallback);

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unbindService(mServiceConnection);
        mBluetoothLeService = null;
    }

    // Handles various events fired by the Service.
    // ACTION_GATT_CONNECTED: connected to a GATT server.
    // ACTION_GATT_DISCONNECTED: disconnected from a GATT server.
    // ACTION_GATT_SERVICES_DISCOVERED: discovered GATT services.
    // ACTION_DATA_AVAILABLE: received data from the device.  This can be a result of read
    //                        or notification operations.
    private final BroadcastReceiver mGattUpdateReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            final String action = intent.getAction();
            if (BluetoothLeService.ACTION_GATT_CONNECTED.equals(action)) {
                mConnectionState = STATE_CONNECTED;
            } else if (BluetoothLeService.ACTION_GATT_DISCONNECTED.equals(action)) {
                mConnectionState = STATE_DISCONNECTED;

            } else if (BluetoothLeService.ACTION_GATT_SERVICES_DISCOVERED.equals(action)) {
                Log.d("mo ", " reciver action: " + action);
            } else if (BluetoothLeService.ACTION_DATA_AVAILABLE.equals(action)) {
                 updateReceiveData(intent.getStringExtra(BluetoothLeService.EXTRA_DATA));
                //updateDisplayData(intent.getStringExtra(BluetoothLeService.EXTRA_DATA));
            }
        }
    };

    public void onButton1Clicked(View v) {
        //Intent intent = new Intent(getApplicationContext(), DeviceListActivity.class);
        //startActivity(intent);


     //   Calculate_cordinate();

        if (scann == false) {
            if (!mBluetoothAdapter.startLeScan(mLeScanCallback)) {
                Toast.makeText(this, "startLescan = NULL", Toast.LENGTH_SHORT).show();
                scann = false;
            } else {
                //mConnect.setText("STOP SEARCH");
                scann = true;
                Log.d("12345", "Scan Start");
                if(!threadstartvalue){
                    thread.start();
                    threadstartvalue = true;
                }
                running = true;

            }
        }
    }

    /*Start Algorithm Button*/
    public void onButton6Clicked(View v) throws InterruptedException {
        //fixed1 Start
        Device_Scan();
        Thread.sleep(500);
        Device_Connect(beacon1.getMac_address());
        Thread.sleep(500);
        Log.d("step","ScanAndConnect beacon1");

        write('w');                   //W, X, Y, Z 구분자 확인하기.
        Log.d("step","Write beacon1 'w'!!");
        Thread.sleep(300);


        Device_DisConnect();
        Log.d("step","Disconnect beacon1");
        Thread.sleep(700);

        Thread.sleep(1000);
        //fixed2 Start
        Device_Scan();
        Thread.sleep(500);
        Device_Connect(beacon2.getMac_address());
        Thread.sleep(500);
        Log.d("step","ScanAndConnect beacon2");

        write('w');                   //W, X, Y, Z 구분자 확인하기.
        Thread.sleep(300);
        Log.d("step","Write beacon2 'w'!!");

        Device_DisConnect();
        Thread.sleep(700);
        Log.d("step","Disconnect beacon2");

        Thread.sleep(9000);

        Device_Scan();
        Thread.sleep(500);
        Device_Connect(beacon1.getMac_address());
        Thread.sleep(500);
        Log.d("step","ScanAndConnect beacon1");

        write('x');
        Log.d("step","Write beacon1 'x'!!");
        Thread.sleep(500);

        notify_read(true);
        Thread.sleep(1500);
        Log.d("step","notify value1!!");

        Thread.sleep(1000);

        write('y');
        Log.d("step","Write beacon1 'y'!!");
        Thread.sleep(500);


        notify_read(true);
        Log.d("step","notify value2!!");
        Thread.sleep(1500);

        Device_DisConnect();
        Log.d("step","Disconnect beacon1");
        Thread.sleep(3000);


        //fixed2 Receive RSSI
        Device_Scan();
        Thread.sleep(500);
        Device_Connect(beacon2.getMac_address());
        Thread.sleep(500);
        Log.d("step", "ScanAndConnect beacon2");

        write('z');
        Log.d("step","Write beacon2 'z'!!");
        Thread.sleep(500);


        notify_read(true);
        Log.d("step","notify value3!!");
        Thread.sleep(1000);


        Device_DisConnect();
        Log.d("step","Disconnect beacon2");




    }



    public void Calculate_cordinate(){


        double d4 = B1toOb.getDistance();
        double d5 = B2toOb.getDistance();
        double d6 = B1toB2.getDistance();

        fixed1[0] = 0; fixed1[1] =0;
        fixed2[0] = d6; fixed2[1] =0;

        object1[0] = abs((pow(d4,2) - pow(d5,2) + pow(d6,2))/(2*d6));
        object1[1] = -1*sqrt(pow(d4,2)-((pow(d4,2)-pow(d5,2)+pow(d6,2))/(2*d6)));

        fixed1[0] = fixed1[0] - object1[0];
        fixed1[1] = fixed1[1] - object1[1];
        fixed2[0] = fixed2[0] - object1[0];
        fixed2[1] = fixed2[1] - object1[1];
        object1[0] = 0;
        object1[1] = 0;
        fixed1[1] = -1*fixed1[1];
        fixed2[1] = -1*fixed2[1];


        Log.d("corcor","(ox,oy)" + "(" + object1[0] + "," + object1[1] + "), (b1x,b1y)" + "(" + fixed1[0] + "," + fixed1[1] +") (b2x,b2y)" + "(" + fixed2[0] + "," + fixed2[1]+")");
        Log.d("corcor","B1toOb" + d4 + " B2toOb "+ d5 + "B1toB2 " + d6);
        displayCor("(ox,oy)" + "(" + (double) ((int) (object1[0] * 100.0) / 100.0) + "," + (double) ((int) (object1[1] * 100.0) / 100.0) + "), (b1x,b1y)" + "(" + (double) ((int) (fixed1[0] * 100.0) / 100.0) + "," + (double) ((int) (fixed1[1] * 100.0) / 100.0) +") (b2x,b2y)" + "(" + (double) ((int) (fixed2[0] * 100.0) / 100.0) + "," + (double) ((int) (fixed2[1] * 100.0) / 100.0)+")");

        if(object.getDistance()<=0.5){
//            Toast.makeText(this, "가까운 곳에 물건이 있습니다!", Toast.LENGTH_SHORT).show();
            mSoundC.play();
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            mSoundC.Stop();
        }
        else{
            mSoundC.Stop();
        }
       // Log.d("cor", "a : "+ phone[0] +" b: "+phone[1] +" c: "+object1[0] +" d: "+object1[1] +" e: "+fixed1[0] +" f: "+fixed1[1] +" g: "+fixed2[0] +" h: "+fixed2[1]);

       beacon1.ListSize=0;
       beacon2.ListSize=0;
       object.ListSize=0;
        Log.d("corcorxy", ""+object1[0] +" "+object1[1]);
        Log.d("corcorxy", ""+beacon1.ListSize +" "+beacon2.ListSize);
     //   Log.d("corcory", ""+object1[1]);

        String filename1 = "corcorx.txt";
        String filename2 = "corcory.txt";

        try {
            FileOutputStream output = openFileOutput(filename1,Context.MODE_WORLD_READABLE);
            FileOutputStream output2 = openFileOutput(filename2,Context.MODE_WORLD_READABLE);


            x[k++] = object1[0];
            y[k++] = object1[1];


            //output.write(phone[0]);     // 배열의 이름을 파라미터로 전달해주면 한꺼번에(아마도 배열의 크기가 크면 안될 듯) 출력해 준다.

            if(k==99) {
                String a = new String(String.format("%2.4lf\n", x[0]));
                String b = new String(String.format("%2.4lf\n", y[0]));
                for (int i = 1; i < 100; i++) {
                    a = a.concat(new String(String.format("%2.4lf\n", x[i])));
                    b = b.concat(new String(String.format("%2.4lf\n", y[i])));
                }

                output.write(a.getBytes());
                output2.write(b.getBytes());

                output.close();
                output2.close();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }


    }

    /*(func)Setting_Characteristic*/
    public BluetoothGattCharacteristic Setting_Characteristic(){
        List<BluetoothGattService> lstBS = mBluetoothLeService.getSupportedGattServices();
        BluetoothGattCharacteristic characteristic = null;
        for (int i = 0; i < lstBS.size(); i++){
            characteristic = lstBS.get(i).getCharacteristic(UUID.fromString("0000ffe1-0000-1000-8000-00805f9b34fb"));
            if (characteristic != null)
                break;
        }
        return characteristic;
    }

    /*(func)Device_scan*/
    public void Device_Scan(){
        if (scann == false) {
            if (!mBluetoothAdapter.startLeScan(mLeScanCallback)) {
                Toast.makeText(this, "startLescan = NULL", Toast.LENGTH_SHORT).show();
                scann = false;
            }
            else scann = true;
            Log.d("step1","DeviceScan Finish");
        }
    }

    /*(func)Device_Connect*/
    public void Device_Connect(String Mac){
        if (scann == true && mConnectionState == STATE_DISCONNECTED) {
            mBluetoothAdapter.stopLeScan(mLeScanCallback);

            if(mBluetoothLeService.connect(Mac)) {
                mBluetoothAdapter.stopLeScan(mLeScanCallback);
                scann = false;
                mConnectionState = STATE_CONNECTED;
            }
            else{
                mConnectionState = STATE_DISCONNECTED;
                scann = false;
            }
        }
    }

    /*(func)ScanAndConnect*/
    public void ScanAndConnect(String Mac) throws InterruptedException {
        Log.d("step1","connect Start");
        while(mConnectionState==STATE_DISCONNECTED) {
            Device_Scan();
            Log.d("step","scan!!");
            Log.d("step","scan!!"+Mac);
            displayLog("scan : " + Mac);
            Thread.sleep(200);
            Device_Connect(Mac);
            //Thread.sleep(1000);
            Log.d("step","Connect!!");
            displayLog("Connect : " + Mac);
        }
    }

    /*(func)Device_Disconnect*/
    public void Device_DisConnect(){
        Log.d("step1","disconnect Start");
        mBluetoothLeService.disconnect();
        mConnectionState = STATE_DISCONNECTED;
        displayLog("Disconnect!");
    }

    /*(func)notify_read*/
    public void notify_read(boolean enable){
        BluetoothGattCharacteristic characteristic = null;
        characteristic = Setting_Characteristic();
        mBluetoothLeService.setCharacteristicNotification(characteristic, enable);
        displayLog("Notify READ !!");
    }

    /*(func)write(char ch)*/
    public void write(char ch){
        BluetoothGattCharacteristic characteristic = null;
        characteristic = Setting_Characteristic();

        if(ch=='w') {
            //sequence[0] ='w';
            mBluetoothLeService.writeRemoteCharacteristic(characteristic, 'w');
        }
        else if(ch=='x'){
            //sequence[1] ='x';
            mBluetoothLeService.writeRemoteCharacteristic(characteristic, 'x');
        }
        else if(ch=='y'){
            //sequence[2] ='y';
            mBluetoothLeService.writeRemoteCharacteristic(characteristic, 'y');
        }
        else if(ch=='z'){
            //sequence[3] ='z';
            mBluetoothLeService.writeRemoteCharacteristic(characteristic, 'z');
        }

        displayLog("Write : " + ch);

    }

    /*(func)IntentFilter*/
    private static IntentFilter makeGattUpdateIntentFilter() {
        final IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_CONNECTED);
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_DISCONNECTED);
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_SERVICES_DISCOVERED);
        intentFilter.addAction(BluetoothLeService.ACTION_DATA_AVAILABLE);
        return intentFilter;
    }

    /*(func)setBeacontoObject()*/
    public void setBtoO(){

        if(number[0] != 0){
            B1toB2.Rssi_value = -1*number[0];
            B1toB2.setDistance(-1*number[0]);
        }
        if(number[1] != 0){
            B1toOb.Rssi_value = -1*number[1];
            B1toOb.setDistance(-1*number[1]);
        }
        if(number[2] != 0){
            B2toOb.Rssi_value = -1*number[2];
            B2toOb.setDistance(-1*number[2]);
        }

        displayLog("Setting Rssi_value : " + number[0] + " : " + number[1] + " : " + number[2]);
        Log.d("step","SettingRssi [1] :" + B1toB2.Rssi_value + " [2] : " + B1toOb.Rssi_value + " [3] : " + B2toOb.Rssi_value);
        Log.d("step","SettingDistance [1] :" + B1toB2.getDistance() + " [2] : " + B1toOb.getDistance() + " [3] : " + B2toOb.getDistance());
    }

    /*(func)UpdateReceiveDATA(String data)*/
    int i=0;
    public void updateReceiveData(String data){


        if(data != null){

            //int temp = Integer.parseInt(data);

            double temp = Double.parseDouble(data);
            //int temp2 =0;

            //number[state]=temp;
             // while(i<3){
                //if(number[i]==temp) break;
               // else if(number[i]==0){
                    number[i]=temp;
                    i++;
                    //break;
                }
        setBtoO();

        Log.d("step", "Receive Data [1] :" + number[0] + " [2] : " + number[1] + " [3] : " + number[2]);
            }

      //  }



   // }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
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
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    /*(func)displayRssi1*/
    protected void displayDistance(final double tex) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mDistance.setText(""+tex);
            }
        });
    }

    /*(func)displayRssi1*/
    protected void displayLog(final String data) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mLog.setText(data);
            }
        });

    }
    protected void displayCor(final String data) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                corcor.setText(data);
            }
        });

    }

    /*(func)displayRssi2*/
    protected void displayRssi2(final String tex) {

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mDirection.setText(tex);
            }
        });
    }

    public class setup_device extends Thread{
        int temp_R;

        public void run(){
            while(threadvalue){
                if(running) {
                    synchronized (this) {/*
                            if (test_string.equals(beacon1.getMac_address())) {
                                Log.d("OnLeScan", "맥주소 (b1) 찾음");
                                Log.d("OnLeScan", "(beacon1)" + test_rssi);
                                try {
                                    //beacon1.setDistance(test_rssi);
                                    //Log.d("step", "beacon1 RSSI" + test_rssi);

                                    if (beacon1.addValue(test_rssi)) {
                                        temp_R = beacon1.getRssi_value();
                                        beacon1.setDistance(temp_R);
                                        Log.d("step", "Distance of object" + beacon1.getDistance());

                                        if (beacon1.ListSize > 50 && beacon2.ListSize > 50) {
                                            Calculate_cordinate(beacon1.getDistance(), beacon2.getDistance());
                                            mBluetoothAdapter.stopLeScan(mLeScanCallback);
                                            scann = false;
                                            running = false;
                                            //threadvalue = false;
                                        }

                                    }
                                    Thread.sleep(100);

                                } catch (InterruptedException e) {
                                    e.printStackTrace();
                                }
                            } else if (test_string.equals(beacon2.getMac_address())) {
                                Log.d("OnLeScan", "맥주소 (b2) 찾음");
                                Log.d("OnLeScan", "(beacon2)" + test_rssi);
                                try {
                                    beacon2.setDistance(test_rssi);

                                    if (beacon2.addValue(test_rssi)) {
                                        temp_R = beacon2.getRssi_value();
                                        beacon2.setDistance(temp_R);
                                        Log.d("step", "Distance of object" + beacon2.getDistance());

                                        if (beacon1.ListSize > 50 && beacon2.ListSize > 50) {
                                            Calculate_cordinate(beacon1.getDistance(), beacon2.getDistance());
                                            mBluetoothAdapter.stopLeScan(mLeScanCallback);
                                            scann = false;
                                            running = false;
                                            //threadvalue = false;
                                        }
                                    }
                                    Thread.sleep(100);

                                } catch (InterruptedException e) {
                                    e.printStackTrace();
                                }
                                Log.d("OnLeScan", "(b2) complete");

                            } */if (test_string.equals(object.getMac_address())) {
                            Log.d("OnLeScan", "맥주소 (object) 찾음");
                            Log.d("OnLeScan", "(object)" + test_rssi);
                            try {
                            //    object.setDistance(test_rssi);
                            //    Log.d("step", "object RSSI" + test_rssi);
                                if (object.addValue(test_rssi)) {
                                    temp_R = object.getRssi_value();
                                    object.setDistance(temp_R);
                                    displayDistance((double) ((int) (object.getDistance() * 100.0) / 100.0));
                                    Log.d("step", "Distance of object" + object.getDistance());

                                    if(object.ListSize > 50) {
                                        Calculate_cordinate();
                                        mBluetoothAdapter.stopLeScan(mLeScanCallback);
                                        scann=false;
                                        running = false;
                                        //threadvalue =false;
                                    }
                                }
                                Thread.sleep(100);
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }  else Log.d("OnLeScan", "default");



                    }
                }
            }
        }
    }
    /*(func)BluetoothAdapter.LeScanCallback*/
    private BluetoothAdapter.LeScanCallback mLeScanCallback =
            new BluetoothAdapter.LeScanCallback() {
                @Override
                public void onLeScan(final BluetoothDevice device, final int rssi, byte[] scanRecord) {
                    String str = device.getAddress();
                    test_string = str;
                    test_rssi = rssi;
                }
            };
}
