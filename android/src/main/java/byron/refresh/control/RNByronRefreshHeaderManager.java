package byron.refresh.control;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class RNByronRefreshHeaderManager extends ViewGroupManager<RNByronRefreshHeader> {
  @NonNull
  @Override
  public String getName() {
    return "RNByronRefreshHeader";
  }

  @NonNull
  @Override
  protected RNByronRefreshHeader createViewInstance(@NonNull ThemedReactContext reactContext) {
    return new RNByronRefreshHeader(reactContext);
  }
}

