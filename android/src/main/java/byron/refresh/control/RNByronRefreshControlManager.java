// RNByronRefreshControlManager.java

package byron.refresh.control;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class RNByronRefreshControlManager extends ViewGroupManager<RNByronRefreshControl> {

    @NonNull
    @Override
    public String getName() {
        return "RNByronRefreshControl";
    }

    // 初始化
    @NonNull
    @Override
    protected RNByronRefreshControl createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new RNByronRefreshControl(reactContext);
    }

    /**
     * 自定义事件
     */
    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        String onChangeStateEvent = RNByronRefreshControl.EVETN_NAME_CHANGE_STATE;
        String onChangeOffsetEvent = RNByronRefreshControl.EVETN_NAME_CHANGE_OFFSET;
        return MapBuilder.<String, Object>builder()
            .put(onChangeStateEvent, MapBuilder.of("registrationName", onChangeStateEvent))
            .put(onChangeOffsetEvent, MapBuilder.of("registrationName", onChangeOffsetEvent)).build();
    }

    @ReactProp(name = "refreshing")
    public void setRefreshing(RNByronRefreshControl view, Boolean refreshing) {
        if(refreshing){
            view.finishRefresh();
        }
    }

    @ReactProp(name = "beginstate")
    public void setBeginstate(RNByronRefreshControl view, Boolean beginstate) {
        if(beginstate){
            view.autoRefresh();
        } else  {
            view.finishRefresh();
        }
    }
}
