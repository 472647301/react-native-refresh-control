import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { View, Text, Animated, Platform, requireNativeComponent, StyleSheet, ActivityIndicator } from "react-native";

const iOS = Platform.OS === "ios";

const RNByronRefreshControl = requireNativeComponent("RNByronRefreshControl");

export const RNRefreshHeader = requireNativeComponent(
  iOS ? "RNByronCustomHeader" : "RNByronRefreshHeader"
);

export function RNRefreshControl(props) {
  const onChangeState = (event) => {
    if (!props.onChangeState) {
      return;
    }
    const { state } = event.nativeEvent;
    props.onChangeState(state);
  };

  const onChangeOffset = (event) => {
    if (!props.onChangeOffset) {
      return;
    }
    const { offset } = event.nativeEvent;
    props.onChangeOffset(offset);
  };

  if (iOS) {
    return (
      <RNByronRefreshControl
        {...props}
        onChangeState={onChangeState}
        onChangeOffset={onChangeOffset}
      >
        {props.children}
      </RNByronRefreshControl>
    );
  }

  return (
    <View style={styles.control}>
      <RNByronRefreshControl
        {...props}
        onChangeState={onChangeState}
        onChangeOffset={onChangeOffset}
      >
        {props.children}
      </RNByronRefreshControl>
    </View>
  );
}

export const RefreshControl = forwardRef(
  ({ onRefresh, style, ...props }, ref) => {
    const [height, setHeight] = useState(100);
    const [title, setTitle] = useState("下拉可以刷新");
    const [lastTime, setLastTime] = useState(fetchNowTime());
    const animatedValue = useRef(new Animated.Value(0));
    const [refreshing, setRefreshing] = useState(false);
    
    useEffect(() => {
      setRefreshing(props.refreshing ?? false);
    }, [props.refreshing]);

    useImperativeHandle(ref, () => ({
      startRefresh: () => {
        setRefreshing(true);
      },
      stopRefresh: () => {
        setRefreshing(false);
      },
    }));

    const onPullingRefresh = () => {
      Animated.timing(animatedValue.current, {
        toValue: -180,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTitle("释放立即刷新");
      });
    };

    const onRefreshing = () => {
      setTitle("正在刷新...");
      setRefreshing(true);
      if (onRefresh) {
        onRefresh().then(() => {
          setRefreshing(false);
          setLastTime(fetchNowTime());
        });
      } else {
        setTimeout(() => {
          setRefreshing(false);
          setLastTime(fetchNowTime());
        }, 200);
      }
    };

    const onIdleRefresh = () => {
      Animated.timing(animatedValue.current, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTitle("下拉可以刷新");
        setRefreshing(false);
      });
    };

    const onRefreshFinished = () => {};

    const onChangeState = useCallback((state) => {
      props.onChangeState && props.onChangeState(state);
      switch (state) {
        case 1: // 可以下拉
          onIdleRefresh();
          break;
        case 2: // 正在下拉
          onPullingRefresh();
          break;
        case 3: // 正在刷新
          onRefreshing();
          break;
        case 4: // 刷新完成
          onRefreshFinished();
          break;
        default:
      }
    }, []);

    // 自己做节流
    const onChangeOffset = (offset) => {
      props.onChangeOffset && props.onChangeOffset(offset);
    };

    const rotate = animatedValue.current.interpolate({
      inputRange: [0, 180],
      outputRange: ["0deg", "180deg"],
    });

    const onLayout = (event) => {
      const layout = event.nativeEvent.layout;
      if (layout.height !== height) {
        setHeight(Math.ceil(layout.height));
      }
    };

    return (
      <RNRefreshControl
        refreshing={refreshing}
        onChangeState={onChangeState}
        onChangeOffset={onChangeOffset}
        style={[styles.control, style, iOS ? { marginTop: -height } : {}]}
        height={height}
      >
        <RNRefreshHeader style={styles.row} onLayout={onLayout}>
          {refreshing ? (
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
        </RNRefreshHeader>
        {/* {props.children} 不能删除或注释，会导致 Android 无法设置 RefreshContent */}
        {props.children}
      </RNRefreshControl>
    );
  }
);

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
      justifyContent: "flex-end",
    },
    android: {
      flex: 1,
      overflow: "hidden",
    },
  }),
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
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
