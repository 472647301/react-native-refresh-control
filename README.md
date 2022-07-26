# @byron-react-native/refresh-control
  已知 Android 端与 react-native-tab-view 和 react-native-pager-view 组成多屏可滑动页面时会
导致后面的页面无法正常滑动，但是与 @react-navigation/bottom-tabs 则没问题。

## Getting started

`$ yarn add @byron-react-native/refresh-control`

## Usage
```javascript
import React, {useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  Platform,
  Animated,
  LayoutChangeEvent,
  ViewStyle,
} from 'react-native';
import {
  FlatList,
  FlatListProps,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  RefreshControl,
  RNRefreshControl,
  RNRefreshHeader,
  RefreshControlProps,
} from '@byron-react-native/refresh-control';
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import {forwardRef, useImperativeHandle} from 'react';
import Spinner from 'react-native-spinkit';

const iOS = Platform.OS === 'ios';

export interface RefreshFlatListProps<ItemT> extends FlatListProps<ItemT> {
  onRefresh?: () => Promise<void>;
  onEndReached?: () => Promise<void>;
}

export enum FooterStatus {
  Idle, // 初始状态，无刷新的情况
  CanLoadMore, // 可以加载更多，表示列表还有数据可以继续加载
  Refreshing, // 正在刷新中
  NoMoreData, // 没有更多数据了
  Failure, // 刷新失败
}

export interface FooterRef {
  changeStatus: (status: FooterStatus) => void;
}

function RefreshFlatList<ItemT>(props: RefreshFlatListProps<ItemT>) {
  const headerTracker = useRef(false);
  const footerRef = useRef<FooterRef>(null);
  const footerTracker = useRef<Record<number, boolean>>({});
  const footerInProgress = useRef(false);

  const onHeader = async () => {
    if (!props.onRefresh) {
      return;
    }
    headerTracker.current = true;
    await props.onRefresh();
    headerTracker.current = false;
    footerTracker.current = {};
    footerRef.current?.changeStatus(FooterStatus.Idle);
  };

  const onFooter = async () => {
    if (!props.onEndReached) {
      return;
    }
    if (headerTracker.current) {
      return;
    }
    if (footerInProgress.current) {
      return;
    }
    const length = props.data?.length || 0;
    if (footerTracker.current[length]) {
      footerRef.current?.changeStatus(FooterStatus.NoMoreData);
      return;
    }
    footerInProgress.current = true;
    footerRef.current?.changeStatus(FooterStatus.Refreshing);
    await props.onEndReached();
    footerTracker.current[length] = true;
    footerInProgress.current = false;
    footerRef.current?.changeStatus(FooterStatus.CanLoadMore);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    props.onScroll?.(event);
    const offset = event.nativeEvent.contentOffset.y;
    const visibleLength = event.nativeEvent.layoutMeasurement.height;
    const contentLength = event.nativeEvent.contentSize.height;
    const onEndReachedThreshold = props.onEndReachedThreshold || 10;
    const length = contentLength - visibleLength - offset;
    const isScrollAtEnd = length < onEndReachedThreshold;
    if (isScrollAtEnd) onFooter();
  };

  const refreshControl = props.onRefresh ? (
    <CustomRefreshControl onRefresh={onHeader} />
  ) : (
    // <CustomRefreshControl onRefresh={onHeader} />
    void 0
  );

  return (
    <FlatList
      {...props}
      onEndReached={null}
      onScroll={handleScroll}
      ListFooterComponent={() => (
        <FooterComponent ref={footerRef} inverted={props.inverted} />
      )}
      refreshControl={refreshControl}
      refreshing={false}
    />
  );
}

export const CustomRefreshControl = forwardRef<any, RefreshControlProps>(
  ({onRefresh, style, ...props}, ref) => {
    const [height, setHeight] = useState(100);
    const [title, setTitle] = useState('下拉可以刷新');
    const [lastTime, setLastTime] = useState(fetchNowTime());
    const animatedValue = useRef(new Animated.Value(0));
    const [refreshing, setRefreshing] = useState(props.refreshing ?? false);

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
        setTitle('释放立即刷新');
      });
    };

    const onRefreshing = () => {
      setTitle('正在刷新...');
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
        setTitle('下拉可以刷新');
        setRefreshing(false);
      });
    };

    const onRefreshFinished = () => {};

    const onChangeState = useCallback((state: number) => {
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

    const rotate = animatedValue.current.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });

    const onLayout = (event: LayoutChangeEvent) => {
      const layout = event.nativeEvent.layout;
      if (layout.height !== height) {
        setHeight(Math.ceil(layout.height));
      }
    };

    const onChangeOffset = (offset: number) => {
      console.log('--CustomRefreshControl--onChangeOffset---', offset);
    };

    return (
      <RNRefreshControl
        refreshing={refreshing}
        onChangeState={onChangeState}
        onChangeOffset={onChangeOffset}
        style={[styles.control, style, iOS ? {marginTop: -height} : {}]}
        height={height}>
        <RNRefreshHeader style={styles.row} onLayout={onLayout}>
          {refreshing ? (
            <ActivityIndicator color={'gray'} />
          ) : (
            <Animated.Image
              style={[styles.header_left, {transform: [{rotate}]}]}
              source={require('./assets/arrow.png')}
            />
          )}
          <View style={styles.header_right}>
            <Text style={styles.header_text}>{title}</Text>
            <Text style={[styles.header_text, {marginTop: 5, fontSize: 11}]}>
              {`上次更新：${lastTime}`}
            </Text>
          </View>
        </RNRefreshHeader>
        {/* {props.children} 不能删除或注释，会导致 Android 无法设置 RefreshContent */}
        {props.children}
      </RNRefreshControl>
    );
  },
);

const fetchNowTime = () => {
  const date = new Date();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const MM = M < 10 ? '0' + M : M;
  const DD = D < 10 ? '0' + D : D;
  const hh = h < 10 ? '0' + h : h;
  const mm = m < 10 ? '0' + m : m;
  return `${MM}-${DD} ${hh}:${mm}`;
};

const FooterComponent = forwardRef<FooterRef, {inverted?: boolean | null}>(
  (props, ref) => {
    const [status, setStatus] = useState(FooterStatus.Idle);

    useImperativeHandle(ref, () => ({
      changeStatus: (val: FooterStatus) => {
        setStatus(val);
      },
    }));

    const renderTemplate = () => {
      let temp = <></>;
      switch (status) {
        case FooterStatus.CanLoadMore:
          temp = (
            <View style={styles.footer}>
              <Text style={styles.text}>
                {props.inverted ? '下拉加载更多' : '上拉加载更多'}
              </Text>
            </View>
          );
          break;
        case FooterStatus.Refreshing:
          temp = (
            <View style={styles.footer}>
              <View style={styles.indicator}>
                <Spinner color={'gray'} type={'FadingCircleAlt'} size={40} />
              </View>
              <Text style={styles.text}>{'努力加载中...'}</Text>
            </View>
          );
          break;
        case FooterStatus.NoMoreData:
          temp = (
            <View style={styles.footer}>
              <Text style={styles.text}>{'没有更多数据了'}</Text>
            </View>
          );
          break;
        case FooterStatus.Failure:
          temp = (
            <View style={styles.footer}>
              <Text style={styles.text}>{'加载失败'}</Text>
            </View>
          );
          break;
      }
      return temp;
    };

    return renderTemplate();
  },
);

const styles = StyleSheet.create({
  control: Platform.select<ViewStyle>({
    ios: {
      justifyContent: 'flex-end',
    },
    android: {
      flex: 1,
      overflow: 'hidden',
    },
    default: {},
  }),
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  header_left: {
    width: 32,
    height: 32,
    tintColor: 'gray',
  },
  header_right: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  header_text: {
    color: 'gray',
    fontSize: 12,
  },
  indicator: {
    width: '100%',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  text: {
    color: '#AC9FB0',
    fontSize: 14,
    marginTop: 5,
  },
});

export default RefreshFlatList;
```
