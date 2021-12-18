import React, { useRef, useState } from "react";
import { View, Text, Animated, Platform } from "react-native";
import { requireNativeComponent, StyleSheet } from "react-native";
import { FlatList, ActivityIndicator } from "react-native";
import { forwardRef, useImperativeHandle } from "react";
import { useEffect, useCallback } from "react";

const RNByronRefreshControl = requireNativeComponent("RNByronRefreshControl");

export class ByronRefreshControl extends React.PureComponent {
  onChangeState = (event) => {
    const { state } = event.nativeEvent;
    if (this.props.onChangeState) {
      this.props.onChangeState(state);
    }
  };

  render() {
    if (Platform.OS === "android") {
      return (
        <RNByronRefreshControl
          {...this.props}
          onChangeState={this.onChangeState}
        />
      );
    }
    return (
      <RNByronRefreshControl {...this.props} onChangeState={this.onChangeState}>
        {this.props.children}
      </RNByronRefreshControl>
    );
  }
}

export const RefreshControl = forwardRef((props, ref) => {
  const [title, setTitle] = useState("下拉可以刷新");
  const [lastTime, setLastTime] = useState(fetchNowTime());
  const animatedValue = useRef(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [beginstate, setBeginstate] = useState(false);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    startRefresh: () => {
      setBeginstate(true);
    },
    stopRefresh: () => {
      setBeginstate(false);
    },
  }));

  useEffect(() => {
    if (typeof props.refreshing !== "boolean") {
      return;
    }
    setRefreshing(props.refreshing);
  }, [props.refreshing]);

  const onPullingRefresh = () => {
    Animated.timing(animatedValue.current, {
      toValue: -180,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {});
    setTitle("释放立即刷新");
  };

  const onRefreshing = () => {
    setLoading(true);
    setTitle("正在刷新...");
    if (!props.onRefresh) {
      setRefreshing(true);
      return;
    }
    props.onRefresh().then(() => {
      setLoading(false);
      setRefreshing(true);
      setLastTime(fetchNowTime());
    });
  };

  const onIdleRefresh = () => {
    Animated.timing(animatedValue.current, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {});
    setTitle("下拉可以刷新");
    setRefreshing(false);
  };
  const onChangeState = useCallback((state) => {
    props.onChangeState && props.onChangeState(state);
    switch (state) {
      case 1:
        onIdleRefresh();
        break;
      case 2:
        onPullingRefresh();
        break;
      case 3:
        onRefreshing();
        break;
      default:
    }
  }, []);

  const rotate = animatedValue.current.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const NormalRefreshHeader = (
    <>
      {loading ? (
        <ActivityIndicator color={"gray"} />
      ) : (
        <Animated.Image
          style={[styles.header_left, { transform: [{ rotate }] }]}
          source={require("./assets/arrow.png")}
        />
      )}
      <View style={styles.header_right}>
        <Text style={styles.header_text}>{title}</Text>
        <Text style={[styles.header_text, { marginTop: 5, fontSize: 11 }]}>
          {`上次更新：${lastTime}`}
        </Text>
      </View>
    </>
  );
  return (
    <ByronRefreshControl
      beginstate={beginstate}
      refreshing={refreshing}
      onChangeState={onChangeState}
      style={props.style || styles.control}
    >
      {props.children ? props.children : NormalRefreshHeader}
    </ByronRefreshControl>
  );
});

export const RefreshFlatList = forwardRef((props, ref) => {
  const refreshRef = useRef(null);
  const onEndReachedTracker = useRef({});
  const [onEndReachedInProgress, setOnEndReachedInProgress] = useState(false);

  // 扩展FlatList方法，暂时没想的其他办法
  // 不能使用useImperativeHandle扩展
  useEffect(() => {
    ref.current["startRefresh"] = () => {
      refreshRef.current?.startRefresh();
    };
    ref.current["stopRefresh"] = () => {
      refreshRef.current?.stopRefresh();
    };
  }, []);

  const onRefresh = async () => {
    if (!props.onRefresh) {
      return;
    }
    await props.onRefresh();
    onEndReachedTracker.current = {};
    if (onEndReachedInProgress) {
      setOnEndReachedInProgress(false);
    }
  };
  const onEndReached = async () => {
    if (!props.onEndReached) {
      return;
    }
    const len = props.data?.length;
    // If onEndReached has already been called for given data length, then ignore.
    if (len && onEndReachedTracker.current[len]) {
      return;
    }
    if (len) {
      onEndReachedTracker.current[len] = true;
    }
    setOnEndReachedInProgress(true);
    await props.onEndReached();
    setOnEndReachedInProgress(false);
  };

  const handleScroll = (event) => {
    props.onScroll?.(event);
    const offset = event.nativeEvent.contentOffset.y;
    const visibleLength = event.nativeEvent.layoutMeasurement.height;
    const contentLength = event.nativeEvent.contentSize.height;
    const onEndReachedThreshold = props.onEndReachedThreshold || 10;
    const isScrollAtEnd =
      contentLength - visibleLength - offset < onEndReachedThreshold;

    if (isScrollAtEnd) {
      onEndReached();
    }
  };

  const onListFooterComponent = () => {
    const { ListFooterComponent } = props;
    if (!onEndReachedInProgress) {
      return null;
    }
    if (ListFooterComponent) {
      return <ListFooterComponent />;
    }
    if (!props.onEndReached) {
      return null;
    }
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size={"small"} color={"gray"} />
      </View>
    );
  };

  return (
    <FlatList
      ref={ref}
      {...props}
      onEndReached={null}
      onScroll={handleScroll}
      ListFooterComponent={onListFooterComponent}
      refreshControl={
        props.refreshing ? undefined : (
          <RefreshControl ref={refreshRef} onRefresh={onRefresh} />
        )
      }
      refreshing={false}
    />
  );
});

const fetchNowTime = () => {
  const date = new Date();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const MM = M < 10 ? "0" + M : M;
  const DD = D < 10 ? "0" + D : D;
  const hh = h < 10 ? "0" + h : h;
  const mm = m < 10 ? "0" + m : m;
  return `${MM}-${DD} ${hh}:${mm}`;
};

const styles = StyleSheet.create({
  control: Platform.select({
    ios: {
      height: 100,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: -100,
    },
    android: {
      flex: 1,
    },
  }),
  header_left: {
    width: 32,
    height: 32,
    tintColor: "gray",
  },
  header_right: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
  },
  header_text: {
    color: "gray",
    fontSize: 12,
  },
  indicator: {
    width: "100%",
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
