package byron.refresh.control.smart.refresh.layout.listener;

import android.content.Context;

import androidx.annotation.NonNull;

import byron.refresh.control.smart.refresh.layout.api.RefreshHeader;
import byron.refresh.control.smart.refresh.layout.api.RefreshLayout;

/**
 * 默认Header创建器
 * Created by scwang on 2018/1/26.
 */
public interface DefaultRefreshHeaderCreator {
    @NonNull
    RefreshHeader createRefreshHeader(@NonNull Context context, @NonNull RefreshLayout layout);
}
