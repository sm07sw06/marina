package org.androidtown.identifyinglocation;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Shader;
import android.graphics.drawable.ShapeDrawable;
import android.view.MotionEvent;
import android.view.View;

/**
 * Created by user on 2015-05-18.
 */
public class CustomView extends View {

    private Paint paint;
    public MainActivity mmainactivity;
    Canvas mcanvas;
    Bitmap mbitmap;
/*
    double phone[] = new double[2];
    double object[] = new double[2];
    double fixed1[] = new double[2];
    double fixed2[] = new double[2];
*/
    int i=0;
    float curX=0; float curY=0;

    public CustomView(Context context){
        super(context);

        init(context);

    }

    private void init(Context context){
        paint = new Paint();
        paint.setAntiAlias(true);

    }

    private void draw1(){
        paint.setStyle(Paint.Style.FILL);
        paint.setColor(Color.RED);
        //mcanvas.drawRect(100,100,200,200,paint);

        paint.setStyle(Paint.Style.STROKE);
        paint.setARGB(128, 0, 255, 0);
        paint.setStrokeWidth(10.0f);
        //mcanvas.drawRect(100,100,200,200,paint);

        paint.setStyle(Paint.Style.STROKE);
        paint.setColor(Color.BLUE);

        DashPathEffect effect = new DashPathEffect(new float[]{5,5},1);
        paint.setPathEffect(effect);
        mcanvas.drawLine(100,300,500,500,paint);

        ShapeDrawable drawable1 = new ShapeDrawable();
        //RectShape shape1 = new RectShape();
        //shape1.resize(200,200);
        //drawable1.setShape(shape1);
        drawable1.setBounds(300, 100, 500, 300);

        drawable1.draw(mcanvas);

        LinearGradient gradient1 = new LinearGradient(0,0,0,300, Color.RED,Color.BLACK, Shader.TileMode.CLAMP);
        paint.setShader(gradient1);

        //shape1.resize(300,300);
        drawable1.setBounds(400, 300, 700, 600);
        drawable1.draw(mcanvas);

        mcanvas.drawPoint(400,400,paint);

    }


    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        if(w>0&&h>0){
            mbitmap = Bitmap.createBitmap(w,h,Bitmap.Config.ARGB_8888);
            mcanvas = new Canvas();
            mcanvas.setBitmap(mbitmap);

            draw1();

        }

        super.onSizeChanged(w, h, oldw, oldh);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

       // canvas.drawRect(curX,curY,curX+100,curY+100,paint);
    //    if(mmainactivity.phone[0]  )
        canvas.drawPoint(curX + (float)mmainactivity.phone[0]*100, curY + (float) mmainactivity.phone[1]*100, paint);
       // canvas.drawPoint(curX + (float)0*100, curY + (float) 0*100, paint);
        paint.setStrokeWidth(5);
        paint.setColor(Color.RED);
        canvas.drawLine(curX + (float) mmainactivity.phone[0]*100, curY + (float) mmainactivity.phone[1]*100,curX+(float)mmainactivity.object1[0]*100, curY+(float)mmainactivity.object1[1]*100,paint);
        //canvas.drawLine(curX + (float) 0*100, curY + (float) 0*100,curX+(float)5*100, curY+(float)-13*100,paint);
        canvas.drawCircle(curX,curY,100,paint);
        canvas.drawCircle(curX,curY,200,paint);
        canvas.drawCircle(curX,curY,300,paint);
        canvas.drawCircle(curX,curY,400,paint);
        canvas.drawCircle(curX,curY,500,paint);
        canvas.drawCircle(curX,curY,600,paint);
        canvas.drawCircle(curX,curY,700,paint);
        canvas.drawCircle(curX,curY,800,paint);
        canvas.drawCircle(curX,curY,900,paint);
        paint.setStrokeWidth(20);
        canvas.drawPoint(curX+(float)mmainactivity.object1[0]*100, curY+(float)mmainactivity.object1[1]*100,paint);
      //  canvas.drawPoint(curX+(float)2*100, curY+(float)-1.5*100,paint);

        paint.setColor(Color.RED);
        canvas.drawPoint(curX+(float)mmainactivity.fixed1[0]*100, curY+(float)mmainactivity.fixed1[1]*100,paint);
        canvas.drawPoint(curX+(float)mmainactivity.fixed2[0]*100, curY+(float)mmainactivity.fixed2[1]*100,paint);
       // canvas.drawPoint(curX+(float)3*100, curY+(float)-4*100,paint);
      //  canvas.drawPoint(curX+(float)-3*100, curY+(float)-4*100,paint);
        invalidate();



        /*
        if(mbitmap!=null){
            canvas.drawBitmap(mbitmap,0,0,null);
            mcanvas.drawPoint(abc1.getX(),abc1.getY(),paint);

        }*/
/*
        paint.setStyle(Paint.Style.FILL);
        paint.setColor(Color.RED);
        canvas.drawRect(100,100,200,200,paint);

        paint.setStyle(Paint.Style.STROKE);
        paint.setARGB(128, 0, 255, 0);
        paint.setStrokeWidth(10.0f);
        canvas.drawRect(100,100,200,200,paint);

        paint.setStyle(Paint.Style.STROKE);
        paint.setColor(Color.BLUE);

        DashPathEffect effect = new DashPathEffect(new float[]{5,5},1);
        paint.setPathEffect(effect);
        canvas.drawLine(100,300,500,500,paint);

        ShapeDrawable drawable1 = new ShapeDrawable();
        RectShape shape1 = new RectShape();
        shape1.resize(200,200);
        drawable1.setShape(shape1);
        drawable1.setBounds(300, 100, 500, 300);

        drawable1.draw(canvas);

        LinearGradient gradient1 = new LinearGradient(0,0,0,300, Color.RED,Color.YELLOW, Shader.TileMode.CLAMP);
        paint.setShader(gradient1);

        shape1.resize(300,300);
        drawable1.setBounds(400, 300, 700, 600);
        drawable1.draw(canvas);
        */


    }




    public boolean onTouchEvent(MotionEvent event){
        int action = event.getAction();


        switch(action){
            case MotionEvent.ACTION_DOWN:


                break;

            case MotionEvent.ACTION_MOVE:

                curX = event.getX();
                curY = event.getY();
                invalidate();


              //  Calculate_cordinate();


                break;

            case MotionEvent.ACTION_UP:
                break;

            default:
                break;
        }

        return true;
    }

}
