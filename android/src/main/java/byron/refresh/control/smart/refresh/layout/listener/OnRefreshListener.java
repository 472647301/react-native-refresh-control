package byron.refresh.control.smart.refresh.layout.listener;


import androidx.annotation.NonNull;

import byron.refresh.control.smart.refresh.layout.api.RefreshLayout;

/**
 * 刷新监听器
 * Created by scwang on 2017/5/26.
 */
public interface OnRefreshListener {
    void onRefresh(@NonNull RefreshLayout refreshLayout);
}
