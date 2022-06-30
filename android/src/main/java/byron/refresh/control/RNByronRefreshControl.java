package byron.refresh.control;

import android.annotation.SuppressLint;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.scroll.ReactScrollView;

import byron.refresh.control.smart.refresh.layout.SmartRefreshLayout;
import byron.refresh.control.smart.refresh.layout.api.RefreshHeader;
import byron.refresh.control.smart.refresh.layout.api.RefreshLayout;
import byron.refresh.control.smart.refresh.layout.constant.RefreshState;
import byron.refresh.control.smart.refresh.layout.simple.SimpleMultiListener;
import byron.refresh.control.smart.refresh.layout.util.SmartUtil;

@SuppressLint("ViewConstructor")
public class RNByronRefreshControl extends SmartRefreshLayout {
  //    刷新
  public static final String EVETN_NAME_CHANGE_OFFSET = "onChangeOffset";
  public static final String EVETN_NAME_CHANGE_STATE = "onChangeState";
  private final RCTEventEmitter eventEmitter;

  public RNByronRefreshControl(ThemedReactContext context) {
    super(context);
    eventEmitter = context.getJSModule(RCTEventEmitter.class);
    this.setEnableLoadMore(false);
    this.setEnableOverScrollDrag(true);
    this.setOnMultiListener(new SimpleMultiListener() {
      @Override
      public void onStateChanged(@NonNull RefreshLayout refreshLayout, @NonNull RefreshState oldState, @NonNull RefreshState newState) {
        WritableMap map = new WritableNativeMap();
        if (newState == RefreshState.None) {
          map.putInt("state", 1);
          eventEmitter.receiveEvent(getTargetId(), EVETN_NAME_CHANGE_STATE, map);
        } else if (newState == RefreshState.ReleaseToRefresh) {
          map.putInt("state", 2);
          eventEmitter.receiveEvent(getTargetId(), EVETN_NAME_CHANGE_STATE, map);
        } else if (newState == RefreshState.Refreshing) {
          map.putInt("state", 3);
          eventEmitter.receiveEvent(getTargetId(), EVETN_NAME_CHANGE_STATE, map);
        } else if (newState == RefreshState.RefreshFinish) {
          map.putInt("state", 4);
          eventEmitter.receiveEvent(getTargetId(), EVETN_NAME_CHANGE_STATE, map);
        }
      }

      @Override
      public void onHeaderMoving(RefreshHeader header, boolean isDragging, float percent, int offset, int headerHeight, int maxDragHeight) {
        WritableMap map = new WritableNativeMap();
        map.putDouble("offset", SmartUtil.px2dp(offset));
        eventEmitter.receiveEvent(getTargetId(), EVETN_NAME_CHANGE_OFFSET, map);
      }
    });
  }

  private int getTargetId() {
    return this.getId();
  }

  public void setHeight(int height) {
    this.setHeaderHeight(height);
  }

  @Override
  public void addView(View child, int index) {
    if (child instanceof RNByronRefreshHeader) {
      this.setRefreshHeader((RefreshHeader) child);
    }else if (child instanceof ReactScrollView) {
      this.setRefreshContent(child);
    }
  }
}
