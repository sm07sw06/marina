package org.androidtown.identifyinglocation;

import android.content.Context;
import android.media.MediaPlayer;

/**
 * Created by user on 2015-05-19.
 */
public class Sound {
    MediaPlayer mPlayer;

    Sound(Context context, int id){
        mPlayer = MediaPlayer.create(context,id);
    }

    void play(){
        mPlayer.seekTo(0);
        mPlayer.start();
    }

    void Stop(){
        mPlayer.pause();
        //mPlayer.stop();
    }
}
