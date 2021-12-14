import React, { useRef, useState } from "react";
import { View, Text, Animated } from "react-native";
import { requireNativeComponent, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native";
import { forwardRef, useImperativeHandle } from "react";
import { useEffect, useCallback } from "react";

const RNByronRefreshControl = requireNativeComponent("RNByronRefreshControl");

export class ByronRefreshControl extends React.PureComponent {
  render() {
    return (
      <RNByronRefreshControl {...this.props}>
        {this.props.children}
      </RNByronRefreshControl>
    );
  }
}

export const RefreshControl = forwardRef((props, ref) => {
  const [title, setTitle] = useState("下拉刷新");
  const [lastTime, setLastTime] = useState(fetchNowTime());
  const animatedValue = useRef(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [beginstate, setBeginstate] = useState(false);

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
    setTitle("松开立即刷新");
  };

  const onRefreshing = () => {
    setTitle("正在刷新...");
    if (!props.onRefresh) {
      setRefreshing(true);
      return;
    }
    props.onRefresh().then(() => {
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
    setTitle("下拉刷新");
    setRefreshing(false);
  };
  const onChangeState = useCallback((event) => {
    const { state } = event.nativeEvent;
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
        <Text style={[styles.header_text, { marginTop: 5 }]}>
          {`最后更新：${lastTime}`}
        </Text>
      </View>
    </>
  );
  return (
    <ByronRefreshControl
      beginstate={beginstate}
      refreshing={refreshing}
      onChangeState={onChangeState}
      style={[styles.header, props.style]}
    >
      {props.children ? props.children : NormalRefreshHeader}
    </ByronRefreshControl>
  );
});

const fetchNowTime = () => {
  const date = new Date();
  const h = date.getHours();
  const m = date.getMinutes();
  const hh = h < 10 ? "0" + h : h;
  const mm = m < 10 ? "0" + m : m;
  return `${hh}:${mm}`;
};

const styles = StyleSheet.create({
  header: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -100,
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
    fontSize: 14,
  },
});
