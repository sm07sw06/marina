package org.androidtown.identifyinglocation;

import android.util.Log;

import java.util.Iterator;
import java.util.LinkedList;

import static java.lang.StrictMath.abs;
import static java.lang.StrictMath.pow;


/**
 * Created by user on 2015-05-03.
 */
public class Deviceinfo {

    String Mac_address = "";
    double Rssi_value = 0;
    double distance = 0.0;
    int ListSize = 0;
    double thresholds[] = {-49.48, -52.52, -55.02, -56.95, -58.54, -59.88, -61.04, -62.97, -65.90, -69, -72.52};

    LinkedList<Integer> mlist = new LinkedList<>();

    public Deviceinfo(String mac_address) {
        setMac_address(mac_address);
    }

    public boolean addValue(int val) {
        mlist.add(val);
        if(mlist.size() > 50) {
            this.ListSize = mlist.size();
        }
        return mlist.size() > 50;
    }
/*
    public int getRssi_value() {
        int Av_M = 0;
        int gap = 0;
        int temp;
        Iterator<Integer> it = mlist.iterator();
        while(it.hasNext()){
            Av_M += it.next();
        }
        Av_M /= mlist.size();

        it = mlist.iterator();
        while(it.hasNext()){
            gap = abs(Av_M - it.next());
            if (gap >= 3) {
                it.remove();
            }
        }
        if(mlist.size()==10 ||mlist.size()==0){
            Log.d("OnLeScan", "Moving Average Value" + Av_M + "\n");
            mlist.clear();
            return Av_M;
        }else{
            Av_M=0;
            it = mlist.iterator();
            while(it.hasNext()){
                Av_M += it.next();
            }
            Log.d("OnLeScan", "Moving Average Value" + Av_M/ mlist.size() + "\n");
            temp = mlist.size();
            mlist.clear();
            return Av_M /=temp;
        }
    }
    */
public int getRssi_value() {

    int Av_M = 0;

    Iterator<Integer> it = mlist.iterator();
    while(it.hasNext()){
        Av_M += it.next();
    }
    Av_M /= mlist.size();

    mlist.clear();

    return Av_M;
/*
    it = mlist.iterator();
    while(it.hasNext()){
        gap = abs(Av_M - it.next());
        if (gap >= 3) {
            it.remove();
        }
    }*/
        /*if(mlist.size()==10 ||mlist.size()==0){
            Log.d("OnLeScan", "Moving Average Value" + Av_M + "\n");
            mlist.clear();
            return Av_M;*/
    //if(){
 /*   Av_M=0;
    it = mlist.iterator();
    while(it.hasNext()){
        Av_M += it.next();
    }
*/

   // temp = mlist.size();
  //  Log.d("OnLeScan", "size" + temp + "\n");
  //  mlist.clear();
    //if(temp > 0)
   //     return Av_M / temp;
    //else
      //  return pre;
}

    public String getMac_address() {
        return Mac_address;
    }

    public void setMac_address(String mac_address) {
        this.Mac_address = mac_address;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double rssiFilter_value) {

        double d;
        double min_gap =0.0;
        double candidate=0.0;

        candidate = thresholds[0];
        min_gap = abs(rssiFilter_value - candidate);
        for(int i=1; i<11; i++)
        {
            if(abs(rssiFilter_value - thresholds[i]) < min_gap)
            {
                candidate = thresholds[i];
                min_gap = abs(rssiFilter_value - candidate);
            }
        }
        rssiFilter_value = candidate;
        Log.d("rssi","++++"   + rssiFilter_value);
        d = pow(10.0,(-51.0 - rssiFilter_value)/20.0);
        Log.d("Distance Calculate", "거리계산 : " + d + "\n");
        this.distance = d;
    }
}

