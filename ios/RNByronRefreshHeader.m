#import "RNByronRefreshHeader.h"
#import <React/RCTRefreshableProtocol.h>
#import "RCTUtils.h"

@interface RNByronRefreshHeader () <RCTRefreshableProtocol>
@end

@implementation RNByronRefreshHeader

- (instancetype)init {
    self = [super init];
    return self;
}

RCT_NOT_IMPLEMENTED(-(instancetype)initWithCoder : (NSCoder *)aDecoder)

- (void)setRefreshing:(BOOL)refreshing {
    if (refreshing) {
        [self beginRefreshing];
    } else {
        [self endRefreshing];
    }
}

#pragma mark - 重写方法
#pragma mark 在这里做一些初始化配置（比如添加子控件）
- (void)prepare {
    [super prepare];
}

#pragma mark 在这里设置子控件的位置和尺寸
- (void)placeSubviews {
    [super placeSubviews];
}

#pragma mark 监听scrollView的contentOffset改变
- (void)scrollViewContentOffsetDidChange:(NSDictionary *)change {
    [super scrollViewContentOffsetDidChange:change];
}

#pragma mark 监听scrollView的contentSize改变
- (void)scrollViewContentSizeDidChange:(NSDictionary *)change {
    [super scrollViewContentSizeDidChange:change];
}

#pragma mark 监听scrollView的拖拽状态改变
- (void)scrollViewPanStateDidChange:(NSDictionary *)change {
    [super scrollViewPanStateDidChange:change];
}

#pragma mark 监听控件的刷新状态
- (void)setState:(MJRefreshState)state {
    MJRefreshCheckState;
    if (_onChangeState) {
        _onChangeState(@{@"state": @(state)});
    }
}

#pragma mark 监听拖拽比例（控件被拖出来的比例）
- (void)setPullingPercent:(CGFloat)pullingPercent {
    [super setPullingPercent:pullingPercent];
}

@synthesize refreshing;

@synthesize onRefresh;

@end
