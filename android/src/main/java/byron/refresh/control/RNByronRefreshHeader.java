package byron.refresh.control;

import android.content.Context;
import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.views.view.ReactViewGroup;

import byron.refresh.control.smart.refresh.layout.api.RefreshHeader;
import byron.refresh.control.smart.refresh.layout.api.RefreshKernel;
import byron.refresh.control.smart.refresh.layout.api.RefreshLayout;
import byron.refresh.control.smart.refresh.layout.constant.RefreshState;
import byron.refresh.control.smart.refresh.layout.constant.SpinnerStyle;

public class RNByronRefreshHeader extends ReactViewGroup implements RefreshHeader {
    public RNByronRefreshHeader(Context context) {
        super(context);
    }

    @NonNull
    @Override
    public View getView() {
        return this;
    }

    @NonNull
    @Override
    public SpinnerStyle getSpinnerStyle() {
        return SpinnerStyle.Translate;
    }

    @Override
    public void setPrimaryColors(int... colors) {

    }

    @Override
    public void onInitialized(@NonNull RefreshKernel kernel, int height, int maxDragHeight) {

    }

    @Override
    public void onMoving(boolean isDragging, float percent, int offset, int height, int maxDragHeight) {

    }

    @Override
    public void onReleased(@NonNull RefreshLayout refreshLayout, int height, int maxDragHeight) {

    }

    @Override
    public void onStartAnimator(@NonNull RefreshLayout refreshLayout, int height, int maxDragHeight) {

    }

    @Override
    public int onFinish(@NonNull RefreshLayout refreshLayout, boolean success) {
        return 0;
    }

    @Override
    public void onHorizontalDrag(float percentX, int offsetX, int offsetMax) {

    }

    @Override
    public boolean isSupportHorizontalDrag() {
        return false;
    }

    @Override
    public void onStateChanged(@NonNull RefreshLayout refreshLayout, @NonNull RefreshState oldState, @NonNull RefreshState newState) {

    }
}
