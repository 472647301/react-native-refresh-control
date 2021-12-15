import React, { useRef, useState } from "react";
import { View, Text, Animated, Platform } from "react-native";
import { requireNativeComponent, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native";
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
});
